import { motion } from "motion/react"
import { WhatsAppIcon } from "./icons"
import { ORDER_MESSAGE } from "../data/site"
import { buildWhatsAppLink } from "../lib/whatsapp"

export function FinalCta() {
  return (
    <section className="bg-navy py-24 text-center text-white">
      <div className="wrap flex flex-col items-center gap-6">
        <h2 className="font-display text-[clamp(2.3rem,6vw,3.6rem)] font-extrabold">Faz seu pedido agora</h2>
        <p className="text-xl text-[#C9CDEA]">Gás e água na porta de casa, em toda Itaituba.</p>
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href={buildWhatsAppLink(ORDER_MESSAGE)}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 rounded-full bg-wa px-8 py-4 font-display text-2xl font-bold text-white"
        >
          <WhatsAppIcon className="h-6 w-6" /> Pedir pelo WhatsApp
        </motion.a>
        <a href="tel:+5593991666437" className="text-xl font-semibold underline underline-offset-4">
          (93) 99166-6437
        </a>
      </div>
    </section>
  )
}
