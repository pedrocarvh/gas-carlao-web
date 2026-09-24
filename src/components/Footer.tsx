import { BUSINESS } from "../data/site"

export function Footer() {
  return (
    <footer className="surface-dark bg-navy-deep pb-[max(2rem,env(safe-area-inset-bottom))] pt-8 text-sm text-white/70">
      <div className="wrap flex flex-wrap items-center justify-between gap-4">
        <div>
          {BUSINESS.legalName}
          <br />
          CNPJ {BUSINESS.cnpj} · Revenda autorizada ANP nº {BUSINESS.anp}
        </div>
        <a
          href={BUSINESS.instagram}
          target="_blank"
          rel="noopener"
          className="-my-2 inline-flex min-h-11 items-center underline-offset-4 transition-colors hover:text-white hover:underline"
        >
          Instagram {BUSINESS.instagramHandle}
        </a>
      </div>
    </footer>
  )
}
