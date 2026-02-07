import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '../use-debounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300))
    expect(result.current).toBe('hello')
  })

  it('updates value after the specified delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'hello', delay: 300 } }
    )

    // Change value
    rerender({ value: 'world', delay: 300 })
    expect(result.current).toBe('hello') // Not yet updated

    // Advance past delay
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('world')
  })

  it('only emits the final value for rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    )

    rerender({ value: 'ab' })
    act(() => {
      vi.advanceTimersByTime(100)
    })

    rerender({ value: 'abc' })
    act(() => {
      vi.advanceTimersByTime(100)
    })

    rerender({ value: 'abcd' })
    expect(result.current).toBe('a') // Still initial

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('abcd') // Final value
  })

  it('uses default delay of 300ms', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'initial' } }
    )

    rerender({ value: 'updated' })

    act(() => {
      vi.advanceTimersByTime(299)
    })
    expect(result.current).toBe('initial')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('updated')
  })
})
