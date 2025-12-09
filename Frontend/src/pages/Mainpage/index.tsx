import React, { useEffect } from 'react'
import '../../App.css'

import Header from '../../Componets/MainPageDesign/Header'
import Slider from '../../Componets/MainPageDesign/Slider'
import ProductionHouse from '../../Componets/MainPageDesign/ProductionHouse'
import GenreMovieList from '../../Componets/MainPageDesign/GenreMovieList'
import { ModalProvider } from '../../Componets/MainPageDesign/ModalContext'
import FilmModal from '../../Componets/MainPageDesign/FilmModal'
import ChatButton from '../../Componets/ChatButton'
import MegaFooter from '../../Componets/HomepageDesign/MegaFooter'
import { useNavigate } from 'react-router-dom'

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user_data from local storage
    const storedUserData = localStorage.getItem('user_data');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);

      // Check if it's the user's first login
      const isFirstLogin = userData.is_first_login === 'True';
      if (isFirstLogin) {
        // Update is_first_login to false in local storage
        userData.is_first_login = 'False';
        localStorage.setItem('user_data', JSON.stringify(userData));

        // Redirect to preferences page
        navigate('/preferences');
      }
    }
  }, [navigate]);

  return (
    <ModalProvider>
      <div>
        <Header />
        <br />
        <Slider />
        <ProductionHouse />
        {/* <SelectedSeriesRow /> */}
        <GenreMovieList />
        <FilmModal />
        <MegaFooter />
        <ChatButton />
      </div>
    </ModalProvider>
  )
}

export default MainPage