import type { ReactNode } from 'react';

export interface SearchState {
  query: string;
  mode: 'search' | 'result' | 'settings';
}

export interface ResultItem {
  id: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  category: string;
  color: string;
}
