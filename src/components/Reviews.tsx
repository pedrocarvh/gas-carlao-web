import { StarIcon } from "./icons"
import { EXAMPLE_REVIEWS } from "../data/site"

export function Reviews() {
  return (
    <section id="avaliacoes" className="py-20 md:py-24">
      <div className="wrap">
        <h2 className="mb-10 font-display text-[clamp(2.3rem,6vw,3.6rem)] font-extrabold text-navy md:mb-12">
          Quem pede, volta
        </h2>
        {/* Quotes set as type in ruled columns rather than three look-alike cards. */}
        <ul className="grid gap-8 md:grid-cols-3 md:gap-0">
          {EXAMPLE_REVIEWS.map((review) => (
            <li
              key={review.author}
              className="border-t border-line pt-6 md:border-l md:border-t-0 md:px-8 md:pt-0 md:first:border-l-0 md:first:pl-0 md:last:pr-0"
            >
              <figure className="flex h-full flex-col">
                <div role="img" aria-label="5 de 5 estrelas" className="flex gap-0.5 text-flame-deep">
                  {Array.from({ length: 5 }, (_, i) => (
                    <StarIcon key={i} className="h-4 w-4" />
                  ))}
                </div>
                <blockquote className="mt-4 text-lg leading-relaxed text-ink">{review.quote}</blockquote>
                <figcaption className="mt-auto pt-5 font-semibold text-navy">
                  {review.author}
                  <span className="block text-sm font-normal text-muted">{review.neighborhood}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
