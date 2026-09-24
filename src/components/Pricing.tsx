import { motion } from "motion/react"
import { FlameIcon, DropIcon } from "./icons"
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
    <motion.div
      whileHover={{ x: 4 }}
      className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b border-dashed border-white/20 py-4"
    >
      <strong className="font-display text-2xl font-bold leading-tight">{name}</strong>
      <span className="col-start-1 text-sm text-[#B9BEE0]">{description}</span>
      <div className="col-start-2 row-span-2 text-right">
        {price != null ? (
          <b className="block font-display text-4xl font-extrabold tabular-nums text-flame-hot">R$ {price}</b>
        ) : (
          <span className="block font-display text-xl font-bold text-[#C9CDEA]">Consulte</span>
        )}
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href={buildWhatsAppLink(message)}
          target="_blank"
          rel="noopener"
          className="mt-1 inline-block text-sm font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
        >
          {price != null ? "pedir este" : "perguntar"}
        </motion.a>
      </div>
    </motion.div>
  )
}

export function Pricing() {
  return (
    <section id="precos" className="py-24">
      <div className="wrap">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-8">
          <h2 className="font-display text-[clamp(2.3rem,6vw,3.6rem)] font-extrabold text-navy">Nossos preços</h2>
          <p className="max-w-[34ch] text-xl text-muted">
            Toque em &quot;pedir este&quot; e a mensagem já vai pronta para o nosso WhatsApp.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="rounded-[22px] bg-navy p-6 text-white sm:p-10"
        >
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-2 border-b-2 border-white/20 pb-3 font-display text-2xl font-extrabold">
                <FlameIcon className="h-6 w-6" /> Gás de cozinha
              </h3>
              {GAS_PRODUCTS.map((p) => (
                <PriceItem key={p.name} name={p.name} description={p.description} price={p.price} message={p.whatsappMessage} />
              ))}
              <PriceItem
                name={GAS_ACCESSORY.name}
                description={GAS_ACCESSORY.description}
                message={GAS_ACCESSORY.whatsappMessage}
              />
            </div>
            <div>
              <h3 className="flex items-center gap-2 border-b-2 border-white/20 pb-3 font-display text-2xl font-extrabold">
                <DropIcon className="h-6 w-6" /> Água mineral 20 L
              </h3>
              {WATER_PRODUCTS.map((p) => (
                <PriceItem key={p.name} name={p.name} description={p.description} price={p.price} message={p.whatsappMessage} />
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="mr-1 font-semibold">Pagamento na entrega:</span>
            {["Pix", "Cartão", "Dinheiro"].map((chip) => (
              <span key={chip} className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold">
                {chip}
              </span>
            ))}
          </div>
          <p className="mt-6 text-sm text-[#B9BEE0]">Preços sujeitos a alteração. Confirme o valor do dia no WhatsApp.</p>
        </motion.div>
      </div>
    </section>
  )
}
