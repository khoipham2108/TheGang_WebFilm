// Vite environment variables used across the app
interface ImportMetaEnv {
  readonly VITE_TMDB_API_KEY: string
  readonly VITE_APP_API_ENDPOINT_URL?: string
  readonly VITE_APP_TMDB_V3_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Small, focused types used by several components that fetch from TMDB
type TMDBVideo = {
  id?: string
  key?: string
  site?: string
  type?: string
  name?: string
}

type TMDBItem = {
  first_air_date: string
  id: number
  title?: string
  name?: string
  poster_path?: string | null
  backdrop_path?: string | null
  overview?: string
  release_date?: string
  vote_average?: number
}

// Common props shape used by Row/Hero components
type Props = {
  title: string
  fetchUrl?: string
  isLargeRow?: boolean
  id?: string
  media?: 'movie' | 'tv' | string
  category?: string
  trending?: boolean
  discoverQuery?: string
}

