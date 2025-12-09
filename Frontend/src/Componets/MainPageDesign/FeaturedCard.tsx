import React from 'react'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original'

interface Movie { backdrop_path?: string; title?: string }

const FeaturedCard: React.FC<{ movie: Movie }> = ({ movie }) => {
  return (
    <div className="min-w-[280px] md:min-w-[520px] md:h-[320px] h-[180px] rounded-lg overflow-hidden relative shadow-lg">
      <img
        src={IMAGE_BASE_URL + movie.backdrop_path}
        alt={movie.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute left-4 bottom-4 text-white bg-black/50 px-3 py-1 rounded max-w-[90%] truncate" title={movie.title}>
        {movie.title}
      </div>
    </div>
  )
}

export default FeaturedCard
