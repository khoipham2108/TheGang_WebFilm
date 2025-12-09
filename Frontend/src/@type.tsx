export interface TMDBItem {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
}

export type Props = {
  id: string;
  title: string;
  media?: MediaType;
  category?: string;
  trending?: boolean;

  discoverQuery?: string;
};
export type MediaType = "movie" | "tv";

export type TMDBVideo = {
  key: string;
  site: "YouTube" | "Vimeo";
  type: string;
  name: string;
};

// Update your ChatMessage interface
export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
  type?: 'error' | 'greeting' | 'llm_response';
  foundMovies?: FoundMovie[];
  moviesCount?: number;
}

export interface FoundMovie {
  title: string;
  tmdb_id: number;
  year?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  overview?: string;
}

export interface ChatResponse {
  question: string;
  answer: string;
  status: string;
  type: string;
  found_movies: FoundMovie[];
  movies_count: number;
}
export type Interaction = { id: number; action: string; item: string; date: string };
export type Equipment = { id: number; name: string; status: string };

export type  UserProfileData = {
  fullName: string;
  username: string;           
  email: string;              
  birthday: string;           
  created_at: string;       
  phone?: string;
  role?: string;
  lastLogin?: string;
  totalItems?: number;
  recentInteractions?: Interaction[];
  assignedEquipment?: Equipment[];
};

export type Recommendation = { id: number; title: string; poster?: string; poster_url?: string };
export type MovieLite = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string | null;
  poster_url?: string | null;
  backdrop_path?: string | null;
};
