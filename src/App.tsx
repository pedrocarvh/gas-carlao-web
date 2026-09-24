import { Header } from "./components/Header"
import { Hero } from "./components/Hero"
import { ScrollStory } from "./components/ScrollStory"
import { Pricing } from "./components/Pricing"
import { HoursAndArea } from "./components/HoursAndArea"
import { SinceBadge } from "./components/SinceBadge"
import { Reviews } from "./components/Reviews"

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ScrollStory />
        <Pricing />
        <HoursAndArea />
        <SinceBadge />
        <Reviews />
      </main>
    </>
  )
}
