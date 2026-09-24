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
