import { motion } from "motion/react"
import { BUSINESS } from "../data/site"

export function SinceBadge() {
  return (
    <section className="bg-white py-24">
      <div className="wrap grid items-center gap-8 sm:grid-cols-[auto_1fr]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="font-display text-7xl font-extrabold text-navy"
        >
          {BUSINESS.since}
          <small className="mt-1 block font-body text-base font-medium text-muted">abrimos as portas</small>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-[clamp(2.3rem,6vw,3.6rem)] font-extrabold text-navy">
            Mais de dez anos na mesma esquina
          </h2>
          <p className="mt-4 max-w-[60ch] text-lg text-muted">
            Desde {BUSINESS.since} a Carlão atende Itaituba na Avenida Carleto Bemergui. Tem família que pede com a
            gente desde o primeiro botijão da casa, e é esse cuidado que a gente leva em cada entrega.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
