// src/services/GlobalApi.ts
import BackendApi from './BackendApi'

// Re-export all backend API functions with the same names for compatibility
export const getTrendingVideos = BackendApi.getTrendingVideos
export const getMovieByGenreId = BackendApi.getMovieByGenreId
export const getMovieDetails = BackendApi.getMovieDetails
export const getMovieRecommendations = BackendApi.getMovieRecommendations
export const getMovieCredits = BackendApi.getMovieCredits
export const getMovieVideos = BackendApi.getMovieVideos
export const searchMovies = BackendApi.searchMovies

// TV endpoints
export const getTvGenres = BackendApi.getTvGenres
export const getTvByGenreId = BackendApi.getTvByGenreId
export const getTvDetails = BackendApi.getTvDetails
export const getTvRecommendations = BackendApi.getTvRecommendations
export const getTvCredits = BackendApi.getTvCredits
export const getTvVideos = BackendApi.getTvVideos
export const discoverTvByGenre = BackendApi.discoverTvByGenre

// For backwards compatibility, also export as default
export default BackendApi


// import axios from 'axios'

// const movieBaseUrl = "https://api.themoviedb.org/3";

// const BASE = 'https://api.themoviedb.org/3'
// const API_KEY = import.meta.env.VITE_TMDB_API_KEY || ''

// const withKey = (url: string) => `${url}${url.includes('?') ? '&' : '?'}api_key=${API_KEY}`

// // ===== MOVIE =====
// export const getTrendingVideos = axios.get(withKey(`${BASE}/trending/all/day`))

// export const getMovieByGenreId = (id: number, page = 1) =>
//   axios.get(withKey(`${BASE}/discover/movie?with_genres=${id}&page=${page}`))

// export const getMovieDetails = (id: number) =>
//   axios.get(withKey(`${BASE}/movie/${id}`))

// export const getMovieRecommendations = (id: number, page = 1) =>
//   axios.get(withKey(`${BASE}/movie/${id}/recommendations?page=${page}`))

// export const getMovieCredits = (id: number) =>
//   axios.get(withKey(`${BASE}/movie/${id}/credits`))

// export const getMovieVideos = (id: number) =>
//   axios.get(withKey(`${BASE}/movie/${id}/videos`))

// export const searchMovies = (query: string, page = 1) =>
//   axios.get(withKey(`${BASE}/search/movie?query=${encodeURIComponent(query)}&include_adult=false&page=${page}`))

// // ===== TV (Series) =====
// export const getTvGenres = () =>
//   axios.get(withKey(`${BASE}/genre/tv/list`))

// export const getTvByGenreId = (id: number, page = 1) =>
//   axios.get(withKey(`${BASE}/discover/tv?with_genres=${id}&page=${page}`))

// export const getTvDetails = (id: number) =>
//   axios.get(withKey(`${BASE}/tv/${id}`))

// export const getTvRecommendations = (id: number, page = 1) =>
//   axios.get(withKey(`${BASE}/tv/${id}/recommendations?page=${page}`))

// export const getTvCredits = (id: number) =>
//   axios.get(withKey(`${BASE}/tv/${id}/credits`))

// export const getTvVideos = (id: number) =>
//   axios.get(withKey(`${BASE}/tv/${id}/videos`))

// export const discoverTvByGenre = (genreId: number, page = 1) =>
//   axios.get(
//     `${movieBaseUrl}/discover/tv?api_key=${API_KEY}` +
//     `&with_genres=${genreId}&language=en-US&sort_by=popularity.desc&page=${page}`
//   );
// export default {
//   getTrendingVideos,
//   getMovieByGenreId,
//   getMovieDetails,
//   getMovieRecommendations,
//   getMovieCredits,
//   getMovieVideos,
//   searchMovies,

//   getTvGenres,
//   getTvByGenreId,
//   getTvDetails,
//   getTvRecommendations,
//   getTvCredits,
//   getTvVideos,
//   discoverTvByGenre
// }

