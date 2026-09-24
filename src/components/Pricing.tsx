import { FlameIcon, DropIcon, WhatsAppIcon } from "./icons"
import { GAS_ACCESSORY, GAS_PRODUCTS, WATER_PRODUCTS } from "../data/site"
import { buildWhatsAppLink } from "../lib/whatsapp"

function PriceItem({
  name,
  description,
  price,
  message,
}: {
  name: string
  description: string
  price?: number
  message: string
}) {
  return (
    // The whole row is the tap target (the link's ::after stretches over it),
    // so ordering never depends on hitting a small link on a phone.
    <li className="group relative grid grid-cols-[1fr_auto] items-center gap-x-4 border-b border-dashed border-white/20 py-4">
      <div>
        <strong className="block font-display text-2xl font-bold leading-tight">{name}</strong>
        <span className="mt-0.5 block text-sm text-mist-dim">{description}</span>
      </div>
      <div className="flex flex-col items-end gap-1.5 text-right">
        {price != null ? (
          <b className="whitespace-nowrap font-display text-4xl font-extrabold leading-none tabular-nums text-flame-hot">
            <span className="mr-0.5 align-[0.55em] text-[0.45em]">R$</span> {price}
          </b>
        ) : (
          <span className="font-display text-xl font-bold leading-none text-mist">Consulte</span>
        )}
        {/* 14px label is normal-size text, so on the green it switches to navy-deep
            (5.5:1) instead of white (3.1:1). Press feedback is a small scale, not a
            darker green, which would drop the dark label below 4.5:1. */}
        <a
          href={buildWhatsAppLink(message)}
          target="_blank"
          rel="noopener"
          className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-white/10 px-3 text-sm font-semibold text-white transition duration-200 after:absolute after:inset-0 after:content-[''] group-hover:bg-wa group-hover:text-navy-deep group-active:bg-wa group-active:text-navy-deep motion-safe:group-active:scale-95"
        >
          <WhatsAppIcon className="h-4 w-4" />
          {price != null ? "pedir este" : "perguntar"}
          <span className="sr-only">: {name}</span>
        </a>
      </div>
    </li>
  )
}

export function Pricing() {
  return (
    <section id="precos" className="py-20 md:py-24">
      <div className="wrap">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 md:mb-10">
          <h2 className="font-display text-[clamp(2.3rem,6vw,3.6rem)] font-extrabold text-navy">Nossos preços</h2>
          <p className="max-w-[34ch] text-xl text-muted">
            Toque em &quot;pedir este&quot; e a mensagem já vai pronta para o nosso WhatsApp.
          </p>
        </div>

        <div className="surface-dark rounded-2xl bg-navy p-6 text-white sm:p-10">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-2 border-b-2 border-white/20 pb-3 font-display text-2xl font-extrabold">
                <FlameIcon className="h-6 w-6" /> Gás de cozinha
              </h3>
              <ul>
                {GAS_PRODUCTS.map((p) => (
                  <PriceItem key={p.name} name={p.name} description={p.description} price={p.price} message={p.whatsappMessage} />
                ))}
                <PriceItem
                  name={GAS_ACCESSORY.name}
                  description={GAS_ACCESSORY.description}
                  message={GAS_ACCESSORY.whatsappMessage}
                />
              </ul>
            </div>
            <div className="flex flex-col">
              <h3 className="flex items-center gap-2 border-b-2 border-white/20 pb-3 font-display text-2xl font-extrabold">
                <DropIcon className="h-6 w-6" /> Água mineral 20 L
              </h3>
              <ul>
                {WATER_PRODUCTS.map((p) => (
                  <PriceItem key={p.name} name={p.name} description={p.description} price={p.price} message={p.whatsappMessage} />
                ))}
              </ul>

              {/* Payment + disclaimer close the water column, so both columns end together on desktop. */}
              <div className="mt-8 md:mt-auto">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-1 font-semibold">Pagamento na entrega:</span>
                  {["Pix", "Cartão", "Dinheiro"].map((chip) => (
                    <span key={chip} className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold">
                      {chip}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm text-mist-dim">Preços sujeitos a alteração. Confirme o valor do dia no WhatsApp.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
