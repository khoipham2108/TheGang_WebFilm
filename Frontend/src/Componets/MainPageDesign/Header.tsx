import React, { useEffect, useRef, useState } from "react";
import logo from "../../../public/images/logo.png";
import { 
  HiHome, 
  HiMagnifyingGlass, 
  HiStar, 
  HiPlayCircle, 
  HiTv,
  HiBars3,
  HiXMark,
  HiPuzzlePiece,
  HiOutlineUserGroup
} from "react-icons/hi2";
import { HiPlus } from "react-icons/hi";
import { useAuth } from "../../auth/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import GlobalApi from "../../services/GlobalApi";

type Movie = { 
  id: number; 
  title?: string; 
  name?: string; 
  poster_path?: string | null; 
  release_date?: string; 
};

type Genre = { id: number; name: string };

interface HeaderItemProps {
  name: string;
  Icon: React.ComponentType<any>;
  to?: string;
  onClick?: () => void;
  active?: boolean;
}

const HeaderItem: React.FC<HeaderItemProps> = ({ name, Icon, to, onClick, active }) => {
  const location = useLocation();
  const isActive = active || (to && location.pathname === to);

  const content = (
    <div 
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-white/10 ${
        isActive ? 'bg-white/20 text-[#F2C46A]' : 'text-gray-300 hover:text-white'
      }`}
      onClick={onClick}
    >
      <Icon className="text-lg" />
      <span className="text-sm font-medium tracking-wide">{name}</span>
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
};

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search functionality
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchAreaRef = useRef<HTMLDivElement | null>(null);

  // Series dropdown
  const [showSeriesGenres, setShowSeriesGenres] = useState(false);
  const [tvGenres, setTvGenres] = useState<Genre[]>([]);
  const seriesRef = useRef<HTMLDivElement | null>(null);
  const hideTimer = useRef<number | null>(null);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setMobileMenuOpen(false);
    nav('/');
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    setMobileMenuOpen(false);
    nav('/profile');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "/" && !searchOpen) {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
        setShowSeriesGenres(false);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [searchOpen]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchOpen && searchAreaRef.current && !searchAreaRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (showSeriesGenres && seriesRef.current && !seriesRef.current.contains(e.target as Node)) {
        setShowSeriesGenres(false);
      }
      if (showDropdown && !(e.target as Element).closest('.user-menu')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen, showSeriesGenres, showDropdown]);

  // Fetch TV genres
  useEffect(() => {
    if (isAuthenticated) {
      GlobalApi.getTvGenres()
        .then((r: any) => setTvGenres(r?.data?.genres || []))
        .catch(() => setTvGenres([]));
    }
  }, [isAuthenticated]);

  // Search debounce
  useEffect(() => {
    if (!searchOpen || !isAuthenticated) return;
    
    const term = searchQuery.trim();
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    const timeout = setTimeout(() => {
      GlobalApi.searchMovies(term)
        .then((r: any) => setSearchResults((r?.data?.results || []).slice(0, 20)))
        .catch(() => setSearchResults([]))
        .finally(() => setSearchLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery, searchOpen, isAuthenticated]);

  const handleSearchSelect = (movie: Movie) => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setMobileMenuOpen(false);
    nav(`/movie/${movie.id}`);
  };

  const handleSeriesGenreSelect = (genre: Genre) => {
    setShowSeriesGenres(false);
    setMobileMenuOpen(false);
    nav(`/series?genre=${genre.id}&name=${encodeURIComponent(genre.name)}`);
  };

  const openSeriesMenu = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    setShowSeriesGenres(true);
  };

  const closeSeriesMenuWithDelay = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setShowSeriesGenres(false), 150);
  };

  const isHomePage = location.pathname === '/';
  const headerClass = isHomePage ? 
    "bg-transparent backdrop-blur-md" : 
    "bg-black/80 backdrop-blur-md border-b border-gray-800";

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${headerClass}`}>
      <div style={{paddingLeft: 0, paddingRight: 0}} className="container mx-auto px-4">
        <div  className="flex items-center justify-between h-16 lg:h-20">
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%"}}>
            {/* Logo */}
            <Link style={{ marginRight: 24, marginTop: ".5rem" }} to="/" className="flex-shrink-0 transition-transform duration-200 hover:scale-105">
              <img 
                src={logo} 
                className="h-8 lg:h-20 w-auto object-contain" 
                alt="The Gangs Logo" 
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <HeaderItem name="HOME" Icon={HiHome} to={isAuthenticated ? "/main" : "/"} />
              {!isAuthenticated && (
                <>
                  <HeaderItem name="About" Icon={HiPuzzlePiece} to={"/about"} />
                  <HeaderItem name="Contact" Icon={HiOutlineUserGroup} to={"/contact"} />
                </>
              )}

              {isAuthenticated && (
                <>
                  <HeaderItem
                    name="SEARCH"
                    Icon={HiMagnifyingGlass}
                    onClick={() => {
                      setSearchOpen(true);
                      setTimeout(() => inputRef.current?.focus(), 0);
                    }}
                    active={searchOpen}
                  />
                  <HeaderItem name="MY LIST" Icon={HiPlus} to="/profile?tab=my-list" />
                  <HeaderItem name="MOVIES" Icon={HiPlayCircle} to="/movies" />
                  
                  {/* Series Dropdown */}
                  <div className="relative" ref={seriesRef}>
                    <HeaderItem
                      name="SERIES"
                      Icon={HiTv}
                      onClick={() => nav('/series')}
                    />
                    <button
                      onMouseEnter={openSeriesMenu}
                      onMouseLeave={closeSeriesMenuWithDelay}
                      className="absolute inset-0 w-full h-full"
                      aria-label="Series menu"
                    />
                    
                    {showSeriesGenres && (
                      <div
                        className="absolute top-full left-0 mt-2 w-80 bg-black/95 backdrop-blur-md border border-gray-800 rounded-xl shadow-2xl p-4 z-50"
                        onMouseEnter={openSeriesMenu}
                        onMouseLeave={closeSeriesMenuWithDelay}
                      >
                        <div className="grid grid-cols-2 gap-2">
                          {tvGenres.length === 0 ? (
                            <div className="col-span-2 text-center text-gray-400 py-4">
                              Loading genres...
                            </div>
                          ) : (
                            tvGenres.slice(0, 12).map((genre) => (
                              <button
                                key={genre.id}
                                onClick={() => handleSeriesGenreSelect(genre)}
                                className="p-2 text-left text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                              >
                                {genre.name}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <HeaderItem name="GENRES" Icon={HiStar} to="/genres" />
                </>
              )}
            </nav>

            {/* Search Bar (when open) */}
            <div className="flex-1 mx-4 lg:mx-8" style={{ marginTop: 16}} ref={searchAreaRef}>
              {searchOpen && isAuthenticated && (
                <div className="relative">
                  <div className="flex items-center bg-black/60 backdrop-blur-md border border-gray-700 rounded-xl px-4 py-2 focus-within:border-[#F2C46A] transition-colors duration-200">
                    <HiMagnifyingGlass className="text-gray-400 mr-3" />
                    <input
                      ref={inputRef}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search movies and TV shows... (Press / to focus, Esc to close)"
                      className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                      autoComplete="off"
                    />
                    <button
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="ml-2 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      <HiXMark />
                    </button>
                  </div>

                  {/* Search Results */}
                  {searchQuery.trim().length >= 2 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-md border border-gray-800 rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50">
                      {searchLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#F2C46A]"></div>
                          <span className="ml-2 text-gray-400">Searching...</span>
                        </div>
                      ) : searchResults.length === 0 ? (
                        <div className="text-center text-gray-400 py-8">
                          No results found for "{searchQuery}"
                        </div>
                      ) : (
                        <div className="p-2">
                          {searchResults.map((movie) => {
                            const title = movie.title || movie.name || "Untitled";
                            const poster = movie.poster_path 
                              ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` 
                              : null;
                            
                            return (
                              <button
                                key={movie.id}
                                onClick={() => handleSearchSelect(movie)}
                                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 text-left"
                              >
                                <div className="w-12 h-16 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                                  {poster && (
                                    <img 
                                      src={poster} 
                                      alt={title}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-white font-medium truncate">{title}</div>
                                  <div className="text-gray-400 text-sm">
                                    {movie.release_date?.slice(0, 4) || 'N/A'}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Menu / Auth Buttons */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <div className="relative user-menu">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                  >
                    <img
                      src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
                      className="w-8 h-8 rounded-full"
                      alt="User Avatar"
                    />
                    <span className="hidden md:block text-white text-sm">
                      {user.username}
                    </span>
                    <svg 
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-black/95 backdrop-blur-md border border-gray-800 rounded-xl shadow-2xl py-2 z-50">
                      <button
                        onClick={handleProfileClick}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          nav('/main');
                        }}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                      >
                        Dashboard
                      </button>
                      <hr className="my-2 border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-200"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#E6B546] to-[#8a4028] rounded-lg hover:from-[#E6B546] hover:to-[#ff4f4f] transition-all duration-200 transform hover:scale-110 hover:text-white"
                  >
                    Sign In
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <HiXMark size={24} /> : <HiBars3 size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-black/95 backdrop-blur-md border-t border-gray-800 py-4">
            <nav className="space-y-2">
              <Link
                to={isAuthenticated ? "/main" : "/"}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                Home
              </Link>
              
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      setSearchOpen(true);
                      setMobileMenuOpen(false);
                      setTimeout(() => inputRef.current?.focus(), 0);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                  >
                    Search
                  </button>
                  <Link
                    to="/profile?tab=my-list"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                  >
                    My List
                  </Link>
                  <Link
                    to="/movies"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                  >
                    Movies
                  </Link>
                  <Link
                    to="/series"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                  >
                    Series
                  </Link>
                  <Link
                    to="/genres"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                  >
                    Genres
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/movies"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                  >
                    Movies
                  </Link>
                  <Link
                    to="/series"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                  >
                    TV Shows
                  </Link>
                  <Link
                    to="/genres"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                  >
                    Genres
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;