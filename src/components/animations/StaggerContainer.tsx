import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { createStaggerVariant } from '@/lib/animation-config'

interface StaggerContainerProps {
  children: React.ReactNode
  staggerDelay?: number
  delayChildren?: number
  className?: string
}

/**
 * Container that staggers animation of its children
 * Each child animates in sequence with a delay between them
 */
export const StaggerContainer = ({
  children,
  staggerDelay = 0.1,
  delayChildren = 0,
  className,
}: StaggerContainerProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useIntersectionObserver(ref, {
    threshold: 0.1,
    triggerOnce: true,
  })
  const prefersReducedMotion = useReducedMotion()

  const variants = createStaggerVariant(staggerDelay, delayChildren)

  // If user prefers reduced motion, render without animation
  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants.container}
      className={className}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={variants.item}>{child}</motion.div>
      ))}
    </motion.div>
  )
}
