import React from "react";
import "../../App.css";
import Header from "../../Componets/MainPageDesign/Header";
import { ModalProvider } from "../../Componets/MainPageDesign/ModalContext";
import FilmModal from "../../Componets/MainPageDesign/FilmModal";
import ChatButton from "../../Componets/ChatButton";
import Slider from "../../Componets/MainPageDesign/Slider";
import ProductionHouse from "../../Componets/MainPageDesign/ProductionHouse";
import SeriesGrid from "../../Componets/SeriesPageDesign/SeriesGrid";

const SeriesPage: React.FC = () => {
    return (
        <ModalProvider>
            <div>
                <Header />
                <Slider />
                <ProductionHouse />
                <SeriesGrid />
                {/* <GenreMovieList /> */}
                <FilmModal />
                <ChatButton />

            </div>
        </ModalProvider>
    );
};

export default SeriesPage;