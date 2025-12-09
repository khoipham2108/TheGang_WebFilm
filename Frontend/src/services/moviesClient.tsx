import axios from "axios";

// Base URL should match the backend API
// Base URL should match the backend API. Set `VITE_BACKEND_URL` to `http://localhost:8000/api`
const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";

export interface Movie {
  id: number;
  title: string;
  overview?: string | null;
  poster_path?: string | null;
  poster_url?: string | null;
  release_date?: string | null;
  vote_average?: number | null;
}

export interface MovieList {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

async function handleError(err: any): Promise<never> {
  console.error(
    "MoviesClient error",
    err?.response?.data || err?.message || err
  );
  const message =
    err?.response?.data?.detail || err?.message || "Unknown error";
  throw new Error(message);
}

export async function getPopularMovies(page = 1): Promise<MovieList> {
  try {
    const res = await client.get<MovieList>(`/movies/popular?page=${page}`);
    return res.data;
  } catch (err) {
    return handleError(err);
  }
}

export async function getTopRatedMovies(page = 1): Promise<MovieList> {
  try {
    const res = await client.get<MovieList>(`/movies/top_rated?page=${page}`);
    return res.data;
  } catch (err) {
    return handleError(err);
  }
}

export async function getMovieDetail(movieId: number): Promise<Movie> {
  try {
    const res = await client.get<Movie>(`/movies/${movieId}`);
    return res.data;
  } catch (err) {
    return handleError(err);
  }
}

export async function searchMovies(
  query: string,
  page = 1
): Promise<MovieList> {
  try {
    const res = await client.get<MovieList>(
      `/movies/search?q=${encodeURIComponent(query)}&page=${page}`
    );
    return res.data;
  } catch (err) {
    return handleError(err);
  }
}

export default {
  getPopularMovies,
  getTopRatedMovies,
  getMovieDetail,
  searchMovies,
};
