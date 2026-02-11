/**
 * Centralized animation configuration for consistent timing, easing, and variants
 */

export const ANIMATION_CONFIG = {
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.6,
    verySlow: 0.8,
  },
  easing: {
    default: [0.25, 0.1, 0.25, 1] as const,
    easeIn: [0.4, 0, 1, 1] as const,
    easeOut: [0, 0, 0.2, 1] as const,
    easeInOut: [0.4, 0, 0.2, 1] as const,
    spring: {
      type: 'spring' as const,
      damping: 20,
      stiffness: 100,
    },
    springStiff: {
      type: 'spring' as const,
      damping: 20,
      stiffness: 300,
    },
  },
  variants: {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.6 },
      },
    },
    fadeInUp: {
      hidden: { opacity: 0, y: 40 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
      },
    },
    fadeInDown: {
      hidden: { opacity: 0, y: -40 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
      },
    },
    fadeInLeft: {
      hidden: { opacity: 0, x: -40 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
      },
    },
    fadeInRight: {
      hidden: { opacity: 0, x: 40 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
      },
    },
    slideUp: {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
      },
    },
    scale: {
      hidden: { scale: 0.8, opacity: 0 },
      visible: {
        scale: 1,
        opacity: 1,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
      },
    },
    stagger: {
      container: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
          },
        },
      },
      item: {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4 },
        },
      },
    },
  },
} as const

/**
 * Get animation variant based on direction
 */
export const getDirectionalVariant = (
  direction: 'up' | 'down' | 'left' | 'right' = 'up'
) => {
  const variants = {
    up: ANIMATION_CONFIG.variants.fadeInUp,
    down: ANIMATION_CONFIG.variants.fadeInDown,
    left: ANIMATION_CONFIG.variants.fadeInLeft,
    right: ANIMATION_CONFIG.variants.fadeInRight,
  }
  return variants[direction]
}

/**
 * Create custom stagger animation with delay
 */
export const createStaggerVariant = (staggerDelay = 0.1, delayChildren = 0) => ({
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  },
})
