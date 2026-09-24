import { PHONE } from "../data/site"

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`
}
