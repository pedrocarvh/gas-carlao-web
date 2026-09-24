import { PinIcon } from "./icons"
import { HOURS_TABLE } from "../data/site"
import { useBusinessStatus } from "../hooks/useBusinessStatus"

export function HoursAndArea() {
  const status = useBusinessStatus()

  return (
    <section id="horarios" className="pb-20 md:pb-24">
      <div className="wrap">
        {/* One composed panel (hours | delivery area) instead of two look-alike cards. */}
        <div className="grid overflow-hidden rounded-2xl border border-line bg-white md:grid-cols-2">
          <div className="p-6 sm:p-8">
            <h2 className="mb-5 font-display text-3xl font-extrabold text-navy">Horário de atendimento</h2>
            <table className="w-full border-collapse text-lg">
              <tbody>
                {HOURS_TABLE.map((row) => {
                  const isToday = status != null && row.days.includes(status.day)
                  return (
                    <tr
                      key={row.label}
                      aria-current={isToday ? "date" : undefined}
                      className={isToday ? "text-navy" : "text-ink"}
                    >
                      <th
                        scope="row"
                        className={`border-t border-line py-2.5 text-left ${isToday ? "font-bold" : "font-normal"}`}
                      >
                        <span className="inline-flex items-center gap-2">
                          {row.label}
                          {isToday && (
                            <span className="rounded-full bg-flame-hot px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-navy-deep">
                              Hoje
                            </span>
                          )}
                        </span>
                      </th>
                      <td
                        className={`border-t border-line py-2.5 text-right tabular-nums ${isToday ? "font-bold" : ""}`}
                      >
                        {row.opens}h às {row.closes}h
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="border-t border-line p-6 sm:p-8 md:border-l md:border-t-0">
            <h2 className="font-display text-3xl font-extrabold text-navy">Onde entregamos</h2>
            <p className="mt-2 font-display text-[clamp(2.6rem,6vw,3.4rem)] font-extrabold leading-none text-navy">
              Toda Itaituba
            </p>
            <p className="mt-3 max-w-[46ch] text-muted">
              Do Jardim das Araras a qualquer outro bairro da cidade. Não sabe se chega no seu endereço? Pergunta no WhatsApp.
            </p>
            <div className="mt-6 flex items-start gap-3 border-t border-dashed border-line pt-5">
              <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-flame-deep" />
              <div>
                <b className="block text-navy">Em breve: unidade no Pérola</b>
                <span className="text-sm text-muted">Uma nova loja para atender você ainda mais rápido.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
