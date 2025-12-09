import Header from '../Componets/MainPageDesign/Header'
import Row from '../Componets/HomepageDesign/Row'
import MegaFooter from '../Componets/HomepageDesign/MegaFooter'
import ChatButton from '../Componets/ChatButton'

export default function Genres() {
  return (
    <>
      <Header />

      {/* Hero section for Genres */}
      <section className="hero" style={{ minHeight: "45vh", position: "relative" }}>
        <div className="overlay1" />
        <div className="overlay2" />
        <div 
          className="hero-img" 
          style={{
            backgroundImage: `url(/public/images/logo.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.4)'
          }}
        />
        <div className="container hero-inner">
          <div style={{ maxWidth: 640 }} className="gold-shimmer">
            <h1>Browse by Genre</h1>
            <p style={{ color: "var(--muted)" }}>
              Explore movies and shows by your favorite genres and discover new favorites.
            </p>
            <div className="btns" style={{ display: "flex", gap: 12 }}>
              <a className="btn btn-neon">Explore Now</a>
              <a className="btn">See All Genres</a>
            </div>
          </div>
        </div>
      </section>

      {/* Movie Genres */}
      <Row id="action-movies" title="Action & Adventure" media="movie" discoverQuery="with_genres=28" />
      <Row id="comedy-movies" title="Comedy Movies" media="movie" discoverQuery="with_genres=35" />
      <Row id="drama-movies" title="Drama Films" media="movie" discoverQuery="with_genres=18" />
      <Row id="horror-movies" title="Horror & Thriller" media="movie" discoverQuery="with_genres=27" />
      <Row id="romance-movies" title="Romance Movies" media="movie" discoverQuery="with_genres=10749" />
      <Row id="sci-fi-movies" title="Science Fiction" media="movie" discoverQuery="with_genres=878" />
      
      {/* TV Show Genres */}
      <Row id="crime-tv" title="Crime TV Shows" media="tv" discoverQuery="with_genres=80" />
      <Row id="documentary" title="Documentaries" media="tv" discoverQuery="with_genres=99" />
      <Row id="family-shows" title="Family Shows" media="tv" discoverQuery="with_genres=10751" />

      <MegaFooter />
      
      <ChatButton />
    </>
  )
}