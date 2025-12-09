import React from 'react'
import { useModal } from './ModalContext'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original'

interface Movie { id?: number; backdrop_path?: string; title?: string }

const HrMovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
  const { open } = useModal()
  return (
    <section className="w-[110px] md:w-[260px] hover:scale-110 transition-all duration-150 ease-in">
      <div onClick={() => movie.id && open(movie.id)} className="relative h-[170px] md:h-[300px] overflow-hidden rounded-lg shadow-sm cursor-pointer">
        <img
          src={IMAGE_BASE_URL + movie.backdrop_path}
          className="w-full h-full object-cover transition-transform duration-150 ease-in hover:scale-105"
          alt={movie.title}
        />
        <div className="absolute left-2 bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-white text-sm truncate" title={movie.title}>
          {movie.title}
        </div>
      </div>
    </section>
  )
}

export default HrMovieCard
