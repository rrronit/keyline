import { useState, useEffect } from 'react';
import { SearchState, ResultItem } from '../types';
import { invoke } from '@tauri-apps/api/core';

export const useSearch = ({ sampleResults }: { sampleResults: ResultItem[] }) => {
  const [state, setState] = useState<SearchState>({
    query: '',
    mode: 'search',
  });
  const [loading, setLoading] = useState(false);
  const [filteredResults, setFilteredResults] = useState<ResultItem[]>(sampleResults);

  useEffect(() => {
    if (state.query.trim()) {
      invoke('handle_search', { query: state.query });
    } else {
      setFilteredResults(sampleResults);
      setState(prev => ({ ...prev, mode: 'search' }));
      setLoading(false);
    }
  }, [state.query]);

  return {
    state,
    setState,
    loading,
    filteredResults,
  };
};
