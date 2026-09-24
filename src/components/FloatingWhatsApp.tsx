import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { WhatsAppIcon } from "./icons"
import { ORDER_MESSAGE } from "../data/site"
import { buildWhatsAppLink } from "../lib/whatsapp"

export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById("hero")
    if (!hero) return
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting))
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          href={buildWhatsAppLink(ORDER_MESSAGE)}
          target="_blank"
          rel="noopener"
          aria-label="Pedir pelo WhatsApp"
          // viewport-fit=cover lets content run under the iPhone home
          // indicator / notch, so keep clear of the safe-area insets.
          style={{
            bottom: "max(1.25rem, calc(env(safe-area-inset-bottom) + 0.75rem))",
            right: "max(1.25rem, calc(env(safe-area-inset-right) + 0.75rem))",
          }}
          // Fixed over whatever section is scrolled beneath (paper, white, navy,
          // navy-deep footer), so a single ring colour cannot guarantee contrast:
          // two-tone ring = white fill in the 3px offset gap + navy outline.
          className="btn-wa fixed z-40 grid h-14 w-14 place-items-center rounded-full shadow-[0_10px_24px_-6px_rgb(13_19_80/0.45)] [--focus-ring:var(--color-navy)] focus-visible:shadow-[0_0_0_3px_#fff,0_10px_24px_-6px_rgb(13_19_80/0.45)]"
        >
          <WhatsAppIcon className="h-8 w-8" />
        </motion.a>
      )}
    </AnimatePresence>
  )
}
