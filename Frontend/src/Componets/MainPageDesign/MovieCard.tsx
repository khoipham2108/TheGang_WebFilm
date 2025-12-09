import React from 'react'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original'

import { useModal } from './ModalContext'
import { moviePoster } from '../../constant/GenresList';

interface Movie { id?: number; poster_path?: string; title?: string }

const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
  const { open } = useModal()
  return (
    <div className="w-[110px] md:w-[200px]">
      <div onClick={() => movie.id && open(movie.id)} className="relative h-[170px] md:h-[300px] overflow-hidden rounded-lg shadow-sm cursor-pointer">
        <img
          src={movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : moviePoster}
          className="w-full h-full object-cover transition-transform duration-150 ease-in hover:scale-105"
          alt={movie.title ?? 'poster'}
        />
        <div className="absolute left-2 bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-white text-sm truncate" title={movie.title}>
          {movie.title}
        </div>
      </div>
    </div>
  )
}


export default MovieCard
