import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 900000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const TMDB_API = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";

const withKey = (url: string) =>
  `${url}${url.includes("?") ? "&" : "?"}api_key=${API_KEY}`;

const getUserId = (): number | null => {
  const userData = localStorage.getItem("user_data");
  return userData ? JSON.parse(userData).id : null;
};

export const getTrendingVideos = () => api.get("/movies/popular");

export const getMovieByGenreId = (id: number, page = 1) =>
  axios.get(
    withKey(`${TMDB_API}/discover/movie?with_genres=${id}&page=${page}`)
  );

export const getTopRatedVideos = () => api.get("/movies/top_rated");

export const getMovieDetails = (id: number) => api.get(`/movies/${id}`);

export const getMovieRecommendations = (id: number, page = 1) =>
  axios.get(withKey(`${TMDB_API}/movie/${id}/recommendations?page=${page}`));

export const getMovieCredits = (id: number) =>
  axios.get(withKey(`${TMDB_API}/movie/${id}/credits`));

export const getMovieVideos = (id: number) =>
  axios.get(withKey(`${TMDB_API}/movie/${id}/videos`));

export const searchMovies = (query: string, page = 1) =>
  api.get(`/movies/search?q=${encodeURIComponent(query)}&page=${page}`);

export const getUserRecommendations = () => {
  const userId = getUserId();
  if (!userId) {
    return Promise.reject(new Error("User ID not found in local storage"));
  }
  return api.get(`/movies/user/${userId}/recommendations`);
};

// ===== TV ENDPOINTS =====

export const getTvGenres = () =>
  axios.get(withKey(`${TMDB_API}/genre/tv/list`));

export const getTvByGenreId = (id: number, page = 1) =>
  axios.get(withKey(`${TMDB_API}/discover/tv?with_genres=${id}&page=${page}`));

export const getTvDetails = (id: number) =>
  axios.get(withKey(`${TMDB_API}/tv/${id}`));

export const getTvRecommendations = (id: number, page = 1) =>
  axios.get(withKey(`${TMDB_API}/tv/${id}/recommendations?page=${page}`));

export const getTvCredits = (id: number) =>
  axios.get(withKey(`${TMDB_API}/tv/${id}/credits`));

export const getTvVideos = (id: number) =>
  axios.get(withKey(`${TMDB_API}/tv/${id}/videos`));

export const discoverTvByGenre = (genreId: number, page = 1) =>
  axios.get(
    `${TMDB_API}/discover/tv?api_key=${API_KEY}` +
      `&with_genres=${genreId}&language=en-US&sort_by=popularity.desc&page=${page}`
  );

// ===== CHAT/LLM ENDPOINTS =====

export const askMovieQuestion = (question: string) =>
  api.post("/llm/ask", { question });

export const chatWithLLM = (requestData: any) =>
  api.post("/llm/chat", requestData);

export const getSampleQuestions = () => api.get("/llm/sample-questions");

// ===== Prefrences ENDPOINTS =====

export const getGenres = () => api.get("/preferences/genres");

export const getKeywords = () => api.get("/preferences/keywords");

export const getLanguage = () => api.get("/preferences/languages");

export const saveUserPreferences = (preferences: {
  user_id: number;
  preferred_genres: string;
  preferred_keywords: string;
  preferred_language: string;
}) => api.post("/preferences/submit", preferences);

export const getUserFavoriteMovies = () => {
  const userId = getUserId();
  if (!userId) {
    return Promise.reject(new Error("User ID not found in local storage"));
  }
  return api.get(`/preferences/${userId}/movies`);
};

export const addFavoriteMovie = (movieId: number) => {
  const userId = getUserId();
  if (!userId) {
    return Promise.reject(new Error("User ID not found in local storage"));
  }
  return api.post("/preferences/movies/add", {
    user_id: userId,
    movie_id: movieId,
  });
};

export const removeFavoriteMovie = (movieId: number) => {
  const userId = getUserId();
  if (!userId) {
    return Promise.reject(new Error("User ID not found in local storage"));
  }
  return api.post("/preferences/movies/remove", {
    user_id: userId,
    movie_id: movieId,
  });
};

export default {
  getTrendingVideos,
  getTopRatedVideos,
  getMovieByGenreId,
  getMovieDetails,
  getMovieRecommendations,
  getMovieCredits,
  getMovieVideos,
  searchMovies,
  getUserRecommendations,

  getTvGenres,
  getTvByGenreId,
  getTvDetails,
  getTvRecommendations,
  discoverTvByGenre,
  getTvCredits,
  getTvVideos,

  askMovieQuestion,
  chatWithLLM,
  getSampleQuestions,

  getGenres,
  getKeywords,
  getLanguage,
  saveUserPreferences,
  getUserFavoriteMovies,
  addFavoriteMovie,
  removeFavoriteMovie,
  post: (url: string, data: any) => api.post(url, data),
  get: (url: string) => api.get(url),
};
