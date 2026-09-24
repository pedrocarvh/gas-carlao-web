import { MotionConfig } from "motion/react"
import { Header } from "./components/Header"
import { Hero } from "./components/Hero"
import { ScrollStory } from "./components/ScrollStory"
import { Pricing } from "./components/Pricing"
import { HoursAndArea } from "./components/HoursAndArea"
import { SinceBadge } from "./components/SinceBadge"
import { Reviews } from "./components/Reviews"
import { Location } from "./components/Location"
import { FinalCta } from "./components/FinalCta"
import { Footer } from "./components/Footer"
import { FloatingWhatsApp } from "./components/FloatingWhatsApp"

export default function App() {
  // reducedMotion="user": under prefers-reduced-motion, Motion skips every
  // transform/layout animation (hover and tap scales, the floating button's
  // pop-in) while keeping opacity and colour changes, so state still reads.
  // Hero and ScrollStory additionally switch to their static fallbacks.
  return (
    <MotionConfig reducedMotion="user">
      <Header />
      <main id="inicio">
        <Hero />
        <ScrollStory />
        <Pricing />
        <HoursAndArea />
        <SinceBadge />
        <Reviews />
        <Location />
        <FinalCta />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </MotionConfig>
  )
}
