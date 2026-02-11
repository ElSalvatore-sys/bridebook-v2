import { useState, useEffect, RefObject } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  root?: Element | null
  rootMargin?: string
  triggerOnce?: boolean
}

/**
 * Hook to detect when element enters viewport
 * Useful for scroll-triggered animations with better performance than scroll events
 */
export const useIntersectionObserver = (
  ref: RefObject<Element | null>,
  options: UseIntersectionObserverOptions = {}
): boolean => {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    triggerOnce = false,
  } = options

  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting

        setIsIntersecting(isElementIntersecting)

        // If triggerOnce is true, disconnect after first intersection
        if (isElementIntersecting && triggerOnce && element) {
          observer.unobserve(element)
        }
      },
      {
        threshold,
        root,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [ref, threshold, root, rootMargin, triggerOnce])

  return isIntersecting
}
