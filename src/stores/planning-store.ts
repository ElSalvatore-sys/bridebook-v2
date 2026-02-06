/**
 * Planning Store
 * Planning tool tab/view states with localStorage persistence
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export type PlanningTab =
  | 'checklist'
  | 'budget'
  | 'guests'
  | 'timeline'
  | 'seating'

export type TaskView = 'list' | 'board' | 'calendar'
export type BudgetView = 'overview' | 'categories' | 'vendors'
export type GuestView = 'list' | 'tables' | 'rsvp'

export type SortDirection = 'asc' | 'desc'

interface SortConfig {
  field: string
  direction: SortDirection
}

interface PlanningState {
  // Active tab in planning tools
  activeTab: PlanningTab

  // View states per tool
  taskView: TaskView
  budgetView: BudgetView
  guestView: GuestView

  // Expanded sections (accordion state)
  expandedSections: string[]

  // Selection state (using arrays for JSON serialization)
  selectedTaskIds: string[]
  selectedGuestIds: string[]

  // Sorting preferences
  taskSort: SortConfig
  guestSort: SortConfig
}

interface PlanningActions {
  // Tab navigation
  setActiveTab: (tab: PlanningTab) => void

  // View mode setters
  setTaskView: (view: TaskView) => void
  setBudgetView: (view: BudgetView) => void
  setGuestView: (view: GuestView) => void

  // Section expansion
  toggleSection: (sectionId: string) => void
  expandSection: (sectionId: string) => void
  collapseSection: (sectionId: string) => void
  collapseAllSections: () => void

  // Task selection
  selectTask: (taskId: string) => void
  deselectTask: (taskId: string) => void
  toggleTaskSelection: (taskId: string) => void
  selectAllTasks: (taskIds: string[]) => void
  clearTaskSelection: () => void

  // Guest selection
  selectGuest: (guestId: string) => void
  deselectGuest: (guestId: string) => void
  toggleGuestSelection: (guestId: string) => void
  selectAllGuests: (guestIds: string[]) => void
  clearGuestSelection: () => void

  // Sorting
  setTaskSort: (field: string, direction: SortDirection) => void
  setGuestSort: (field: string, direction: SortDirection) => void

  // Reset
  resetPlanningState: () => void
}

const initialState: PlanningState = {
  activeTab: 'checklist',
  taskView: 'list',
  budgetView: 'overview',
  guestView: 'list',
  expandedSections: [],
  selectedTaskIds: [],
  selectedGuestIds: [],
  taskSort: { field: 'due_date', direction: 'asc' },
  guestSort: { field: 'last_name', direction: 'asc' },
}

export const usePlanningStore = create<PlanningState & PlanningActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // Tab
        setActiveTab: (tab) => set({ activeTab: tab }, false, 'setActiveTab'),

        // Views
        setTaskView: (view) => set({ taskView: view }, false, 'setTaskView'),
        setBudgetView: (view) => set({ budgetView: view }, false, 'setBudgetView'),
        setGuestView: (view) => set({ guestView: view }, false, 'setGuestView'),

        // Sections
        toggleSection: (sectionId) =>
          set(
            (state) => ({
              expandedSections: state.expandedSections.includes(sectionId)
                ? state.expandedSections.filter((id) => id !== sectionId)
                : [...state.expandedSections, sectionId],
            }),
            false,
            'toggleSection'
          ),
        expandSection: (sectionId) =>
          set(
            (state) => ({
              expandedSections: state.expandedSections.includes(sectionId)
                ? state.expandedSections
                : [...state.expandedSections, sectionId],
            }),
            false,
            'expandSection'
          ),
        collapseSection: (sectionId) =>
          set(
            (state) => ({
              expandedSections: state.expandedSections.filter(
                (id) => id !== sectionId
              ),
            }),
            false,
            'collapseSection'
          ),
        collapseAllSections: () =>
          set({ expandedSections: [] }, false, 'collapseAllSections'),

        // Task selection
        selectTask: (taskId) =>
          set(
            (state) => ({
              selectedTaskIds: state.selectedTaskIds.includes(taskId)
                ? state.selectedTaskIds
                : [...state.selectedTaskIds, taskId],
            }),
            false,
            'selectTask'
          ),
        deselectTask: (taskId) =>
          set(
            (state) => ({
              selectedTaskIds: state.selectedTaskIds.filter((id) => id !== taskId),
            }),
            false,
            'deselectTask'
          ),
        toggleTaskSelection: (taskId) =>
          set(
            (state) => ({
              selectedTaskIds: state.selectedTaskIds.includes(taskId)
                ? state.selectedTaskIds.filter((id) => id !== taskId)
                : [...state.selectedTaskIds, taskId],
            }),
            false,
            'toggleTaskSelection'
          ),
        selectAllTasks: (taskIds) =>
          set({ selectedTaskIds: taskIds }, false, 'selectAllTasks'),
        clearTaskSelection: () =>
          set({ selectedTaskIds: [] }, false, 'clearTaskSelection'),

        // Guest selection
        selectGuest: (guestId) =>
          set(
            (state) => ({
              selectedGuestIds: state.selectedGuestIds.includes(guestId)
                ? state.selectedGuestIds
                : [...state.selectedGuestIds, guestId],
            }),
            false,
            'selectGuest'
          ),
        deselectGuest: (guestId) =>
          set(
            (state) => ({
              selectedGuestIds: state.selectedGuestIds.filter(
                (id) => id !== guestId
              ),
            }),
            false,
            'deselectGuest'
          ),
        toggleGuestSelection: (guestId) =>
          set(
            (state) => ({
              selectedGuestIds: state.selectedGuestIds.includes(guestId)
                ? state.selectedGuestIds.filter((id) => id !== guestId)
                : [...state.selectedGuestIds, guestId],
            }),
            false,
            'toggleGuestSelection'
          ),
        selectAllGuests: (guestIds) =>
          set({ selectedGuestIds: guestIds }, false, 'selectAllGuests'),
        clearGuestSelection: () =>
          set({ selectedGuestIds: [] }, false, 'clearGuestSelection'),

        // Sorting
        setTaskSort: (field, direction) =>
          set({ taskSort: { field, direction } }, false, 'setTaskSort'),
        setGuestSort: (field, direction) =>
          set({ guestSort: { field, direction } }, false, 'setGuestSort'),

        // Reset
        resetPlanningState: () => set(initialState, false, 'resetPlanningState'),
      }),
      {
        name: 'bloghead-planning-prefs',
        // Persist view preferences, not selections
        partialize: (state) => ({
          activeTab: state.activeTab,
          taskView: state.taskView,
          budgetView: state.budgetView,
          guestView: state.guestView,
          taskSort: state.taskSort,
          guestSort: state.guestSort,
        }),
      }
    ),
    { name: 'planning-store', enabled: import.meta.env.DEV }
  )
)
