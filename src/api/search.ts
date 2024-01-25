import { MovieList } from "@/types";
import axios from "axios";

export const searchMovies = async (search: string, page: number): Promise<MovieList | null> => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${search}&include_adult=false&language=en-US&page=${page}`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`
      }
    });
    return response?.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}