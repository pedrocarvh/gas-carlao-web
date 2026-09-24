import { motion } from "motion/react"
import { PhoneIcon, WhatsAppIcon } from "./icons"
import { ORDER_MESSAGE } from "../data/site"
import { buildWhatsAppLink } from "../lib/whatsapp"

export function FinalCta() {
  return (
    <section className="surface-dark bg-navy py-20 text-center text-white md:py-24">
      <div className="wrap flex flex-col items-center">
        <h2 className="font-display text-[clamp(2.3rem,6vw,3.6rem)] font-extrabold">Faz seu pedido agora</h2>
        <p className="mt-4 text-xl text-mist">Gás e água na porta de casa, em toda Itaituba.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            href={buildWhatsAppLink(ORDER_MESSAGE)}
            target="_blank"
            rel="noopener"
            className="btn-wa inline-flex min-h-15 items-center gap-2 rounded-full px-8 font-display text-2xl font-bold shadow-[0_10px_24px_-10px_rgb(0_0_0/0.5)]"
          >
            <WhatsAppIcon className="h-6 w-6" /> Pedir pelo WhatsApp
          </motion.a>
          <a
            href="tel:+5593991666437"
            aria-label="Ligar para (93) 99166-6437"
            className="inline-flex min-h-15 items-center gap-2 rounded-full px-6 font-display text-2xl font-bold tabular-nums shadow-[inset_0_0_0_2px_rgb(255_255_255/0.45)] transition-colors duration-200 hover:bg-white/10"
          >
            <PhoneIcon className="h-5 w-5" />
            (93) 99166-6437
          </a>
        </div>
      </div>
    </section>
  )
}
