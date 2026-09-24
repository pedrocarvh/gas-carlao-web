import { motion } from "motion/react"
import { EXAMPLE_REVIEWS } from "../data/site"

export function Reviews() {
  return (
    <section id="avaliacoes" className="py-24">
      <div className="wrap">
        <h2 className="mb-10 font-display text-[clamp(2.3rem,6vw,3.6rem)] font-extrabold text-navy">Quem pede, volta</h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid gap-6 sm:grid-cols-3"
        >
          {EXAMPLE_REVIEWS.map((review) => (
            <motion.figure
              key={review.author}
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="rounded-[18px] border border-line bg-white p-6 shadow-sm"
            >
              <div aria-label="5 de 5 estrelas" className="text-flame">★★★★★</div>
              <blockquote className="mt-3 text-ink">{review.quote}</blockquote>
              <figcaption className="mt-4 font-semibold text-navy">
                {review.author}
                <span className="block text-sm font-normal text-muted">{review.neighborhood}</span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
