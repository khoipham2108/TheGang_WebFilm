import Header from '../Componets/MainPageDesign/Header'
import Row from '../Componets/HomepageDesign/Row'
import MegaFooter from '../Componets/HomepageDesign/MegaFooter'
import ChatButton from '../Componets/ChatButton'

export default function Series() {
  return (
    <>
      <Header />

      {/* Hero section for Series */}
      <section className="hero" style={{ minHeight: "50vh", position: "relative" }}>
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
            <h1>TV Series & Shows</h1>
            <p style={{ color: "var(--muted)" }}>
              Discover the best TV series, from trending hits to timeless classics.
            </p>
            <div className="btns" style={{ display: "flex", gap: 12 }}>
              <a className="btn btn-neon">Start Watching</a>
              <a className="btn">Browse All</a>
            </div>
          </div>
        </div>
      </section>

      <Row id="trending-tv" title="Trending TV Shows" media="tv" trending />
      <Row id="popular-series" title="Popular Series" media="tv" category="popular" />
      <Row id="top-rated-tv" title="Top Rated Shows" media="tv" category="top_rated" />
      <Row id="drama-series" title="Drama Series" media="tv" discoverQuery="with_genres=18" />
      <Row id="comedy-series" title="Comedy Shows" media="tv" discoverQuery="with_genres=35" />
      <Row id="sci-fi-series" title="Sci-Fi & Fantasy" media="tv" discoverQuery="with_genres=10765" />

      <MegaFooter />
      
      <ChatButton />
    </>
  )
}