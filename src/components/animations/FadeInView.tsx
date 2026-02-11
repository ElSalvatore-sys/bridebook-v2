import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { getDirectionalVariant } from '@/lib/animation-config'

interface FadeInViewProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
}

/**
 * Scroll-triggered fade-in animation with directional control
 * Respects prefers-reduced-motion for accessibility
 */
export const FadeInView = ({
  children,
  delay = 0,
  direction = 'up',
  className,
}: FadeInViewProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useIntersectionObserver(ref, {
    threshold: 0.2,
    triggerOnce: true,
  })
  const prefersReducedMotion = useReducedMotion()

  // If user prefers reduced motion, render without animation
  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  const variant = getDirectionalVariant(direction)

  // Add delay to transition if specified
  const visibleVariant = {
    ...variant.visible,
    transition: {
      ...variant.visible.transition,
      delay,
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: variant.hidden,
        visible: visibleVariant,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
