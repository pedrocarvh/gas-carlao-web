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
