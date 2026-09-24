import { motion } from "motion/react"
import { WhatsAppIcon } from "./icons"
import { ORDER_MESSAGE } from "../data/site"
import { buildWhatsAppLink } from "../lib/whatsapp"

const NAV_LINKS = [
  { href: "#precos", label: "Preços" },
  { href: "#horarios", label: "Horários" },
  { href: "#onde", label: "Onde estamos" },
]

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white">
      <div className="wrap flex h-[72px] items-center justify-between gap-4">
        <a href="#inicio" className="flex items-center gap-3" aria-label="Carlão Gás e Água, início">
          <img src="/logo.png" alt="" width={56} height={56} />
          <span className="font-display text-xl font-extrabold leading-none text-navy">
            Carlão Gás e Água
            <small className="mt-0.5 block font-body text-xs font-medium text-muted max-md:hidden">
              Distribuidora em Itaituba
            </small>
          </span>
        </a>
        <nav aria-label="Principal" className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.98rem] font-semibold text-ink hover:text-navy-soft max-md:hidden"
            >
              {link.label}
            </a>
          ))}
          <motion.a
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            href={buildWhatsAppLink(ORDER_MESSAGE)}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-full bg-wa px-4 py-2 font-display text-lg font-bold text-white"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Pedir
          </motion.a>
        </nav>
      </div>
    </header>
  )
}
