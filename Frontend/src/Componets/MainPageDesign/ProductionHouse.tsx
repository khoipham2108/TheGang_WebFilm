import React from 'react'
import { HiPlay } from 'react-icons/hi'
import disney from '../../assets/Images/disney.png'
import marvel from '../../assets/Images/marvel.png'
import nationalG from '../../assets/Images/nationalG.png'
import pixar from '../../assets/Images/pixar.png'
import starwar from '../../assets/Images/starwar.png'

import starwarV from '../../assets/Videos/star-wars.mp4'
import disneyV from '../../assets/Videos/disney.mp4'
import marvelV from '../../assets/Videos/marvel.mp4'
import nationalGeographicV from '../../assets/Videos/national-geographic.mp4'
import pixarV from '../../assets/Videos/pixar.mp4'

interface ProdItem { id: number; image: string; video: string }

const ProductionHouse: React.FC = () => {
  const productionHouseList: ProdItem[] = [
    { id: 1, image: disney, video: disneyV },
    { id: 2, image: pixar, video: pixarV },
    { id: 3, image: marvel, video: marvelV },
    { id: 4, image: starwar, video: starwarV },
    { id: 5, image: nationalG, video: nationalGeographicV },
  ]

  return (
  <div className="flex gap-4 md:gap-8 p-3 px-6 md:px-16 items-center">
      {productionHouseList.map((item) => (
        <div
          key={item.id}
          className="group relative overflow-hidden rounded-lg shadow-xl shadow-gray-800 border border-gray-700 bg-[#0f1115]"
        >
          {/* card size */}
          <div className="w-[180px] md:w-[320px] h-[100px] md:h-[160px] bg-transparent relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <video
              src={item.video}
              autoPlay
              loop
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-70 transition-opacity duration-300"
            />

            <img
              src={item.image}
              alt={`production-${item.id}`}
              className="relative z-10 w-[70%] md:w-[72%] h-auto object-contain p-2 md:p-3 pointer-events-none"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductionHouse
