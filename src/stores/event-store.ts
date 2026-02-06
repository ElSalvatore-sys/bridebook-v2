/**
 * Event Store
 * Active event/booking context with localStorage persistence
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

/**
 * Event data structure (denormalized for quick access)
 */
export interface Event {
  id: string
  event_name: string
  organizer_name: string
  event_date: string | null
  venue_id: string | null
  venue_name: string | null
  budget_total: number | null
  guest_count_estimate: number | null
  created_at: string
}

interface EventState {
  // Active event context
  activeEventId: string | null
  activeEvent: Event | null

  // Quick access (denormalized)
  organizerName: string | null
  eventDate: string | null
  venueName: string | null

  // Loading states
  isLoading: boolean
  error: string | null
}

interface EventActions {
  // Set active event
  setActiveEvent: (event: Event | null) => void
  setActiveEventId: (id: string | null) => void

  // Clear event context (on logout)
  clearActiveEvent: () => void

  // Update individual fields (optimistic updates)
  updateEventField: <K extends keyof Event>(
    field: K,
    value: Event[K]
  ) => void

  // Loading/error states
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

const initialState: EventState = {
  activeEventId: null,
  activeEvent: null,
  organizerName: null,
  eventDate: null,
  venueName: null,
  isLoading: false,
  error: null,
}

export const useEventStore = create<EventState & EventActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setActiveEvent: (event) =>
          set(
            {
              activeEvent: event,
              activeEventId: event?.id ?? null,
              organizerName: event?.organizer_name ?? null,
              eventDate: event?.event_date ?? null,
              venueName: event?.venue_name ?? null,
              error: null,
            },
            false,
            'setActiveEvent'
          ),

        setActiveEventId: (id) =>
          set({ activeEventId: id }, false, 'setActiveEventId'),

        clearActiveEvent: () => set(initialState, false, 'clearActiveEvent'),

        updateEventField: (field, value) =>
          set(
            (state) => {
              if (!state.activeEvent) return state

              const updated = { ...state.activeEvent, [field]: value }
              return {
                activeEvent: updated,
                // Update denormalized fields if relevant
                organizerName:
                  field === 'organizer_name'
                    ? (value as string | null)
                    : state.organizerName,
                eventDate:
                  field === 'event_date'
                    ? (value as string | null)
                    : state.eventDate,
                venueName:
                  field === 'venue_name'
                    ? (value as string | null)
                    : state.venueName,
              }
            },
            false,
            'updateEventField'
          ),

        setLoading: (loading) => set({ isLoading: loading }, false, 'setLoading'),

        setError: (error) => set({ error }, false, 'setError'),
      }),
      {
        name: 'bloghead-active-event',
        // Only persist the IDs, not the full event data
        // Full data should be fetched fresh on app load
        partialize: (state) => ({
          activeEventId: state.activeEventId,
        }),
      }
    ),
    { name: 'event-store', enabled: import.meta.env.DEV }
  )
)
