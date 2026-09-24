import { motion } from "motion/react"
import { BUSINESS } from "../data/site"

export function Location() {
  return (
    <section id="onde" className="pb-24">
      <div className="wrap grid gap-6 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="rounded-[18px] border border-line bg-white p-8"
        >
          <h3 className="mb-4 font-display text-3xl font-extrabold text-navy">Onde estamos</h3>
          <address className="not-italic leading-relaxed text-ink">
            {BUSINESS.address.street}
            <br />
            {BUSINESS.address.complement}
            <br />
            {BUSINESS.address.neighborhood}
            <br />
            CEP {BUSINESS.address.zip}
          </address>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${BUSINESS.address.mapsQuery}`}
            target="_blank"
            rel="noopener"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 font-display text-lg font-bold text-white"
          >
            Abrir no mapa
          </a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-[18px] border border-line"
        >
          <iframe
            title="Mapa da Carlão Gás e Água"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${BUSINESS.address.mapsQuery}&output=embed`}
            className="h-full min-h-[320px] w-full border-0"
          />
        </motion.div>
      </div>
    </section>
  )
}
