/**
 * Planning Store Tests
 * Tests for expandSection, collapseSection, collapseAllSections,
 * guest selection methods, and setGuestSort to improve coverage
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import { usePlanningStore } from '@/stores'

beforeEach(() => {
  act(() => usePlanningStore.getState().resetPlanningState())
})

// ========== EXPAND SECTION ==========

describe('expandSection', () => {
  it('adds section to expandedSections when not already expanded', () => {
    act(() => usePlanningStore.getState().expandSection('section-a'))

    expect(usePlanningStore.getState().expandedSections).toContain('section-a')
  })

  it('does not duplicate section when already expanded', () => {
    act(() => usePlanningStore.getState().expandSection('section-a'))
    act(() => usePlanningStore.getState().expandSection('section-a'))

    const sections = usePlanningStore.getState().expandedSections
    const count = sections.filter((id) => id === 'section-a').length
    expect(count).toBe(1)
  })

  it('preserves other expanded sections', () => {
    act(() => usePlanningStore.getState().expandSection('section-a'))
    act(() => usePlanningStore.getState().expandSection('section-b'))

    const sections = usePlanningStore.getState().expandedSections
    expect(sections).toContain('section-a')
    expect(sections).toContain('section-b')
    expect(sections).toHaveLength(2)
  })

  it('returns the same array reference when section is already expanded', () => {
    act(() => usePlanningStore.getState().expandSection('section-a'))
    const before = usePlanningStore.getState().expandedSections

    act(() => usePlanningStore.getState().expandSection('section-a'))
    const after = usePlanningStore.getState().expandedSections

    // When already expanded, the state updater returns the same array
    expect(after).toEqual(before)
  })
})

// ========== COLLAPSE SECTION ==========

describe('collapseSection', () => {
  it('removes section from expandedSections', () => {
    act(() => {
      usePlanningStore.setState({ expandedSections: ['section-a', 'section-b'] })
    })

    act(() => usePlanningStore.getState().collapseSection('section-a'))

    const sections = usePlanningStore.getState().expandedSections
    expect(sections).not.toContain('section-a')
    expect(sections).toContain('section-b')
  })

  it('does nothing when section is not expanded', () => {
    act(() => {
      usePlanningStore.setState({ expandedSections: ['section-a'] })
    })

    act(() => usePlanningStore.getState().collapseSection('section-x'))

    const sections = usePlanningStore.getState().expandedSections
    expect(sections).toEqual(['section-a'])
  })

  it('results in empty array when collapsing the only expanded section', () => {
    act(() => {
      usePlanningStore.setState({ expandedSections: ['section-a'] })
    })

    act(() => usePlanningStore.getState().collapseSection('section-a'))

    expect(usePlanningStore.getState().expandedSections).toEqual([])
  })
})

// ========== COLLAPSE ALL SECTIONS ==========

describe('collapseAllSections', () => {
  it('clears all expanded sections', () => {
    act(() => {
      usePlanningStore.setState({
        expandedSections: ['section-a', 'section-b', 'section-c'],
      })
    })

    act(() => usePlanningStore.getState().collapseAllSections())

    expect(usePlanningStore.getState().expandedSections).toEqual([])
  })

  it('works when already empty', () => {
    act(() => usePlanningStore.getState().collapseAllSections())

    expect(usePlanningStore.getState().expandedSections).toEqual([])
  })
})

// ========== SELECT GUEST ==========

describe('selectGuest', () => {
  it('adds guest to selectedGuestIds', () => {
    act(() => usePlanningStore.getState().selectGuest('guest-1'))

    expect(usePlanningStore.getState().selectedGuestIds).toContain('guest-1')
  })

  it('does not duplicate guest when already selected', () => {
    act(() => usePlanningStore.getState().selectGuest('guest-1'))
    act(() => usePlanningStore.getState().selectGuest('guest-1'))

    const ids = usePlanningStore.getState().selectedGuestIds
    const count = ids.filter((id) => id === 'guest-1').length
    expect(count).toBe(1)
  })

  it('adds multiple different guests', () => {
    act(() => usePlanningStore.getState().selectGuest('guest-1'))
    act(() => usePlanningStore.getState().selectGuest('guest-2'))

    const ids = usePlanningStore.getState().selectedGuestIds
    expect(ids).toContain('guest-1')
    expect(ids).toContain('guest-2')
    expect(ids).toHaveLength(2)
  })
})

// ========== DESELECT GUEST ==========

describe('deselectGuest', () => {
  it('removes guest from selectedGuestIds', () => {
    act(() => {
      usePlanningStore.setState({ selectedGuestIds: ['guest-1', 'guest-2'] })
    })

    act(() => usePlanningStore.getState().deselectGuest('guest-1'))

    const ids = usePlanningStore.getState().selectedGuestIds
    expect(ids).not.toContain('guest-1')
    expect(ids).toContain('guest-2')
  })

  it('does nothing when guest is not selected', () => {
    act(() => {
      usePlanningStore.setState({ selectedGuestIds: ['guest-1'] })
    })

    act(() => usePlanningStore.getState().deselectGuest('guest-x'))

    expect(usePlanningStore.getState().selectedGuestIds).toEqual(['guest-1'])
  })

  it('results in empty array when deselecting the only guest', () => {
    act(() => {
      usePlanningStore.setState({ selectedGuestIds: ['guest-1'] })
    })

    act(() => usePlanningStore.getState().deselectGuest('guest-1'))

    expect(usePlanningStore.getState().selectedGuestIds).toEqual([])
  })
})

// ========== TOGGLE GUEST SELECTION ==========

describe('toggleGuestSelection', () => {
  it('adds guest when not selected', () => {
    act(() => usePlanningStore.getState().toggleGuestSelection('guest-1'))

    expect(usePlanningStore.getState().selectedGuestIds).toContain('guest-1')
  })

  it('removes guest when already selected', () => {
    act(() => {
      usePlanningStore.setState({ selectedGuestIds: ['guest-1', 'guest-2'] })
    })

    act(() => usePlanningStore.getState().toggleGuestSelection('guest-1'))

    const ids = usePlanningStore.getState().selectedGuestIds
    expect(ids).not.toContain('guest-1')
    expect(ids).toContain('guest-2')
  })

  it('toggles back and forth correctly', () => {
    // Select
    act(() => usePlanningStore.getState().toggleGuestSelection('guest-1'))
    expect(usePlanningStore.getState().selectedGuestIds).toContain('guest-1')

    // Deselect
    act(() => usePlanningStore.getState().toggleGuestSelection('guest-1'))
    expect(usePlanningStore.getState().selectedGuestIds).not.toContain('guest-1')

    // Select again
    act(() => usePlanningStore.getState().toggleGuestSelection('guest-1'))
    expect(usePlanningStore.getState().selectedGuestIds).toContain('guest-1')
  })
})

// ========== SELECT ALL GUESTS ==========

describe('selectAllGuests', () => {
  it('sets all guest IDs at once', () => {
    act(() =>
      usePlanningStore.getState().selectAllGuests(['guest-1', 'guest-2', 'guest-3'])
    )

    expect(usePlanningStore.getState().selectedGuestIds).toEqual([
      'guest-1',
      'guest-2',
      'guest-3',
    ])
  })

  it('replaces any existing selection', () => {
    act(() => {
      usePlanningStore.setState({ selectedGuestIds: ['guest-old'] })
    })

    act(() =>
      usePlanningStore.getState().selectAllGuests(['guest-new-1', 'guest-new-2'])
    )

    const ids = usePlanningStore.getState().selectedGuestIds
    expect(ids).not.toContain('guest-old')
    expect(ids).toEqual(['guest-new-1', 'guest-new-2'])
  })

  it('works with empty array', () => {
    act(() => usePlanningStore.getState().selectAllGuests([]))

    expect(usePlanningStore.getState().selectedGuestIds).toEqual([])
  })
})

// ========== CLEAR GUEST SELECTION ==========

describe('clearGuestSelection', () => {
  it('clears all selected guests', () => {
    act(() => {
      usePlanningStore.setState({
        selectedGuestIds: ['guest-1', 'guest-2', 'guest-3'],
      })
    })

    act(() => usePlanningStore.getState().clearGuestSelection())

    expect(usePlanningStore.getState().selectedGuestIds).toEqual([])
  })

  it('works when already empty', () => {
    act(() => usePlanningStore.getState().clearGuestSelection())

    expect(usePlanningStore.getState().selectedGuestIds).toEqual([])
  })
})

// ========== SET GUEST SORT ==========

describe('setGuestSort', () => {
  it('updates guest sort config', () => {
    act(() => usePlanningStore.getState().setGuestSort('first_name', 'asc'))

    expect(usePlanningStore.getState().guestSort).toEqual({
      field: 'first_name',
      direction: 'asc',
    })
  })

  it('can change to descending order', () => {
    act(() => usePlanningStore.getState().setGuestSort('last_name', 'desc'))

    expect(usePlanningStore.getState().guestSort).toEqual({
      field: 'last_name',
      direction: 'desc',
    })
  })

  it('overwrites previous sort config', () => {
    act(() => usePlanningStore.getState().setGuestSort('first_name', 'asc'))
    act(() => usePlanningStore.getState().setGuestSort('email', 'desc'))

    expect(usePlanningStore.getState().guestSort).toEqual({
      field: 'email',
      direction: 'desc',
    })
  })

  it('has correct default sort', () => {
    expect(usePlanningStore.getState().guestSort).toEqual({
      field: 'last_name',
      direction: 'asc',
    })
  })
})
