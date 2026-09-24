import { BUSINESS } from "../data/site"

export function SinceBadge() {
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="wrap grid items-center gap-10 md:grid-cols-[auto_1fr] md:gap-16">
        {/* Street-sign plaque for "a mesma esquina": navy plate with a white inset rule
            (an inset outline on the plate itself, not a box inside a box). */}
        <div className="w-fit rounded-xl bg-navy px-9 pb-7 pt-6 text-center text-white shadow-[0_18px_36px_-18px_rgb(13_19_80/0.6)] outline-2 -outline-offset-[7px] outline-white/80">
          <span className="block font-display text-[clamp(4.5rem,11vw,6rem)] font-extrabold leading-[0.9] text-flame-hot">
            {BUSINESS.since}
          </span>
          <span className="mt-1 block text-sm font-semibold text-mist">abrimos as portas</span>
          <span className="mt-4 block border-t border-white/25 pt-3 font-display text-xl font-bold leading-tight">
            {BUSINESS.address.street}
          </span>
        </div>
        <div>
          <h2 className="font-display text-[clamp(2.3rem,6vw,3.6rem)] font-extrabold text-navy">
            Mais de dez anos na mesma esquina
          </h2>
          <p className="mt-4 max-w-[60ch] text-lg text-muted">
            Desde {BUSINESS.since} a Carlão atende Itaituba na Avenida Carleto Bemergui. Tem família que pede com a
            gente desde o primeiro botijão da casa, e é esse cuidado que a gente leva em cada entrega.
          </p>
        </div>
      </div>
    </section>
  )
}
