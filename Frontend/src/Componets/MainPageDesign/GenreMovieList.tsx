import React from 'react'
import GenresList from '../../constant/GenresList'
import MovieList from './MovieList'
import RecommendMovieList from './RecommendMovieList'

const GenreMovieList: React.FC = () => {
  return (
    <div>
      <div key={1} className="p-8 px-8 md:px-16">
            <h2 className="text-[20px] text-white font-bold">Recommend for you</h2>
            <RecommendMovieList />
          </div>
      {GenresList.genere.map((item, index) =>
        index <= 4 ? (
          <div key={item.id} className="p-8 px-8 md:px-16">
            <h2 className="text-[20px] text-white font-bold">{item.name}</h2>
            <MovieList genreId={item.id} index_={index} />
          </div>
        ) : null,
      )}
    </div>
  )
}

export default GenreMovieList
