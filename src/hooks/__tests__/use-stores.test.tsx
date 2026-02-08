import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useUIStore } from '@/stores/ui-store'

describe('useUIStore (as React hook)', () => {
  it('toggles sidebar', () => {
    const { result } = renderHook(() => useUIStore())
    expect(result.current.sidebarOpen).toBe(false)

    act(() => result.current.toggleSidebar())
    expect(result.current.sidebarOpen).toBe(true)

    act(() => result.current.toggleSidebar())
    expect(result.current.sidebarOpen).toBe(false)
  })

  it('toggles mobile menu', () => {
    const { result } = renderHook(() => useUIStore())
    expect(result.current.mobileMenuOpen).toBe(false)

    act(() => result.current.toggleMobileMenu())
    expect(result.current.mobileMenuOpen).toBe(true)
  })

  it('opens and closes modal', () => {
    const { result } = renderHook(() => useUIStore())

    act(() => result.current.openModal('confirm-delete', { id: '123' }))
    expect(result.current.activeModal).toBe('confirm-delete')
    expect(result.current.modalData).toEqual({ id: '123' })

    act(() => result.current.closeModal())
    expect(result.current.activeModal).toBeNull()
    expect(result.current.modalData).toBeNull()
  })

  it('sets global loading', () => {
    const { result } = renderHook(() => useUIStore())

    act(() => result.current.setGlobalLoading(true, 'Loading...'))
    expect(result.current.globalLoading).toBe(true)
    expect(result.current.loadingMessage).toBe('Loading...')

    act(() => result.current.setGlobalLoading(false))
    expect(result.current.globalLoading).toBe(false)
    expect(result.current.loadingMessage).toBeNull()
  })
})
