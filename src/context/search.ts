import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MovieList } from '@/types'

interface SearchState {
  search: string;
  results: any[];
  setSearch: (search: string) => void;
  setResults: (results: any) => void;
  removeResults: () => void;
}
export const useSearch = create<SearchState>()(
  persist(
    (set) => ({
      search: '',
      results: [],
      setSearch: (search: string) => set({ search }),
      setResults: (results: any[]) => set({ results }),
      removeResults: () => set({ results: [] }),
    }),
    {
      name: 'searchState',
    },
  ),
)