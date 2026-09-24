import { useRef, useState } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useAnimationFrame,
  useReducedMotion,
  useInView,
} from "motion/react"
import { STEPS } from "../data/site"

const EMPTY_Y = 310
const FULL_Y = 30

export function ScrollStory() {
  const containerRef = useRef<HTMLElement>(null)
  const wavePathRef = useRef<SVGPathElement>(null)
  const reducedMotion = useReducedMotion()
  // The wave only needs to move while the section is (nearly) on screen.
  const inView = useInView(containerRef, { margin: "200px 0px" })
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] })
  const waterY = useTransform(scrollYProgress, [0, 1], [EMPTY_Y, FULL_Y])
  const [liters, setLiters] = useState(0)
  const [activeStep, setActiveStep] = useState(0)

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setLiters(Math.round(latest * 20))
    setActiveStep(latest < 0.34 ? 0 : latest < 0.67 ? 1 : 2)
  })

  useAnimationFrame((t) => {
    if (reducedMotion || !inView || !wavePathRef.current) return
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
      aria-labelledby="como-pedir-titulo"
      ref={containerRef}
      className="relative bg-paper"
      style={{ height: reducedMotion ? "auto" : "320vh" }}
    >
      <div
        className="flex items-center overflow-hidden py-6 md:py-16"
        style={
          reducedMotion
            ? undefined
            : // svh: the small viewport, so mobile browser chrome never covers the steps
              { position: "sticky", top: 72, height: "calc(100svh - 72px)" }
        }
      >
        <div className="wrap grid items-center gap-6 md:grid-cols-[0.9fr_1.1fr] md:gap-12">
          <div className="flex flex-col items-center">
            {/* Sized by height so jug + all three steps fit the sticky viewport on phones. */}
            <svg
              viewBox="0 0 220 320"
              className="h-[clamp(7.5rem,calc(100svh_-_72px_-_30rem),29rem)] w-auto max-w-full md:h-[min(29rem,calc(100svh_-_72px_-_10rem))]"
              aria-hidden="true"
            >
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
            <div className="mt-3 font-display text-xl font-extrabold tabular-nums text-water-deep md:mt-4 md:text-2xl">
              {displayLiters} de 20 litros
            </div>
          </div>

          <div>
            <h2
              id="como-pedir-titulo"
              className="mb-4 font-display text-[clamp(2.3rem,6vw,3.6rem)] font-extrabold text-navy md:mb-8"
            >
              Pedir é simples
            </h2>
            <ol className="grid gap-4 md:gap-6">
              {STEPS.map((step, i) => {
                const active = i <= displayStep
                const isLast = i === STEPS.length - 1
                return (
                  <li
                    key={step.title}
                    className="relative grid grid-cols-[2.5rem_1fr] items-start gap-4 md:grid-cols-[3.2rem_1fr]"
                  >
                    {!isLast && (
                      // Connector to the next step; fills with water as the story advances.
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-4 left-[calc(1.25rem-1.5px)] top-10 w-[3px] overflow-hidden rounded-full bg-line md:-bottom-6 md:left-[calc(1.6rem-1.5px)] md:top-[3.2rem]"
                      >
                        <span
                          className={`block h-full origin-top bg-water-deep transition-transform duration-500 ease-out ${
                            i < displayStep ? "scale-y-100" : "scale-y-0"
                          }`}
                        />
                      </span>
                    )}
                    <span
                      className={`relative grid size-10 place-items-center rounded-full font-display text-xl font-extrabold transition-colors duration-300 md:size-[3.2rem] md:text-2xl ${
                        active ? "bg-navy text-white" : "bg-white text-muted shadow-[inset_0_0_0_2px_var(--color-line)]"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h3
                        className={`font-display text-2xl font-extrabold transition-colors duration-300 md:text-3xl ${
                          active ? "text-navy" : "text-muted/75"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="mt-1 max-w-[38ch] text-[0.95rem] leading-snug text-muted md:text-base md:leading-normal">
                        {step.description}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
