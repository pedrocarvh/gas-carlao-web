import { useEffect, useState } from "react"
import { OPENING_HOURS, type Weekday } from "../data/site"

const WEEKDAY_INDEX: Record<string, Weekday> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
const TIME_ZONE = "America/Santarem"

interface ItaitubaTime {
  day: Weekday
  hour: number // fractional hour, e.g. 13.5 = 13h30
}

function nowInItaituba(): ItaitubaTime {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: TIME_ZONE,
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    }).formatToParts(new Date())
    const map: Record<string, string> = {}
    parts.forEach((p) => { map[p.type] = p.value })
    const day = WEEKDAY_INDEX[map.weekday]
    const hour = (parseInt(map.hour, 10) % 24) + parseInt(map.minute, 10) / 60
    return { day, hour }
  } catch {
    const d = new Date()
    return { day: d.getDay() as Weekday, hour: d.getHours() + d.getMinutes() / 60 }
  }
}

export interface BusinessStatus {
  day: Weekday
  isOpen: boolean
  label: string
}

function computeStatus(): BusinessStatus {
  const { day, hour } = nowInItaituba()
  const [opens, closes] = OPENING_HOURS[day]
  if (hour >= opens && hour < closes) {
    return { day, isOpen: true, label: `Aberto agora, até as ${closes}h` }
  }
  if (hour < opens) {
    return { day, isOpen: false, label: `Fechado agora. Abrimos hoje às ${opens}h` }
  }
  const nextDay = ((day + 1) % 7) as Weekday
  const [nextOpens] = OPENING_HOURS[nextDay]
  return { day, isOpen: false, label: `Fechado agora. Abrimos amanhã às ${nextOpens}h` }
}

// Returns null until the first client effect runs, and computes on the
// client rather than at build/SSG time — the business's open/closed state
// depends on the visitor's clock, not the server's build time, and
// computing it during SSG would bake a stale answer into the prerendered
// HTML plus cause a hydration mismatch.
export function useBusinessStatus(): BusinessStatus | null {
  const [status, setStatus] = useState<BusinessStatus | null>(null)

  useEffect(() => {
    setStatus(computeStatus())
    const id = window.setInterval(() => setStatus(computeStatus()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  return status
}
