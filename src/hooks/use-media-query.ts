import { useState, useEffect } from 'react'

/**
 * Hook to detect media query matches
 * @param query - CSS media query string (e.g., '(min-width: 768px)')
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    // Set initial value
    setMatches(mediaQuery.matches)

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
    // Fallback for older browsers
    else {
      // @ts-ignore - deprecated but needed for older browsers
      mediaQuery.addListener(handleChange)
      // @ts-ignore
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [query])

  return matches
}
