import Header from '../Componets/MainPageDesign/Header'
import Row from '../Componets/HomepageDesign/Row'
import MegaFooter from '../Componets/HomepageDesign/MegaFooter'
import ChatButton from '../Componets/ChatButton'

export default function Movies() {
  return (
    <>
      <Header />

      <Row id="trending" title="Trending Now" media="movie" trending />
      <Row id="animation" title="Animated Picks" media="movie" discoverQuery="with_genres=16" />
      <Row id="horror" title="Horror & Thrillers" media="movie" discoverQuery="with_genres=27" />

      <MegaFooter />
      
      <ChatButton />
    </>
  )
}