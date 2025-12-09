import React from "react";
import MovieDetails from "../../Componets/MovieDetailsDesign/MovieDetails";
import { ModalProvider } from "../../Componets/MainPageDesign/ModalContext";
import ChatButton from "../../Componets/ChatButton";
import Header from "../../Componets/MainPageDesign/Header";

const MovieDetailsPage: React.FC = () => {
    return (
        <ModalProvider>
            <Header />
            <MovieDetails />
            <ChatButton />
        </ModalProvider>
    );
};

export default MovieDetailsPage;
