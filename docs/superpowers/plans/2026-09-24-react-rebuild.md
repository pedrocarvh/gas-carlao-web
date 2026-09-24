# Carlão Gás e Água – React Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `index.html` (a static one-file landing page) as a React + TypeScript project that pre-renders to static HTML, keeping the same business content and SEO, while giving the scroll storytelling, micro-interactions and depth effects a real animation library instead of ad-hoc CSS keyframes and a manual scroll listener.

**Architecture:** Vite + React 18 + TypeScript, built with `vite-react-ssg` (single-page mode) so the production build is static HTML/CSS/JS that hydrates in the browser. Tailwind CSS v4 (via `@tailwindcss/vite`) for styling, with the current brand colors defined as theme tokens. `motion` (Framer Motion's current package) for all animation: `useScroll`/`useTransform` for the scroll-linked jug-filling section, `whileInView`/`whileHover`/`whileTap` for reveals and micro-interactions, and mouse-driven `rotateX`/`rotateY` motion values for the hero's 3D tilt.

**Tech Stack:** Vite, React 18, TypeScript, `vite-react-ssg`, Tailwind CSS v4, `motion` (`motion/react`).

**Spec:** `docs/superpowers/specs/2026-09-24-react-rebuild-design.md`

## Global Constraints

- WhatsApp phone number is exactly `5593991666437` (used to build all `https://wa.me/...` links) — do not alter it.
- Business timezone for the open/closed calculation is `America/Santarem` — do not use the browser's local timezone.
- Brand colors (hex, exact): navy `#141C6E`, navy-deep `#0D1350`, navy-soft `#2A3494`, flame `#F28C1B`, flame-hot `#FFC93C`, water `#3FA7E0`, water-deep `#1C78B8`, paper `#F4F7FC`, ink `#1B2140`, muted `#5A6284`, line `#D9DFEE`, WhatsApp green `#1FA855`.
- Hosting is static-only (no Node server, no API routes) — the build output (`dist/`) must be deployable as plain files.
- No automated test framework is added (per spec, not justified for a marketing landing page). Every task is verified instead by: `npm run typecheck`, `npm run build` (+ inspecting `dist/index.html`), and a manual check of the running dev server (using the Playwright browser tools available in this environment).
- Never invent new business data. All prices, hours, address, phone, and the three customer reviews come verbatim from the current `index.html` (git history, first commit `ca0d9b7`). The reviews are explicitly marked in the current site as placeholders (`<!-- ATENÇÃO: avaliações de exemplo... -->`) — carry that same caveat forward as a code comment, do not present them as verified real reviews.
- Respect `prefers-reduced-motion`: parallax, the scroll-linked jug fill, the flame flicker loop, and the wave animation must all have a static fallback (this mirrors what the current site already does).
- This directory is already a git repo with two commits (`ca0d9b7` static HTML baseline, and the design spec commit). Do not re-run `git init`.

---

### Task 1: Project scaffold (Vite + React + TypeScript + Tailwind + vite-react-ssg)

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Modify: `index.html` (replace the static page with the Vite/SSG template)
- Create: `src/index.css`
- Create: `src/main.tsx`
- Create: `src/App.tsx` (temporary placeholder, replaced in Task 11)
- Create: `public/logo.png` (extracted from the base64 favicon already embedded in the current `index.html`)
- Create: `.gitignore`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: a working `npm run dev` / `npm run build` / `npm run typecheck` pipeline, the `wrap` Tailwind utility class, and the theme color/font tokens (`bg-navy`, `text-flame-hot`, `font-display`, `font-body`, etc.) that every later component uses.

- [ ] **Step 1: Extract the logo/favicon PNG from the current `index.html` before it gets overwritten**

Run this from the project root (PowerShell):

```powershell
$html = Get-Content index.html -Raw
if ($html -match 'href="data:image/png;base64,([^"]+)"') {
  New-Item -ItemType Directory -Force -Path public | Out-Null
  [System.IO.File]::WriteAllBytes("public/logo.png", [Convert]::FromBase64String($Matches[1]))
} else {
  throw "favicon data URI not found in index.html"
}
```

Verify: `public/logo.png` exists and is a valid PNG (open it or run `Get-Item public/logo.png` and confirm it's ~10-20 KB, not 0 bytes).

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "gas-carlao-web",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite-react-ssg build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  }
}
```

- [ ] **Step 3: Install dependencies**

```bash
npm install react react-dom motion
npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom tailwindcss @tailwindcss/vite vite-react-ssg react-router-dom
```

Verify: `npm install` exits 0 and `package.json` now lists concrete versions for all of the above under `dependencies`/`devDependencies`.

- [ ] **Step 4: Create `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`**

`tsconfig.json`:
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

`tsconfig.app.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

`tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 5: Create `vite.config.ts`**

```ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 6: Replace `index.html` with the Vite/SSG template**

Keep every meta tag, the title, the JSON-LD block and the Google Fonts links exactly as they are today (this is what preserves SEO), just point the favicon at the extracted PNG and replace the `<body>` with the React mount point:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>Carlão Gás e Água | Entrega de gás e água em Itaituba - PA</title>
<meta name="description" content="Gás Paraguás 8kg e 13kg e água mineral 20L com entrega em toda Itaituba. Peça pelo WhatsApp (93) 99166-6437. Desde 2014 no Jardim das Araras." />
<meta name="theme-color" content="#141C6E" />
<meta property="og:title" content="Carlão Gás e Água | Itaituba - PA" />
<meta property="og:description" content="Gás e água na sua porta, em toda Itaituba. Peça pelo WhatsApp." />
<meta property="og:type" content="website" />
<link rel="icon" type="image/png" href="/logo.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet" />
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "Carlão Gás e Água Distribuidora",
  "telephone": "+55 93 99166-6437",
  "foundingDate": "2014",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Avenida Carleto Bemergui, 950, esquina com Rua Décima Quarta",
    "addressLocality": "Itaituba",
    "addressRegion": "PA",
    "postalCode": "68180-400",
    "addressCountry": "BR"
  },
  "areaServed": "Itaituba - PA",
  "paymentAccepted": "Pix, Cartão, Dinheiro",
  "openingHoursSpecification": [
    {"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday"],"opens":"07:00","closes":"22:00"},
    {"@type":"OpeningHoursSpecification","dayOfWeek":"Saturday","opens":"08:00","closes":"21:00"},
    {"@type":"OpeningHoursSpecification","dayOfWeek":"Sunday","opens":"07:00","closes":"14:00"}
  ],
  "sameAs": ["https://www.instagram.com/carlaogasagua"]
}
</script>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

- [ ] **Step 7: Create `src/index.css`**

```css
@import "tailwindcss";

@theme {
  --color-navy: #141C6E;
  --color-navy-deep: #0D1350;
  --color-navy-soft: #2A3494;
  --color-flame: #F28C1B;
  --color-flame-hot: #FFC93C;
  --color-water: #3FA7E0;
  --color-water-deep: #1C78B8;
  --color-paper: #F4F7FC;
  --color-ink: #1B2140;
  --color-muted: #5A6284;
  --color-line: #D9DFEE;
  --color-wa: #1FA855;

  --font-display: "Barlow Condensed", "Arial Narrow", "Roboto Condensed", sans-serif;
  --font-body: "Barlow", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

@utility wrap {
  margin-inline: auto;
  width: min(1120px, 100% - 2.5rem);
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 76px;
}

body {
  background-color: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
}

h1, h2, h3 {
  font-family: var(--font-display);
}

:focus-visible {
  outline: 3px solid var(--color-flame);
  outline-offset: 3px;
  border-radius: 4px;
}
```

- [ ] **Step 8: Create `src/main.tsx`**

```tsx
import { ViteReactSSG } from "vite-react-ssg/single-page"
import App from "./App"
import "./index.css"

export const createRoot = ViteReactSSG(<App />)
```

- [ ] **Step 9: Create a temporary `src/App.tsx` placeholder**

```tsx
export default function App() {
  return (
    <main className="grid min-h-screen place-items-center bg-paper">
      <p className="font-display text-2xl text-navy">Carlão Gás e Água — em construção</p>
    </main>
  )
}
```

- [ ] **Step 10: Create `.gitignore`**

```
node_modules
dist
.DS_Store
*.local
```

- [ ] **Step 11: Verify typecheck and build**

Run: `npm run typecheck` — expected: no output, exit code 0.
Run: `npm run build` — expected: exit code 0, and `dist/index.html` exists and contains both `Carlão Gás e Água — em construção` and the JSON-LD `"@type": "Store"` block (confirms SSG pre-rendering is producing real HTML, not an empty shell).

- [ ] **Step 12: Verify the dev server renders**

Run `npm run dev` in the background, then use the Playwright browser tools available in this environment to navigate to the printed local URL (typically `http://localhost:5173/`) and confirm the placeholder text is visible. Stop the dev server afterward.

- [ ] **Step 13: Commit**

```bash
git add package.json package-lock.json tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts index.html src public .gitignore
git commit -m "Scaffold Vite + React + TypeScript + Tailwind + vite-react-ssg project"
```

---

### Task 2: Data layer and business-logic hooks

**Files:**
- Create: `src/data/site.ts`
- Create: `src/lib/whatsapp.ts`
- Create: `src/hooks/useBusinessStatus.ts`
- Modify: `src/App.tsx` (temporary debug render to prove the hooks work, replaced in Task 11)

**Interfaces:**
- Consumes: nothing new from Task 1 beyond the build pipeline.
- Produces:
  - `PHONE: string`, `ORDER_MESSAGE: string`, `OPENING_HOURS: Record<Weekday, [number, number]>`, `HOURS_TABLE: HoursRow[]`, `BUSINESS: {...}`, `GAS_PRODUCTS: GasProduct[]`, `GAS_ACCESSORY: GasAccessory`, `WATER_PRODUCTS: GasProduct[]`, `STEPS: Step[]`, `EXAMPLE_REVIEWS: Review[]` — all from `src/data/site.ts`.
  - `buildWhatsAppLink(message: string): string` from `src/lib/whatsapp.ts`.
  - `useBusinessStatus(): BusinessStatus | null` from `src/hooks/useBusinessStatus.ts`, where `BusinessStatus = { day: Weekday; isOpen: boolean; label: string }`. Returns `null` until the first client-side effect runs (see Step 3 for why).

- [ ] **Step 1: Create `src/data/site.ts`**

```ts
export const PHONE = "5593991666437"
export const ORDER_MESSAGE = "Olá, Carlão! Quero fazer um pedido."

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = domingo, matches Date#getDay()

export const OPENING_HOURS: Record<Weekday, [number, number]> = {
  0: [7, 14],
  1: [7, 22],
  2: [7, 22],
  3: [7, 22],
  4: [7, 22],
  5: [7, 22],
  6: [8, 21],
}

export interface HoursRow {
  label: string
  days: Weekday[]
  opens: number
  closes: number
}

export const HOURS_TABLE: HoursRow[] = [
  { label: "Segunda a sexta", days: [1, 2, 3, 4, 5], opens: 7, closes: 22 },
  { label: "Sábado", days: [6], opens: 8, closes: 21 },
  { label: "Domingo", days: [0], opens: 7, closes: 14 },
]

export const BUSINESS = {
  name: "Carlão Gás e Água",
  legalName: "Carlão Gás e Água Distribuidora",
  tagline: "Distribuidora em Itaituba",
  since: 2014,
  cnpj: "00.000.000/0000-00",
  anp: "000000",
  instagram: "https://www.instagram.com/carlaogasagua",
  instagramHandle: "@carlaogasagua",
  address: {
    street: "Avenida Carleto Bemergui, 950",
    complement: "Esquina com a Rua Décima Quarta",
    neighborhood: "Jardim das Araras, Itaituba - PA",
    zip: "68180-400",
    mapsQuery: "Avenida+Carleto+Bemergui+950+Jardim+das+Araras+Itaituba+PA",
  },
}

export interface GasProduct {
  name: string
  description: string
  price: number
  whatsappMessage: string
}

export interface GasAccessory {
  name: string
  description: string
  whatsappMessage: string
}

export const GAS_PRODUCTS: GasProduct[] = [
  {
    name: "Botijão 13 kg",
    description: "Gás Paraguás, o tamanho de casa",
    price: 140,
    whatsappMessage: "Olá, Carlão! Quero pedir 1 botijão de gás 13 kg Paraguás.",
  },
  {
    name: "Botijão 8 kg",
    description: "Gás Paraguás, para quem usa pouco",
    price: 110,
    whatsappMessage: "Olá, Carlão! Quero pedir 1 botijão de gás 8 kg Paraguás.",
  },
]

export const GAS_ACCESSORY: GasAccessory = {
  name: "Registro, mangueira e suporte",
  description: "Acessórios para instalar com segurança",
  whatsappMessage: "Olá, Carlão! Queria saber o preço de registro, mangueira e suporte para botijão.",
}

export const WATER_PRODUCTS: GasProduct[] = [
  {
    name: "Bom Jesus",
    description: "Galão de 20 litros",
    price: 19,
    whatsappMessage: "Olá, Carlão! Quero pedir 1 galão de água Bom Jesus 20 L.",
  },
  {
    name: "Cristal da Serra",
    description: "Galão de 20 litros",
    price: 21,
    whatsappMessage: "Olá, Carlão! Quero pedir 1 galão de água Cristal da Serra 20 L.",
  },
]

export interface Step {
  title: string
  description: string
}

export const STEPS: Step[] = [
  { title: "Chame no WhatsApp", description: "Diga o que precisa, gás, água ou os dois, e o seu endereço." },
  { title: "A entrega sai daqui", description: "Nosso entregador leva até a sua porta, em qualquer bairro de Itaituba." },
  { title: "Pague como preferir", description: "Pix, cartão ou dinheiro, na hora da entrega." },
]

export interface Review {
  author: string
  neighborhood: string
  quote: string
}

// AVISO: avaliações de exemplo copiadas do site atual. Trocar por avaliações
// reais de clientes antes de divulgar o site (o mesmo aviso já existia no
// index.html original).
export const EXAMPLE_REVIEWS: Review[] = [
  { author: "Dona Raimunda", neighborhood: "Bela Vista", quote: "O gás acabou no meio do almoço de domingo. Chamei no WhatsApp e em pouco tempo o botijão já estava aqui." },
  { author: "Marcos A.", neighborhood: "Centro", quote: "Compro água toda semana aqui. Entregador educado, sobe com o galão e ainda aceita Pix na hora." },
  { author: "Juliana S.", neighborhood: "Jardim das Araras", quote: "Tenho restaurante e o Carlão nunca me deixou na mão. Preço justo e atendimento de quem conhece a gente." },
]
```

- [ ] **Step 2: Create `src/lib/whatsapp.ts`**

```ts
import { PHONE } from "../data/site"

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`
}
```

- [ ] **Step 3: Create `src/hooks/useBusinessStatus.ts`**

```tsx
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
```

- [ ] **Step 4: Temporarily wire the hooks into `src/App.tsx` to prove they work**

```tsx
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
```

- [ ] **Step 5: Verify**

Run: `npm run typecheck` — expected: exit code 0.
Run: `npm run build` — expected: exit code 0; `dist/index.html` still contains `Verificando horário…` (the SSG snapshot, since the hook resolves after hydration — this is expected, not a bug).
Start `npm run dev` in the background, navigate with Playwright, and confirm: (a) the page shows either "Aberto agora, até as Xh" or "Fechado agora..." within a second or two (not stuck on "Verificando horário…"), and (b) the WhatsApp link's `href` starts with `https://wa.me/5593991666437?text=`. Stop the dev server afterward.

- [ ] **Step 6: Commit**

```bash
git add src/data src/lib src/hooks src/App.tsx
git commit -m "Add site data, WhatsApp link builder, and business-status hook"
```

---

### Task 3: Icon components and Header

**Files:**
- Create: `src/components/icons.tsx`
- Create: `src/components/Header.tsx`
- Modify: `src/App.tsx` (render `<Header />` above the existing debug content)

**Interfaces:**
- Consumes: `buildWhatsAppLink` (Task 2), `ORDER_MESSAGE` (Task 2).
- Produces: `WhatsAppIcon`, `FlameIcon`, `DropIcon` React components (each takes `{ className?: string }`) from `src/components/icons.tsx`, reused by every later component that needs an icon. `Header` component (no props).

- [ ] **Step 1: Create `src/components/icons.tsx`**

```tsx
interface IconProps {
  className?: string
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24Zm4.52-6.17c-.25-.12-1.47-.72-1.7-.8-.22-.09-.39-.13-.55.12-.17.25-.64.8-.78.97-.14.16-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42h-.47c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  )
}

export function FlameIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#F28C1B" d="M12 2c1 3.5 5 5.8 5 10.5A5 5 0 0 1 7 12.5c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-6 1-9Z" />
      <path fill="#FFC93C" d="M12 11c.8 1.4 2.4 2.5 2.4 4.4a2.4 2.4 0 0 1-4.8 0c0-1 .5-1.8 1-2.3 0 .8.5 1.2 1 1.2 0-1.2-.2-2.2.4-3.3Z" />
    </svg>
  )
}

export function DropIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#3FA7E0" d="M12 2.5S5 10.2 5 15a7 7 0 0 0 14 0c0-4.8-7-12.5-7-12.5Z" />
      <path fill="#fff" opacity=".55" d="M9.2 14.2c.3-1.6 1.2-3 2-4-.4 1.6-.6 3.2.1 4.6-.9.6-2.3.4-2.1-.6Z" />
    </svg>
  )
}
```

- [ ] **Step 2: Create `src/components/Header.tsx`**

```tsx
import { motion } from "motion/react"
import { WhatsAppIcon } from "./icons"
import { ORDER_MESSAGE } from "../data/site"
import { buildWhatsAppLink } from "../lib/whatsapp"

const NAV_LINKS = [
  { href: "#precos", label: "Preços" },
  { href: "#horarios", label: "Horários" },
  { href: "#onde", label: "Onde estamos" },
]

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white">
      <div className="wrap flex h-[72px] items-center justify-between gap-4">
        <a href="#inicio" className="flex items-center gap-3" aria-label="Carlão Gás e Água, início">
          <img src="/logo.png" alt="" width={56} height={56} />
          <span className="font-display text-xl font-extrabold leading-none text-navy">
            Carlão Gás e Água
            <small className="mt-0.5 block font-body text-xs font-medium text-muted max-md:hidden">
              Distribuidora em Itaituba
            </small>
          </span>
        </a>
        <nav aria-label="Principal" className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.98rem] font-semibold text-ink hover:text-navy-soft max-md:hidden"
            >
              {link.label}
            </a>
          ))}
          <motion.a
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            href={buildWhatsAppLink(ORDER_MESSAGE)}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-full bg-wa px-4 py-2 font-display text-lg font-bold text-white"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Pedir
          </motion.a>
        </nav>
      </div>
    </header>
  )
}
```

- [ ] **Step 3: Render `Header` in `src/App.tsx`**

```tsx
import { Header } from "./components/Header"
import { useBusinessStatus } from "./hooks/useBusinessStatus"
import { buildWhatsAppLink } from "./lib/whatsapp"
import { ORDER_MESSAGE } from "./data/site"

export default function App() {
  const status = useBusinessStatus()
  return (
    <>
      <Header />
      <main className="grid min-h-screen place-items-center gap-4 bg-paper p-8 text-center">
        <p className="font-display text-2xl text-navy">{status?.label ?? "Verificando horário…"}</p>
        <a className="text-wa underline" href={buildWhatsAppLink(ORDER_MESSAGE)} target="_blank" rel="noopener">
          Testar link do WhatsApp
        </a>
      </main>
    </>
  )
}
```

- [ ] **Step 4: Verify**

Run: `npm run typecheck` && `npm run build` — expected: both succeed.
Start `npm run dev`, navigate with Playwright, take a screenshot. Confirm: header is visible and sticky (scroll the debug content if needed), logo image loads (not broken), nav links "Preços"/"Horários"/"Onde estamos" are visible at desktop width and hidden below ~820px width (resize the viewport to confirm), and hovering/clicking the "Pedir" button doesn't throw console errors. Stop the dev server afterward.

- [ ] **Step 5: Commit**

```bash
git add src/components/icons.tsx src/components/Header.tsx src/App.tsx
git commit -m "Add icon components and Header"
```

---

### Task 4: Hero section

**Files:**
- Create: `src/components/Hero.tsx`
- Modify: `src/App.tsx` (render `<Hero />` in place of the debug content)

**Interfaces:**
- Consumes: `useBusinessStatus` (Task 2), `buildWhatsAppLink`/`ORDER_MESSAGE` (Task 2), `WhatsAppIcon` (Task 3).
- Produces: `Hero` component (no props) with `id="hero"` on its root `<section>` — Task 10's `FloatingWhatsApp` depends on this exact id existing for its `IntersectionObserver` target.

- [ ] **Step 1: Create `src/components/Hero.tsx`**

```tsx
import { motion, useMotionValue, useTransform, useReducedMotion } from "motion/react"
import { WhatsAppIcon } from "./icons"
import { ORDER_MESSAGE } from "../data/site"
import { buildWhatsAppLink } from "../lib/whatsapp"
import { useBusinessStatus } from "../hooks/useBusinessStatus"

export function Hero() {
  const status = useBusinessStatus()
  const reducedMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-60, 60], [10, -10])
  const rotateY = useTransform(x, [-60, 60], [-10, 10])

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (reducedMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    x.set(event.clientX - rect.left - rect.width / 2)
    y.set(event.clientY - rect.top - rect.height / 2)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <section id="hero" className="overflow-hidden bg-navy text-white">
      <div className="wrap grid grid-cols-[1.15fr_0.85fr] items-center gap-8 py-16 max-md:grid-cols-1 max-md:py-10">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                status?.isOpen ? "bg-[#4BE08A] shadow-[0_0_0_4px_rgba(75,224,138,.2)]" : "bg-[#9aa0bd]"
              }`}
            />
            <span>{status?.label ?? "Verificando horário…"}</span>
          </div>
          <h1 className="font-display text-[clamp(3.1rem,9vw,6.4rem)] font-extrabold leading-none">
            Acabou o gás?
            <span className="block text-flame-hot">A gente leva.</span>
          </h1>
          <p className="mt-6 max-w-[36ch] text-xl text-[#C9CDEA]">
            Gás de cozinha e água mineral de 20 litros com entrega em toda Itaituba. É só chamar no WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={buildWhatsAppLink(ORDER_MESSAGE)}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full bg-wa px-6 py-3 font-display text-xl font-bold text-white"
            >
              <WhatsAppIcon className="h-6 w-6" /> Pedir pelo WhatsApp
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#precos"
              className="inline-flex items-center rounded-full px-6 py-3 font-display text-xl font-bold text-white shadow-[inset_0_0_0_2px_rgba(255,255,255,.45)]"
            >
              Ver preços
            </motion.a>
          </div>
        </div>

        <div
          className="grid place-items-center"
          style={{ perspective: 800 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          aria-hidden="true"
        >
          <motion.svg
            viewBox="0 0 240 330"
            className="w-[min(360px,80%)] overflow-visible"
            style={reducedMotion ? undefined : { rotateX, rotateY }}
          >
            <defs>
              <linearGradient id="body" x1="0" x2="1">
                <stop offset="0" stopColor="#1F2A8F" />
                <stop offset=".35" stopColor="#3441B8" />
                <stop offset=".6" stopColor="#2A3494" />
                <stop offset="1" stopColor="#141C6E" />
              </linearGradient>
              <linearGradient id="ring" x1="0" x2="1">
                <stop offset="0" stopColor="#C9CDEA" />
                <stop offset=".4" stopColor="#FFFFFF" />
                <stop offset="1" stopColor="#9AA0BD" />
              </linearGradient>
            </defs>
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.2, 0.9, 0.3, 1.2] }}
              style={{ transformOrigin: "120px 86px" }}
            >
              <motion.path
                animate={
                  reducedMotion
                    ? undefined
                    : { scaleX: [1, 0.96, 1.03, 1], scaleY: [1, 1.06, 0.95, 1], skewX: [0, -2, 2, 0] }
                }
                transition={{ duration: 1.8, times: [0, 0.3, 0.6, 1], repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "120px 86px" }}
                fill="#F28C1B"
                d="M120 8c8 26 38 44 38 78a38 38 0 0 1-76 0c0-15 7-26 15-34 0 15 7 22 15 22 0-22-7-44 8-66Z"
              />
              <motion.path
                animate={
                  reducedMotion
                    ? undefined
                    : { scaleX: [1, 1.03, 0.97, 1], scaleY: [1, 0.94, 1.05, 1], skewX: [0, 2, -2, 0] }
                }
                transition={{ duration: 1.3, times: [0, 0.3, 0.6, 1], repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "120px 86px" }}
                fill="#FFC93C"
                d="M120 58c6 11 18 19 18 33a18 18 0 0 1-36 0c0-8 4-14 8-17 0 6 4 9 8 9 0-9-2-17 2-25Z"
              />
            </motion.g>
            <path
              d="M70 150c0-16 10-24 22-24h56c12 0 22 8 22 24v12H152v-8c0-6-4-10-10-10H98c-6 0-10 4-10 10v8H70z"
              fill="url(#ring)"
            />
            <rect x="108" y="140" width="24" height="18" rx="3" fill="#6B7194" />
            <path
              d="M44 205c0-26 24-44 76-44s76 18 76 44v70c0 22-24 38-76 38s-76-16-76-38Z"
              fill="url(#body)"
            />
            <path d="M44 232c20 10 132 10 152 0" stroke="#FFFFFF" strokeOpacity=".25" strokeWidth="3" fill="none" />
            <path d="M44 262c20 10 132 10 152 0" stroke="#FFFFFF" strokeOpacity=".25" strokeWidth="3" fill="none" />
            <path
              d="M64 196c4-12 16-18 30-20"
              stroke="#FFFFFF"
              strokeOpacity=".35"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <path d="M60 300h120l-6 22H66z" fill="#0D1350" />
          </motion.svg>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Render `Hero` in `src/App.tsx`**

```tsx
import { Header } from "./components/Header"
import { Hero } from "./components/Hero"

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
      </main>
    </>
  )
}
```

- [ ] **Step 3: Verify**

Run: `npm run typecheck` && `npm run build` — expected: both succeed; grep `dist/index.html` for `Acabou o gás?` to confirm it was prerendered.
Start `npm run dev`, navigate with Playwright:
- Screenshot at desktop width (~1440px): confirm the two-column hero layout, the flame animation playing (take two screenshots ~1s apart and confirm the flame paths differ slightly), and the status pill showing real text (not "Verificando horário…").
- Move the mouse across the flame SVG area and confirm (via a screenshot or `browser_evaluate` reading the element's computed `transform`) that the SVG tilts.
- Resize to mobile width (~390px) and screenshot: confirm the layout stacks to one column.
- Use `browser_emulate_media` (or equivalent) to set `prefers-reduced-motion: reduce`, reload, and confirm the flame is static (no visible change across two screenshots) and the tilt no longer responds to mouse movement.
Stop the dev server afterward.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.tsx src/App.tsx
git commit -m "Add Hero section with animated flame art and 3D tilt"
```

---

### Task 5: ScrollStory section (jug filling as you scroll)

**Files:**
- Create: `src/components/ScrollStory.tsx`
- Modify: `src/App.tsx` (render `<ScrollStory />` after `<Hero />`)

**Interfaces:**
- Consumes: `STEPS` (Task 2).
- Produces: `ScrollStory` component (no props), `id="como-pedir"` on its root `<section>`.

- [ ] **Step 1: Create `src/components/ScrollStory.tsx`**

```tsx
import { useRef, useState } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useAnimationFrame,
  useReducedMotion,
} from "motion/react"
import { STEPS } from "../data/site"

const EMPTY_Y = 310
const FULL_Y = 30

export function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null)
  const wavePathRef = useRef<SVGPathElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] })
  const waterY = useTransform(scrollYProgress, [0, 1], [EMPTY_Y, FULL_Y])
  const [liters, setLiters] = useState(0)
  const [activeStep, setActiveStep] = useState(0)

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setLiters(Math.round(latest * 20))
    setActiveStep(latest < 0.34 ? 0 : latest < 0.67 ? 1 : 2)
  })

  useAnimationFrame((t) => {
    if (reducedMotion || !wavePathRef.current) return
    const phase = (t / 1000) * 2
    const a = Math.sin(phase) * 6
    const b = Math.cos(phase) * 6
    wavePathRef.current.setAttribute(
      "d",
      `M-40 8 C 0 ${-4 + a}, 40 ${20 - a}, 80 8 S 160 ${-4 + b}, 200 8 S 280 ${20 - b}, 320 8 V 400 H -40 Z`,
    )
  })

  const displayLiters = reducedMotion ? 20 : liters
  const displayStep = reducedMotion ? 2 : activeStep

  return (
    <section
      id="como-pedir"
      aria-label="Como pedir"
      ref={containerRef}
      className="relative bg-paper"
      style={{ height: reducedMotion ? "auto" : "320vh" }}
    >
      <div
        className="flex items-center overflow-hidden py-16"
        style={
          reducedMotion
            ? undefined
            : { position: "sticky", top: 72, height: "calc(100vh - 72px)" }
        }
      >
        <div className="wrap grid grid-cols-[0.9fr_1.1fr] items-center gap-12 max-md:grid-cols-1">
          <div className="relative grid place-items-center">
            <svg viewBox="0 0 220 320" className="w-[min(320px,100%)]">
              <defs>
                <clipPath id="jugClip">
                  <path d="M84 20h52v26c0 6 6 10 14 14 30 14 50 34 50 70v150c0 18-12 30-30 30H50c-18 0-30-12-30-30V130c0-36 20-56 50-70 8-4 14-8 14-14Z" />
                </clipPath>
                <linearGradient id="waterG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#6CC2F0" />
                  <stop offset="1" stopColor="#1C78B8" />
                </linearGradient>
              </defs>
              <rect x="80" y="4" width="60" height="22" rx="5" fill="#141C6E" />
              <g clipPath="url(#jugClip)">
                <rect x="0" y="0" width="220" height="320" fill="#E8F3FB" />
                <motion.g style={reducedMotion ? { y: FULL_Y } : { y: waterY }}>
                  <path
                    ref={wavePathRef}
                    fill="url(#waterG)"
                    d="M-40 8 C 0 -4, 40 20, 80 8 S 160 -4, 200 8 S 280 20, 320 8 V 400 H -40 Z"
                  />
                  <circle cx="70" cy="60" r="4" fill="#fff" opacity=".5" />
                  <circle cx="140" cy="110" r="3" fill="#fff" opacity=".45" />
                  <circle cx="100" cy="170" r="5" fill="#fff" opacity=".35" />
                </motion.g>
              </g>
              <path
                d="M84 20h52v26c0 6 6 10 14 14 30 14 50 34 50 70v150c0 18-12 30-30 30H50c-18 0-30-12-30-30V130c0-36 20-56 50-70 8-4 14-8 14-14Z"
                fill="none"
                stroke="#1C78B8"
                strokeWidth="4"
              />
              <path d="M22 180h176M22 232h176" stroke="#1C78B8" strokeOpacity=".35" strokeWidth="3" />
              <path
                d="M44 140c2-20 12-34 30-44"
                stroke="#fff"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
                opacity=".7"
              />
              <path d="M40 200v70" stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity=".55" />
            </svg>
            <div className="mt-4 font-display text-2xl font-extrabold tabular-nums text-water-deep">
              {displayLiters} de 20 litros
            </div>
          </div>

          <div>
            <h2 className="mb-8 font-display text-[clamp(2.3rem,6vw,3.6rem)] font-extrabold text-navy">
              Pedir é simples
            </h2>
            <ol className="grid gap-6">
              {STEPS.map((step, i) => (
                <motion.li
                  key={step.title}
                  animate={{ opacity: i <= displayStep ? 1 : 0.28 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-[3.2rem_1fr] items-start gap-4"
                >
                  <motion.span
                    animate={
                      i <= displayStep
                        ? { backgroundColor: "#141C6E", color: "#FFFFFF" }
                        : { backgroundColor: "#FFFFFF", color: "#141C6E" }
                    }
                    transition={{ duration: 0.4 }}
                    className="grid h-[3.2rem] w-[3.2rem] place-items-center rounded-full font-display text-2xl font-extrabold shadow-[inset_0_0_0_2px_var(--color-line)]"
                  >
                    {i + 1}
                  </motion.span>
                  <div>
                    <h3 className="font-display text-3xl font-extrabold text-navy">{step.title}</h3>
                    <p className="mt-1 max-w-[38ch] text-muted">{step.description}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Render `ScrollStory` in `src/App.tsx`**

```tsx
import { Header } from "./components/Header"
import { Hero } from "./components/Hero"
import { ScrollStory } from "./components/ScrollStory"

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ScrollStory />
      </main>
    </>
  )
}
```

- [ ] **Step 3: Verify**

Run: `npm run typecheck` && `npm run build` — expected: both succeed; grep `dist/index.html` for `Pedir é simples`.
Start `npm run dev`, navigate with Playwright:
- Screenshot at the top of the section: confirm the jug appears mostly empty and only step 1 ("Chame no WhatsApp") is highlighted.
- Scroll down roughly a third of the section's height, screenshot: confirm the jug water level rose and step 2 is now highlighted too.
- Scroll to the end of the section, screenshot: confirm the jug reads "20 de 20 litros" and all three steps are highlighted.
- Confirm the wave inside the jug visibly animates between two screenshots taken ~1s apart while scroll position is held constant.
- Emulate `prefers-reduced-motion: reduce`, reload, and confirm the section no longer takes 320vh of scroll space (it should render at a normal, short height) and the jug shows "20 de 20 litros" immediately without scrolling.
Stop the dev server afterward.

- [ ] **Step 4: Commit**

```bash
git add src/components/ScrollStory.tsx src/App.tsx
git commit -m "Add scroll-linked ScrollStory section (jug filling + steps)"
```

---

### Task 6: Pricing section

**Files:**
- Create: `src/components/Pricing.tsx`
- Modify: `src/App.tsx` (render `<Pricing />` after `<ScrollStory />`)

**Interfaces:**
- Consumes: `GAS_PRODUCTS`, `GAS_ACCESSORY`, `WATER_PRODUCTS` (Task 2), `buildWhatsAppLink` (Task 2), `FlameIcon`, `DropIcon` (Task 3).
- Produces: `Pricing` component (no props), `id="precos"` on its root `<section>`.

- [ ] **Step 1: Create `src/components/Pricing.tsx`**

```tsx
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
```

- [ ] **Step 2: Render `Pricing` in `src/App.tsx`** (add the import and place `<Pricing />` after `<ScrollStory />`)

- [ ] **Step 3: Verify**

Run: `npm run typecheck` && `npm run build` — expected: both succeed; grep `dist/index.html` for `R$ 140` and `R$ 19`.
Start `npm run dev`, navigate with Playwright, scroll to the pricing section, screenshot: confirm both columns (gas/water), all five priced rows plus the "Consulte" accessory row, and the payment chips. Hover a "pedir este" link and confirm (via `browser_evaluate` or a screenshot showing the scale change) the hover micro-interaction fires. Click one "pedir este" link and confirm (via `browser_network_requests` or checking the opened tab's URL) it opens `https://wa.me/5593991666437?text=...` with the exact product message from `src/data/site.ts`. Stop the dev server afterward.

- [ ] **Step 4: Commit**

```bash
git add src/components/Pricing.tsx src/App.tsx
git commit -m "Add Pricing section"
```

---

### Task 7: HoursAndArea and SinceBadge sections

**Files:**
- Create: `src/components/HoursAndArea.tsx`
- Create: `src/components/SinceBadge.tsx`
- Modify: `src/App.tsx` (render both after `<Pricing />`)

**Interfaces:**
- Consumes: `HOURS_TABLE`, `BUSINESS` (Task 2), `useBusinessStatus` (Task 2).
- Produces: `HoursAndArea` component (no props, `id="horarios"`), `SinceBadge` component (no props).

- [ ] **Step 1: Create `src/components/HoursAndArea.tsx`**

```tsx
import { motion } from "motion/react"
import { HOURS_TABLE } from "../data/site"
import { useBusinessStatus } from "../hooks/useBusinessStatus"

export function HoursAndArea() {
  const status = useBusinessStatus()

  return (
    <section id="horarios" className="pb-24">
      <div className="wrap grid gap-6 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="rounded-[18px] border border-line bg-white p-8"
        >
          <h3 className="mb-4 font-display text-3xl font-extrabold text-navy">Horário de atendimento</h3>
          <table className="w-full border-collapse text-lg">
            <tbody>
              {HOURS_TABLE.map((row) => (
                <tr key={row.label} className={row.days.includes(status?.day ?? -1) ? "font-bold text-navy" : "text-ink"}>
                  <td className="border-t border-line py-2">{row.label}</td>
                  <td className="border-t border-line py-2 text-right">
                    {row.opens}h às {row.closes}h
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-[18px] border border-line bg-white p-8"
        >
          <h3 className="mb-4 font-display text-3xl font-extrabold text-navy">Onde entregamos</h3>
          <div className="font-display text-4xl font-extrabold text-navy">Toda Itaituba</div>
          <p className="mt-3 text-muted">
            Do Jardim das Araras a qualquer outro bairro da cidade. Não sabe se chega no seu endereço? Pergunta no WhatsApp.
          </p>
          <div className="mt-6 rounded-xl bg-paper p-4">
            <b className="block text-navy">Em breve: unidade no Pérola</b>
            <span className="text-sm text-muted">Uma nova loja para atender você ainda mais rápido.</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create `src/components/SinceBadge.tsx`**

```tsx
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
```

- [ ] **Step 3: Render both in `src/App.tsx`** (add imports, place `<HoursAndArea />` then `<SinceBadge />` after `<Pricing />`)

- [ ] **Step 4: Verify**

Run: `npm run typecheck` && `npm run build` — expected: both succeed; grep `dist/index.html` for `Toda Itaituba` and `Mais de dez anos na mesma esquina`.
Start `npm run dev`, navigate with Playwright, scroll to each section and screenshot. For the hours table, confirm exactly one row is bold (matching the current day — cross-check against the status pill text from the Hero section on the same page load). Stop the dev server afterward.

- [ ] **Step 5: Commit**

```bash
git add src/components/HoursAndArea.tsx src/components/SinceBadge.tsx src/App.tsx
git commit -m "Add HoursAndArea and SinceBadge sections"
```

---

### Task 8: Reviews section

**Files:**
- Create: `src/components/Reviews.tsx`
- Modify: `src/App.tsx` (render `<Reviews />` after `<SinceBadge />`)

**Interfaces:**
- Consumes: `EXAMPLE_REVIEWS` (Task 2).
- Produces: `Reviews` component (no props), `id="avaliacoes"` on its root `<section>`.

- [ ] **Step 1: Create `src/components/Reviews.tsx`**

```tsx
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
```

- [ ] **Step 2: Render `Reviews` in `src/App.tsx`**

- [ ] **Step 3: Verify**

Run: `npm run typecheck` && `npm run build` — expected: both succeed; grep `dist/index.html` for `Quem pede, volta` and `Dona Raimunda`.
Start `npm run dev`, navigate with Playwright, scroll to the reviews section: confirm the three cards appear staggered (screenshot mid-scroll to see them animate in one after another, or confirm via `browser_evaluate` that their opacity increases in sequence), and confirm hovering a card lifts it slightly. Stop the dev server afterward.

- [ ] **Step 4: Commit**

```bash
git add src/components/Reviews.tsx src/App.tsx
git commit -m "Add Reviews section"
```

---

### Task 9: Location section

**Files:**
- Create: `src/components/Location.tsx`
- Modify: `src/App.tsx` (render `<Location />` after `<Reviews />`)

**Interfaces:**
- Consumes: `BUSINESS` (Task 2).
- Produces: `Location` component (no props), `id="onde"` on its root `<section>`.

- [ ] **Step 1: Create `src/components/Location.tsx`**

```tsx
import { motion } from "motion/react"
import { BUSINESS } from "../data/site"

export function Location() {
  return (
    <section id="onde" className="pb-24">
      <div className="wrap grid gap-6 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="rounded-[18px] border border-line bg-white p-8"
        >
          <h3 className="mb-4 font-display text-3xl font-extrabold text-navy">Onde estamos</h3>
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
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 font-display text-lg font-bold text-white"
          >
            Abrir no mapa
          </a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-[18px] border border-line"
        >
          <iframe
            title="Mapa da Carlão Gás e Água"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${BUSINESS.address.mapsQuery}&output=embed`}
            className="h-full min-h-[320px] w-full border-0"
          />
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Render `Location` in `src/App.tsx`**

- [ ] **Step 3: Verify**

Run: `npm run typecheck` && `npm run build` — expected: both succeed; grep `dist/index.html` for `Avenida Carleto Bemergui, 950`.
Start `npm run dev`, navigate with Playwright, scroll to the location section, screenshot: confirm the address block, the "Abrir no mapa" link, and the embedded map iframe all render. Confirm the "Abrir no mapa" link's `href` matches `https://www.google.com/maps/search/?api=1&query=Avenida+Carleto+Bemergui+950+Jardim+das+Araras+Itaituba+PA`. Stop the dev server afterward.

- [ ] **Step 4: Commit**

```bash
git add src/components/Location.tsx src/App.tsx
git commit -m "Add Location section"
```

---

### Task 10: FinalCta, Footer, and FloatingWhatsApp

**Files:**
- Create: `src/components/FinalCta.tsx`
- Create: `src/components/Footer.tsx`
- Create: `src/components/FloatingWhatsApp.tsx`
- Modify: `src/App.tsx` (render `<FinalCta />` after `<Location />`, `<Footer />` after `<main>`, `<FloatingWhatsApp />` after `<Footer />`)

**Interfaces:**
- Consumes: `BUSINESS` (Task 2), `ORDER_MESSAGE`/`buildWhatsAppLink` (Task 2), `WhatsAppIcon` (Task 3), the `id="hero"` element produced by Task 4's `Hero`.
- Produces: `FinalCta`, `Footer`, `FloatingWhatsApp` components (no props).

- [ ] **Step 1: Create `src/components/FinalCta.tsx`**

```tsx
import { motion } from "motion/react"
import { WhatsAppIcon } from "./icons"
import { ORDER_MESSAGE } from "../data/site"
import { buildWhatsAppLink } from "../lib/whatsapp"

export function FinalCta() {
  return (
    <section className="bg-navy py-24 text-center text-white">
      <div className="wrap flex flex-col items-center gap-6">
        <h2 className="font-display text-[clamp(2.3rem,6vw,3.6rem)] font-extrabold">Faz seu pedido agora</h2>
        <p className="text-xl text-[#C9CDEA]">Gás e água na porta de casa, em toda Itaituba.</p>
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href={buildWhatsAppLink(ORDER_MESSAGE)}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 rounded-full bg-wa px-8 py-4 font-display text-2xl font-bold text-white"
        >
          <WhatsAppIcon className="h-6 w-6" /> Pedir pelo WhatsApp
        </motion.a>
        <a href="tel:+5593991666437" className="text-xl font-semibold underline underline-offset-4">
          (93) 99166-6437
        </a>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create `src/components/Footer.tsx`**

```tsx
import { BUSINESS } from "../data/site"

export function Footer() {
  return (
    <footer className="bg-navy-deep py-8 text-sm text-white/70">
      <div className="wrap flex flex-wrap items-center justify-between gap-4">
        <div>
          {BUSINESS.legalName}
          <br />
          CNPJ {BUSINESS.cnpj} · Revenda autorizada ANP nº {BUSINESS.anp}
        </div>
        <a href={BUSINESS.instagram} target="_blank" rel="noopener" className="hover:text-white">
          Instagram {BUSINESS.instagramHandle}
        </a>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Create `src/components/FloatingWhatsApp.tsx`**

```tsx
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { WhatsAppIcon } from "./icons"
import { ORDER_MESSAGE } from "../data/site"
import { buildWhatsAppLink } from "../lib/whatsapp"

export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById("hero")
    if (!hero) return
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting))
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          href={buildWhatsAppLink(ORDER_MESSAGE)}
          target="_blank"
          rel="noopener"
          aria-label="Pedir pelo WhatsApp"
          className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-wa text-white shadow-lg"
        >
          <WhatsAppIcon className="h-8 w-8" />
        </motion.a>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 4: Wire all three into `src/App.tsx`** (add imports; `<FinalCta />` is the last child inside `<main>`; `<Footer />` and `<FloatingWhatsApp />` are siblings of `<main>`, after it)

- [ ] **Step 5: Verify**

Run: `npm run typecheck` && `npm run build` — expected: both succeed; grep `dist/index.html` for `Faz seu pedido agora` and `CNPJ`.
Start `npm run dev`, navigate with Playwright:
- At the top of the page, screenshot and confirm the floating WhatsApp button is **not** visible.
- Scroll past the hero section (past `#hero`), screenshot and confirm the floating button **is** visible, bottom-right.
- Scroll back to the top and confirm it disappears again.
- Confirm the final CTA section and footer render with the correct phone link (`tel:+5593991666437`) and Instagram link.
Stop the dev server afterward.

- [ ] **Step 6: Commit**

```bash
git add src/components/FinalCta.tsx src/components/Footer.tsx src/components/FloatingWhatsApp.tsx src/App.tsx
git commit -m "Add FinalCta, Footer, and FloatingWhatsApp"
```

---

### Task 11: Final composition and SEO check

**Files:**
- Modify: `src/App.tsx` (final, clean composition — remove any leftover debug code)

**Interfaces:**
- Consumes: every component from Tasks 3–10.
- Produces: the final `App` component tree, matching section order of the original `index.html`.

- [ ] **Step 1: Replace `src/App.tsx` with the final composition**

```tsx
import { Header } from "./components/Header"
import { Hero } from "./components/Hero"
import { ScrollStory } from "./components/ScrollStory"
import { Pricing } from "./components/Pricing"
import { HoursAndArea } from "./components/HoursAndArea"
import { SinceBadge } from "./components/SinceBadge"
import { Reviews } from "./components/Reviews"
import { Location } from "./components/Location"
import { FinalCta } from "./components/FinalCta"
import { Footer } from "./components/Footer"
import { FloatingWhatsApp } from "./components/FloatingWhatsApp"

export default function App() {
  return (
    <>
      <Header />
      <main id="inicio">
        <Hero />
        <ScrollStory />
        <Pricing />
        <HoursAndArea />
        <SinceBadge />
        <Reviews />
        <Location />
        <FinalCta />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
```

(`id="inicio"` on `<main>` is restored here to match the header brand link's `href="#inicio"` from Task 3.)

- [ ] **Step 2: Verify the production build's SEO content**

Run: `npm run typecheck` && `npm run build` — expected: both succeed.
Inspect `dist/index.html` directly (read the file) and confirm all of the following are present in the static HTML (i.e., visible without executing JavaScript):
- `<title>Carlão Gás e Água | Entrega de gás e água em Itaituba - PA</title>`
- The `<meta name="description" ...>` tag with the original description text.
- The full `application/ld+json` `Store` schema block, unchanged.
- Rendered section content: `Acabou o gás?`, `Pedir é simples`, `Nossos preços`, `Toda Itaituba`, `Mais de dez anos na mesma esquina`, `Quem pede, volta`, `Avenida Carleto Bemergui, 950`, `Faz seu pedido agora`, `Carlão Gás e Água Distribuidora`.
- Only one `<div id="root">` and no leftover duplicate/debug markup.

- [ ] **Step 3: Full-page visual check**

Start `npm run dev`, navigate with Playwright, and take full-page screenshots at desktop (1440px) and mobile (390px) widths, scrolling through the entire page. Confirm section order matches: Header → Hero → ScrollStory → Pricing → HoursAndArea/SinceBadge → Reviews → Location → FinalCta → Footer, with no visual gaps, overlaps, or console errors (check `browser_console_messages`). Stop the dev server afterward.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "Finalize App composition and verify SEO output"
```

---

### Task 12: Cross-cutting QA pass and cleanup

**Files:**
- No new files expected. Fix whatever Step 1–4 below turn up (in the relevant component file).

**Interfaces:**
- Consumes: the complete app from Task 11.
- Produces: nothing new — this task is verification-only, plus any small fixes it surfaces.

- [ ] **Step 1: `prefers-reduced-motion` audit**

Start `npm run dev`, use Playwright's media emulation to set `prefers-reduced-motion: reduce`, reload, and walk through the whole page confirming: the Hero flame is static and doesn't tilt on mouse move, `ScrollStory` doesn't require 320vh of scroll and shows the jug already full, and no section's entrance animation blocks its content from being immediately visible (everything should render at its final, visible state without needing a scroll/hover trigger). Fix any component that still animates under reduced motion.

- [ ] **Step 2: WhatsApp link audit**

With reduced motion off again, use Playwright to read the `href` attribute of every element that should link to WhatsApp (header "Pedir" button, hero CTA, all five pricing "pedir este"/"perguntar" links, final CTA button, floating button) and confirm each one is `https://wa.me/5593991666437?text=<the exact message from src/data/site.ts, URL-encoded>`, with no leftover `href="#"` placeholders.

- [ ] **Step 3: Responsive and console-error audit**

At three widths (390px, 820px, 1440px), screenshot the full page and confirm no horizontal scrollbar appears and no text overlaps. Check `browser_console_messages` across the whole session for any errors or warnings (React key warnings, hydration mismatch warnings, 404s for `/logo.png` or fonts) and fix any that appear.

- [ ] **Step 4: Business-status correctness spot check**

Read the current time and compare against `src/data/site.ts`'s `OPENING_HOURS` for today's weekday (remember `OPENING_HOURS` is keyed by `Date#getDay()`, where `0` = Sunday). Confirm the status pill in the running dev server matches what `useBusinessStatus` should compute for the current moment in the `America/Santarem` timezone.

- [ ] **Step 5: Final commit**

If Steps 1–4 required any fixes, stage and commit them with a message describing what was fixed, e.g.:

```bash
git add -A
git commit -m "Fix QA findings from full audit pass"
```

If no fixes were needed, no commit is required for this task — the QA pass itself is the deliverable.

---

## Self-Review Notes

- **Spec coverage:** Architecture (Task 1), component structure (Tasks 3–11 mirror the file tree in the spec), data layer (Task 2), animation strategy — scroll storytelling (Task 5), micro-interactions (Tasks 3, 6, 8), depth/3D (Task 4) — SEO/pre-rendering (Tasks 1, 11), content fidelity including the reviews placeholder caveat (Task 2), verification approach (every task's Step "Verify", consolidated audit in Task 12), migration (git history preserved from Task 1 forward, no new task needed).
- **Type consistency checked:** `BusinessStatus`, `Weekday`, `HoursRow`, `GasProduct`, `GasAccessory`, `Step`, `Review` are defined once in `src/data/site.ts` / `src/hooks/useBusinessStatus.ts` and referenced with the same names and shapes in every consuming task. `buildWhatsAppLink(message: string): string` signature is consistent everywhere it's called.
- **No placeholders:** every step contains complete, working code; the only intentionally temporary code is the Task 1/2/3 placeholder `App.tsx`, which is explicitly superseded by Task 11's final version.
