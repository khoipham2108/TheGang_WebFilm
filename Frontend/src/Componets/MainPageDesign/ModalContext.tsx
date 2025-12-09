import React, { createContext, useContext, useState, useEffect } from 'react';
import BackendApi from '../../services/BackendApi';

type ModalContextType = {
  openId: number | null;
  open: (id: number) => void;
  close: () => void;
  myList: number[];
  addToList: (id: number) => Promise<void>;
  removeFromList: (id: number) => Promise<void>;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [openId, setOpenId] = useState<number | null>(null);
  const [myList, setMyList] = useState<number[]>([]);

  const fetchFavorites = async () => {
    try {
      const response = await BackendApi.getUserFavoriteMovies();
      const favoriteMovies = response.data.results.map((movie: { id: number }) => movie.id);
      setMyList(favoriteMovies);
    } catch (error) {
      console.error('Error fetching favorite movies:', error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const open = (id: number) => setOpenId(id);
  const close = () => setOpenId(null);

  const addToList = async (id: number) => {
    try {
      BackendApi.addFavoriteMovie(id);
      setMyList((prev) => [...prev, id]);
    } catch (error) {
      console.error('Error adding movie to favorites:', error);
    }
  };

  const removeFromList = async (id: number) => {
    try {
      BackendApi.removeFavoriteMovie(id);
      setMyList((prev) => prev.filter((movieId) => movieId !== id));
    } catch (error) {
      console.error('Error removing movie from favorites:', error);
    }
  };

  return (
    <ModalContext.Provider value={{ openId, open, close, myList, addToList, removeFromList }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
};

export default ModalContext;