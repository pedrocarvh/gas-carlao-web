import { Header } from "./components/Header"
import { Hero } from "./components/Hero"
import { ScrollStory } from "./components/ScrollStory"

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ScrollStory />
      </main>
    </>
  )
}
