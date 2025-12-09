import Header from '../../Componets/MainPageDesign/Header'
import HeroVideo from '../../Componets/HomepageDesign/HeroVideo'
import Row from '../../Componets/HomepageDesign/Row'
import Features from '../../Componets/HomepageDesign/Features'
import Perks from '../../Componets/HomepageDesign/Perks'
import Subscription from '../../Componets/HomepageDesign/Subscription'
import Reviews from '../../Componets/HomepageDesign/Reviews'
import FAQ from '../../Componets/HomepageDesign/FAQ'
import MegaFooter from '../../Componets/HomepageDesign/MegaFooter'
import ChatButton from '../../Componets/ChatButton'

export default function Home() {
  return (
    <>
      <Header />
      <HeroVideo />

      <Row id="trending" title="Trending Now" media="movie" trending />
      <Row id="animation" title="Animation" media="movie" discoverQuery="with_genres=16" />
      {/* <Row id="horror" title="Horror & Thrillers" media="movie" discoverQuery="with_genres=27" /> */}

      <Features />
      <Perks />
      <Subscription />
      <Reviews />
      <FAQ />
      <MegaFooter />

      <ChatButton />
    </>
  )
}