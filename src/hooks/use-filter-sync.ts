/**
 * useFilterSync Hook
 * Syncs filter store state with URL search params
 */

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useFilterStore } from '@/stores'

// Debounce delay for URL updates (prevents excessive history entries)
const DEBOUNCE_MS = 300

/**
 * Hook to sync filter store with URL search params
 *
 * Usage:
 * ```tsx
 * function VendorSearchPage() {
 *   useFilterSync() // Call at top of component
 *   const { searchQuery, categories } = useFilterStore()
 *   // ...
 * }
 * ```
 */
export function useFilterSync() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { hydrateFromParams, toSearchParams } = useFilterStore()

  // Track initial mount to avoid double-hydration
  const isInitialMount = useRef(true)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Subscribe to filter changes
  const searchQuery = useFilterStore((s) => s.searchQuery)
  const categories = useFilterStore((s) => s.categories)
  const priceRange = useFilterStore((s) => s.priceRange)
  const location = useFilterStore((s) => s.location)
  const sortBy = useFilterStore((s) => s.sortBy)
  const page = useFilterStore((s) => s.page)
  const viewMode = useFilterStore((s) => s.viewMode)

  // 1. On mount: hydrate store from URL
  useEffect(() => {
    if (isInitialMount.current) {
      hydrateFromParams(searchParams)
      isInitialMount.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 2. On store change: update URL (debounced)
  useEffect(() => {
    if (isInitialMount.current) return

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      const newParams = toSearchParams()
      setSearchParams(newParams, { replace: true })
    }, DEBOUNCE_MS)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [
    searchQuery,
    categories,
    priceRange,
    location,
    sortBy,
    page,
    viewMode,
    toSearchParams,
    setSearchParams,
  ])

  // 3. On browser back/forward: sync URL to store
  useEffect(() => {
    const handlePopState = () => {
      hydrateFromParams(new URLSearchParams(window.location.search))
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [hydrateFromParams])
}
