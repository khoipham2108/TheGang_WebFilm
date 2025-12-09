import React, { useEffect, useRef, useState } from 'react'
import GlobalApi from '../../services/GlobalApi'
import MovieCard from './MovieCard'
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'
import HrMovieCard from './HrMovieCard'

interface MovieListProps { genreId: number; index_: number }
interface MovieItem { poster_path?: string; backdrop_path?: string; title?: string }

const MovieList: React.FC<MovieListProps> = ({ genreId, index_ }) => {
  const [movieList, setMovieList] = useState<MovieItem[]>([])
  const elementRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    getMovieByGenreId()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getMovieByGenreId = () => {
    GlobalApi.getMovieByGenreId(genreId).then((resp: any) => {
      setMovieList(resp.data.results)
    })
  }

  const slideRight = (element: HTMLDivElement | null) => {
    if (element) element.scrollLeft += 500
  }
  const slideLeft = (element: HTMLDivElement | null) => {
    if (element) element.scrollLeft -= 500
  }

  return (
    <div className="relative">
      <IoChevronBackOutline
        onClick={() => slideLeft(elementRef.current)}
        className={`text-[50px] text-white p-2 z-10 cursor-pointer hidden md:block absolute ${index_ % 3 == 0 ? 'mt-[80px]' : 'mt-[150px]'}`}
      />

      <div ref={elementRef} className="flex overflow-x-auto gap-8 scrollbar-none scroll-smooth pt-4 px-3 pb-4 items-start">
        {movieList.map((item, index) => (
          <div key={index}>
            <MovieCard movie={item} />
          </div>
        ))}
      </div>
      <IoChevronForwardOutline
        onClick={() => slideRight(elementRef.current)}
        className={`text-[50px] text-white hidden md:block p-2 cursor-pointer z-10 top-0 absolute right-0 ${index_ % 3 == 0 ? 'mt-[80px]' : 'mt-[150px]'}`}
      />
    </div>
  )
}

export default MovieList
