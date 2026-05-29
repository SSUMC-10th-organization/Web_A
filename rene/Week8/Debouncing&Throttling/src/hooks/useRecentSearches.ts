import { useState } from "react";

const STORAGE_KEY = "recentSearches";
const MAX_SEARCHES = 10;

// 최근
export const useRecentSearches = () => {
  const [searches, setSearches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
      return [];
    }
  });

  const addSearch = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...searches.filter((s) => s !== trimmed)].slice(0, MAX_SEARCHES);
    setSearches(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const removeSearch = (keyword: string) => {
    const updated = searches.filter((s) => s !== keyword);
    setSearches(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const clearSearches = () => {
    setSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { searches, addSearch, removeSearch, clearSearches };
};
