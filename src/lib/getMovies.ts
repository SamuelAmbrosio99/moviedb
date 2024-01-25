'use server';

import { searchMovies } from "@/api/search";
import { MovieList } from "@/types";

export const getMovies = async (search: string, page: number): Promise<MovieList | null> => {
  const result = await searchMovies(search, page);

  return result ?? null
}