import { PinIcon } from "./icons"
import { BUSINESS } from "../data/site"

export function Location() {
  return (
    <section id="onde" className="pb-20 md:pb-24">
      <div className="wrap">
        <div className="grid overflow-hidden rounded-2xl border border-line bg-white md:grid-cols-[0.9fr_1.1fr]">
          <div className="p-6 sm:p-8">
            <h2 className="mb-4 font-display text-3xl font-extrabold text-navy">Onde estamos</h2>
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
              className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-navy px-6 font-display text-lg font-bold text-white transition-colors duration-200 hover:bg-navy-soft"
            >
              <PinIcon className="h-5 w-5" />
              Abrir no mapa
            </a>
          </div>
          <div className="relative min-h-[300px] border-t border-line bg-paper md:min-h-[360px] md:border-l md:border-t-0">
            {/* Visible while the embed loads, or if it is blocked or offline. */}
            <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
              <PinIcon className="h-12 w-12 text-navy/20" />
            </div>
            <iframe
              title="Mapa da Carlão Gás e Água"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${BUSINESS.address.mapsQuery}&output=embed`}
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
