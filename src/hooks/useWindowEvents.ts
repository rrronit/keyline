import { useEffect, useState } from 'react';
import { listen } from '@tauri-apps/api/event';
import { SearchState } from '../types';
import { invoke } from '@tauri-apps/api/core';

interface UseWindowEventsProps {
  setState: (state: SearchState | ((prev: SearchState) => SearchState)) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const useWindowEvents = ({ setState, inputRef }: UseWindowEventsProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unlisten = listen<string>('open-window', _event => {
      inputRef.current?.focus();
      setIsVisible(true);
    });
    const unlisten1 = listen<string>('close-window', _event => {
      setIsVisible(false);
      setState(_ => ({ query: '', mode: 'search' }));
    });

    return () => {
      unlisten.then(f => f());
      unlisten1.then(f => f());
    };
  }, [inputRef, setState]);

  useEffect(() => {
    const handleBlur = () => {
      setIsVisible(false);
      invoke('close_window');
    };
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return { isVisible };
};
