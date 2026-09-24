import { useBusinessStatus } from "./hooks/useBusinessStatus"
import { buildWhatsAppLink } from "./lib/whatsapp"
import { ORDER_MESSAGE } from "./data/site"

export default function App() {
  const status = useBusinessStatus()
  return (
    <main className="grid min-h-screen place-items-center gap-4 bg-paper p-8 text-center">
      <p className="font-display text-2xl text-navy">{status?.label ?? "Verificando horário…"}</p>
      <a className="text-wa underline" href={buildWhatsAppLink(ORDER_MESSAGE)} target="_blank" rel="noopener">
        Testar link do WhatsApp
      </a>
    </main>
  )
}
