/**
 * Wedding Store
 * Active wedding context with localStorage persistence
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

/**
 * Wedding data structure (denormalized for quick access)
 */
export interface Wedding {
  id: string
  partner1_name: string
  partner2_name: string
  wedding_date: string | null
  venue_id: string | null
  venue_name: string | null
  budget_total: number | null
  guest_count_estimate: number | null
  created_at: string
}

interface WeddingState {
  // Active wedding context
  activeWeddingId: string | null
  activeWedding: Wedding | null

  // Quick access (denormalized)
  partnerNames: [string, string] | null
  weddingDate: string | null
  venueName: string | null

  // Loading states
  isLoading: boolean
  error: string | null
}

interface WeddingActions {
  // Set active wedding
  setActiveWedding: (wedding: Wedding | null) => void
  setActiveWeddingId: (id: string | null) => void

  // Clear wedding context (on logout)
  clearActiveWedding: () => void

  // Update individual fields (optimistic updates)
  updateWeddingField: <K extends keyof Wedding>(
    field: K,
    value: Wedding[K]
  ) => void

  // Loading/error states
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

const initialState: WeddingState = {
  activeWeddingId: null,
  activeWedding: null,
  partnerNames: null,
  weddingDate: null,
  venueName: null,
  isLoading: false,
  error: null,
}

export const useWeddingStore = create<WeddingState & WeddingActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setActiveWedding: (wedding) =>
          set(
            {
              activeWedding: wedding,
              activeWeddingId: wedding?.id ?? null,
              partnerNames: wedding
                ? [wedding.partner1_name, wedding.partner2_name]
                : null,
              weddingDate: wedding?.wedding_date ?? null,
              venueName: wedding?.venue_name ?? null,
              error: null,
            },
            false,
            'setActiveWedding'
          ),

        setActiveWeddingId: (id) =>
          set({ activeWeddingId: id }, false, 'setActiveWeddingId'),

        clearActiveWedding: () => set(initialState, false, 'clearActiveWedding'),

        updateWeddingField: (field, value) =>
          set(
            (state) => {
              if (!state.activeWedding) return state

              const updated = { ...state.activeWedding, [field]: value }
              return {
                activeWedding: updated,
                // Update denormalized fields if relevant
                partnerNames:
                  field === 'partner1_name' || field === 'partner2_name'
                    ? [updated.partner1_name, updated.partner2_name]
                    : state.partnerNames,
                weddingDate:
                  field === 'wedding_date'
                    ? (value as string | null)
                    : state.weddingDate,
                venueName:
                  field === 'venue_name'
                    ? (value as string | null)
                    : state.venueName,
              }
            },
            false,
            'updateWeddingField'
          ),

        setLoading: (loading) => set({ isLoading: loading }, false, 'setLoading'),

        setError: (error) => set({ error }, false, 'setError'),
      }),
      {
        name: 'bloghead-active-wedding',
        // Only persist the IDs, not the full wedding data
        // Full data should be fetched fresh on app load
        partialize: (state) => ({
          activeWeddingId: state.activeWeddingId,
        }),
      }
    ),
    { name: 'wedding-store', enabled: import.meta.env.DEV }
  )
)
