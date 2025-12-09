import React from 'react';
import Header from '../../Componets/MainPageDesign/Header';
import MegaFooter from '../../Componets/HomepageDesign/MegaFooter';
import ChatButton from '../../Componets/ChatButton';
import { HiPlay, HiStar, HiUsers, HiGlobeAlt } from 'react-icons/hi2';

const About: React.FC = () => {
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-[#F2C46A] to-[#E6B546] bg-clip-text text-transparent">
            About The Gangs
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Your ultimate destination for discovering and exploring the world of cinema
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full">
              <HiPlay className="text-[#F2C46A]" />
              <span className="text-white">10,000+ Movies</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full">
              <HiStar className="text-[#F2C46A]" />
              <span className="text-white">Premium Quality</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full">
              <HiUsers className="text-[#F2C46A]" />
              <span className="text-white">Active Community</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                We believe that great stories have the power to inspire, entertain, and bring people together. 
                Our mission is to make cinema accessible to everyone, everywhere.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-[#F2C46A]/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-[#F2C46A] to-[#E6B546] rounded-2xl flex items-center justify-center mb-6">
                  <HiPlay className="text-2xl text-black" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Discover</h3>
                <p className="text-gray-400 leading-relaxed">
                  Explore thousands of movies and TV shows from around the world. Our intelligent recommendation system helps you find your next favorite film.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-[#F2C46A]/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-[#F2C46A] to-[#E6B546] rounded-2xl flex items-center justify-center mb-6">
                  <HiStar className="text-2xl text-black" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Curate</h3>
                <p className="text-gray-400 leading-relaxed">
                  Create your personal watchlist, rate movies, and get personalized recommendations based on your unique taste in cinema.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-[#F2C46A]/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-[#F2C46A] to-[#E6B546] rounded-2xl flex items-center justify-center mb-6">
                  <HiGlobeAlt className="text-2xl text-black" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Connect</h3>
                <p className="text-gray-400 leading-relaxed">
                  Join a community of movie enthusiasts. Share your thoughts, discover hidden gems, and connect with fellow cinema lovers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Meet The Gangs
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              A passionate team of movie enthusiasts, developers, and designers working to bring you the best cinema experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { name: 'Alex Chen', role: 'Founder & CEO', avatar: '👨‍💼' },
              { name: 'Sarah Johnson', role: 'Head of Content', avatar: '👩‍🎬' },
              { name: 'Mike Rodriguez', role: 'Lead Developer', avatar: '👨‍💻' },
              { name: 'Emma Wilson', role: 'UX Designer', avatar: '👩‍🎨' }
            ].map((member, index) => (
              <div key={index} className="text-center group">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#F2C46A] to-[#E6B546] rounded-full flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
                  {member.avatar}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              By The Numbers
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: '10,000+', label: 'Movies & Shows' },
              { number: '50,000+', label: 'Active Users' },
              { number: '1M+', label: 'Reviews & Ratings' },
              { number: '99.9%', label: 'Uptime' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#F2C46A] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MegaFooter />
      <ChatButton />
    </>
  );
};

export default About;