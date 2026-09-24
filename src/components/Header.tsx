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
        <a href="#inicio" className="flex items-center gap-3 rounded-lg" aria-label="Carlão Gás e Água, início">
          <img src="/logo.png" alt="" width={56} height={56} decoding="async" />
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
              className="text-[0.98rem] font-semibold text-ink underline-offset-[6px] decoration-flame decoration-2 transition-colors hover:text-navy hover:underline max-md:hidden"
            >
              {link.label}
            </a>
          ))}
          {/* 20px bold label: white on --color-wa (3.1:1) only clears AA as large text. */}
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            href={buildWhatsAppLink(ORDER_MESSAGE)}
            target="_blank"
            rel="noopener"
            className="btn-wa inline-flex min-h-11 items-center gap-2 rounded-full px-5 font-display text-xl font-bold"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Pedir
          </motion.a>
        </nav>
      </div>
    </header>
  )
}
