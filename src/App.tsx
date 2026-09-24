import { Header } from "./components/Header"
import { Hero } from "./components/Hero"
import { ScrollStory } from "./components/ScrollStory"
import { Pricing } from "./components/Pricing"

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ScrollStory />
        <Pricing />
      </main>
    </>
  )
}
