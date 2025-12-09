import React, { useEffect, useRef, useState } from "react";
import GlobalApi from "../../services/GlobalApi";
import MovieCard from "./MovieCard";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import BackendApi from "../../services/BackendApi";

interface RecommendMovieListProps {}
interface MovieItem {
  id: number;
  poster_path?: string;
  backdrop_path?: string;
  title?: string;
  name?: string;
  overview?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
}

const RecommendMovieList: React.FC<RecommendMovieListProps> = () => {
  const [movieList, setMovieList] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getRecommendationsWithFallback();
  }, []);

  const getRecommendationsWithFallback = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, try to get user recommendations
      let recommendedMovies: MovieItem[] = [];
      try {
        const recommendResp = await GlobalApi.getUserRecommendations();
        console.debug("user recommendations response:", recommendResp);
        // Backend returns MovieList shape with `results`
        recommendedMovies = recommendResp?.data?.results || [];
      } catch (recommendError) {
        console.warn(
          "Failed to fetch recommendations (user), falling back:",
          recommendError
        );
        recommendedMovies = [];
      }

      // If we have less than 10 recommendations, fetch trending movies to fill the gap
      if (recommendedMovies.length < 10) {
        // Attempt to fill with popular, then top_rated if needed
        try {
          const trendingResp = await BackendApi.getTrendingVideos();
          const trendingMovies: MovieItem[] = trendingResp.data.results || [];

          // Get the IDs of recommended movies to avoid duplicates
          const recommendedIds = new Set(
            recommendedMovies.map((movie) => movie.id)
          );

          // Filter out duplicates and add trending movies
          const uniqueTrendingMovies = trendingMovies.filter(
            (movie) => !recommendedIds.has(movie.id)
          );

          let combinedMovies = [...recommendedMovies, ...uniqueTrendingMovies];

          // If still short, add top rated
          if (combinedMovies.length < 10) {
            try {
              const topResp = await BackendApi.getTopRatedVideos();
              console.debug("top rated response:", topResp);
              const topMovies: MovieItem[] = topResp.data.results || [];
              const existingIds = new Set(combinedMovies.map((x) => x.id));
              const topUnique = topMovies.filter((m) => !existingIds.has(m.id));
              combinedMovies = [...combinedMovies, ...topUnique];
            } catch (topErr) {
              console.warn("Failed to fetch top rated fallback:", topErr);
            }
          }

          setMovieList(combinedMovies.slice(0, 10));
        } catch (trendingError) {
          console.error("Failed to fetch trending movies:", trendingError);
          // If trending also fails, just use whatever recommendations we have
          setMovieList(recommendedMovies.slice(0, 10));
        }
      } else {
        // We have enough recommendations, just limit to 10
        setMovieList(recommendedMovies.slice(0, 10));
      }
    } catch (error) {
      console.error("Error in getRecommendationsWithFallback:", error);
      setError("Failed to load movies. Please try again later.");
      setMovieList([]);
    } finally {
      setLoading(false);
    }
  };

  const slideRight = (element: HTMLDivElement | null) => {
    if (element) element.scrollLeft += 500;
  };

  const slideLeft = (element: HTMLDivElement | null) => {
    if (element) element.scrollLeft -= 500;
  };

  if (loading) {
    return (
      <div className="relative">
        <div className="flex gap-8 pt-4 px-3 pb-4">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="flex-shrink-0">
              <div className="w-[150px] h-[225px] bg-gray-800 rounded-lg animate-pulse">
                <div className="w-full h-[180px] bg-gray-700 rounded-t-lg"></div>
                <div className="p-2">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={getRecommendationsWithFallback}
              className="px-4 py-2 bg-[#F2C46A] text-black rounded-lg hover:bg-[#E6B546] transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (movieList.length === 0) {
    return (
      <div className="relative">
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-400">No movies available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <IoChevronBackOutline
        onClick={() => slideLeft(elementRef.current)}
        className="text-[50px] text-white p-2 z-10 cursor-pointer hidden md:block absolute mt-[80px] hover:text-[#F2C46A] transition-colors duration-200"
      />

      <div
        ref={elementRef}
        className="flex overflow-x-auto gap-8 scrollbar-none scroll-smooth pt-4 px-3 pb-4 items-start"
      >
        {movieList.map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex-shrink-0">
            <MovieCard movie={item} />
          </div>
        ))}
      </div>

      <IoChevronForwardOutline
        onClick={() => slideRight(elementRef.current)}
        className="text-[50px] text-white hidden md:block p-2 cursor-pointer z-10 top-0 absolute right-0 mt-[80px] hover:text-[#F2C46A] transition-colors duration-200"
      />
    </div>
  );
};

export default RecommendMovieList;
