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
