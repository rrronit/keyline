import { ReactNode } from "react";

export interface SearchState {
  query: string;
  mode: "search" | "result" | "settings";
}

export interface ResultItem {
  id: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  category: string;
  color: string;
}

export interface SettingItem {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  category: string;
  color: string;
  value: boolean | string | number;
  type: "toggle" | "select" | "input";
  options?: string[];
} 