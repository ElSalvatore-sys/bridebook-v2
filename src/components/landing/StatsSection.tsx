import { useEffect, useState, useRef } from 'react'
import { FadeInView } from '@/components/animations/FadeInView'
import { motion, useInView } from 'framer-motion'

const stats = [
  { label: 'Active Venues', value: 2500, suffix: '+' },
  { label: 'Artists & DJs', value: 5000, suffix: '+' },
  { label: 'Bookings Made', value: 50000, suffix: '+' },
  { label: 'Cities Worldwide', value: 150, suffix: '+' },
]

interface AnimatedCounterProps {
  value: number
  suffix: string
}

const AnimatedCounter = ({ value, suffix }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const duration = 2000
    const increment = value / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [isInView, value])

  return (
    <div ref={ref}>
      <motion.span
        className="font-display text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#610AD1] to-[#FB7A43] bg-clip-text text-transparent"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      >
        {count.toLocaleString()}
        {suffix}
      </motion.span>
    </div>
  )
}

/**
 * Stats section with animated counters
 * Counters animate from 0 to target value when scrolled into view
 */
export default function StatsSection() {
  return (
    <div className="max-w-7xl mx-auto">
      <FadeInView>
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl md:text-6xl text-white mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-white/70 font-sans">
            Join the fastest-growing nightlife community
          </p>
        </div>
      </FadeInView>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <FadeInView key={index} delay={index * 0.1}>
            <div className="text-center">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="text-lg text-white/70 mt-2 font-sans">
                {stat.label}
              </p>
            </div>
          </FadeInView>
        ))}
      </div>
    </div>
  )
}
