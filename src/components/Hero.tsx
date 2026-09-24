import { motion, useMotionValue, useTransform, useReducedMotion } from "motion/react"
import { WhatsAppIcon } from "./icons"
import { ORDER_MESSAGE } from "../data/site"
import { buildWhatsAppLink } from "../lib/whatsapp"
import { useBusinessStatus } from "../hooks/useBusinessStatus"

export function Hero() {
  const status = useBusinessStatus()
  const reducedMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-60, 60], [10, -10])
  const rotateY = useTransform(x, [-60, 60], [-10, 10])

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (reducedMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    x.set(event.clientX - rect.left - rect.width / 2)
    y.set(event.clientY - rect.top - rect.height / 2)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <section id="hero" className="overflow-hidden bg-navy text-white">
      <div className="wrap grid grid-cols-[1.15fr_0.85fr] items-center gap-8 py-16 max-md:grid-cols-1 max-md:py-10">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                status?.isOpen ? "bg-[#4BE08A] shadow-[0_0_0_4px_rgba(75,224,138,.2)]" : "bg-[#9aa0bd]"
              }`}
            />
            <span>{status?.label ?? "Verificando horário…"}</span>
          </div>
          <h1 className="font-display text-[clamp(3.1rem,9vw,6.4rem)] font-extrabold leading-none">
            Acabou o gás?
            <span className="block text-flame-hot">A gente leva.</span>
          </h1>
          <p className="mt-6 max-w-[36ch] text-xl text-[#C9CDEA]">
            Gás de cozinha e água mineral de 20 litros com entrega em toda Itaituba. É só chamar no WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={buildWhatsAppLink(ORDER_MESSAGE)}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full bg-wa px-6 py-3 font-display text-xl font-bold text-white"
            >
              <WhatsAppIcon className="h-6 w-6" /> Pedir pelo WhatsApp
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#precos"
              className="inline-flex items-center rounded-full px-6 py-3 font-display text-xl font-bold text-white shadow-[inset_0_0_0_2px_rgba(255,255,255,.45)]"
            >
              Ver preços
            </motion.a>
          </div>
        </div>

        <div
          className="grid place-items-center"
          style={{ perspective: 800 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          aria-hidden="true"
        >
          <motion.svg
            viewBox="0 0 240 330"
            className="w-[min(360px,80%)] overflow-visible"
            style={reducedMotion ? undefined : { rotateX, rotateY }}
          >
            <defs>
              <linearGradient id="body" x1="0" x2="1">
                <stop offset="0" stopColor="#1F2A8F" />
                <stop offset=".35" stopColor="#3441B8" />
                <stop offset=".6" stopColor="#2A3494" />
                <stop offset="1" stopColor="#141C6E" />
              </linearGradient>
              <linearGradient id="ring" x1="0" x2="1">
                <stop offset="0" stopColor="#C9CDEA" />
                <stop offset=".4" stopColor="#FFFFFF" />
                <stop offset="1" stopColor="#9AA0BD" />
              </linearGradient>
            </defs>
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.2, 0.9, 0.3, 1.2] }}
              style={{ transformOrigin: "120px 86px" }}
            >
              <motion.path
                animate={
                  reducedMotion
                    ? undefined
                    : { scaleX: [1, 0.96, 1.03, 1], scaleY: [1, 1.06, 0.95, 1], skewX: [0, -2, 2, 0] }
                }
                transition={{ duration: 1.8, times: [0, 0.3, 0.6, 1], repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "120px 86px" }}
                fill="#F28C1B"
                d="M120 8c8 26 38 44 38 78a38 38 0 0 1-76 0c0-15 7-26 15-34 0 15 7 22 15 22 0-22-7-44 8-66Z"
              />
              <motion.path
                animate={
                  reducedMotion
                    ? undefined
                    : { scaleX: [1, 1.03, 0.97, 1], scaleY: [1, 0.94, 1.05, 1], skewX: [0, 2, -2, 0] }
                }
                transition={{ duration: 1.3, times: [0, 0.3, 0.6, 1], repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "120px 86px" }}
                fill="#FFC93C"
                d="M120 58c6 11 18 19 18 33a18 18 0 0 1-36 0c0-8 4-14 8-17 0 6 4 9 8 9 0-9-2-17 2-25Z"
              />
            </motion.g>
            <path
              d="M70 150c0-16 10-24 22-24h56c12 0 22 8 22 24v12H152v-8c0-6-4-10-10-10H98c-6 0-10 4-10 10v8H70z"
              fill="url(#ring)"
            />
            <rect x="108" y="140" width="24" height="18" rx="3" fill="#6B7194" />
            <path
              d="M44 205c0-26 24-44 76-44s76 18 76 44v70c0 22-24 38-76 38s-76-16-76-38Z"
              fill="url(#body)"
            />
            <path d="M44 232c20 10 132 10 152 0" stroke="#FFFFFF" strokeOpacity=".25" strokeWidth="3" fill="none" />
            <path d="M44 262c20 10 132 10 152 0" stroke="#FFFFFF" strokeOpacity=".25" strokeWidth="3" fill="none" />
            <path
              d="M64 196c4-12 16-18 30-20"
              stroke="#FFFFFF"
              strokeOpacity=".35"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <path d="M60 300h120l-6 22H66z" fill="#0D1350" />
          </motion.svg>
        </div>
      </div>
    </section>
  )
}
