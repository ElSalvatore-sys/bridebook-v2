/**
 * useZodForm Hook Tests
 * Tests for the Zod + React Hook Form integration wrapper
 */

import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { z } from 'zod'
import { useZodForm } from '../use-zod-form'

// ========== BASIC FORM CREATION ==========

describe('useZodForm', () => {
  it('returns a form object with register, handleSubmit, formState', () => {
    const schema = z.object({ name: z.string().min(1) })

    const { result } = renderHook(() =>
      useZodForm(schema, { defaultValues: { name: '' } })
    )

    expect(result.current.register).toBeDefined()
    expect(typeof result.current.register).toBe('function')
    expect(result.current.handleSubmit).toBeDefined()
    expect(typeof result.current.handleSubmit).toBe('function')
    expect(result.current.formState).toBeDefined()
    expect(result.current.formState.errors).toBeDefined()
  })

  it('accepts default values', () => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    })

    const { result } = renderHook(() =>
      useZodForm(schema, {
        defaultValues: { email: 'test@example.com', password: '' },
      })
    )

    expect(result.current.getValues('email')).toBe('test@example.com')
    expect(result.current.getValues('password')).toBe('')
  })

  it('uses onBlur validation mode by default', () => {
    const schema = z.object({ name: z.string() })

    const { result } = renderHook(() =>
      useZodForm(schema, { defaultValues: { name: '' } })
    )

    // The form should not have errors immediately since mode is onBlur
    expect(result.current.formState.errors).toEqual({})
  })

  it('allows overriding mode via props', () => {
    const schema = z.object({ name: z.string() })

    const { result } = renderHook(() =>
      useZodForm(schema, {
        defaultValues: { name: '' },
        mode: 'onChange',
      })
    )

    // Form should still be functional with onChange mode
    expect(result.current.register).toBeDefined()
  })

  it('rejects invalid data via handleSubmit', async () => {
    const schema = z.object({
      name: z.string().min(1, 'Name is required'),
    })

    const onValid = vi.fn()
    const onInvalid = vi.fn()

    const { result } = renderHook(() =>
      useZodForm(schema, { defaultValues: { name: '' } })
    )

    await act(async () => {
      await result.current.handleSubmit(onValid, onInvalid)()
    })

    expect(onValid).not.toHaveBeenCalled()
    expect(onInvalid).toHaveBeenCalledTimes(1)

    const errors = onInvalid.mock.calls[0][0]
    expect(errors.name?.message).toBe('Name is required')
  })

  it('passes validation when values are valid', async () => {
    const schema = z.object({
      name: z.string().min(1, 'Name is required'),
    })

    const { result } = renderHook(() =>
      useZodForm(schema, { defaultValues: { name: 'Ali' } })
    )

    let isValid: boolean = false
    await act(async () => {
      isValid = await result.current.trigger()
    })

    expect(isValid).toBe(true)
    expect(result.current.formState.errors.name).toBeUndefined()
  })

  it('works with complex schemas', () => {
    const schema = z.object({
      email: z.string().email(),
      age: z.number().min(18).max(120),
      tags: z.array(z.string()).min(1),
    })

    const { result } = renderHook(() =>
      useZodForm(schema, {
        defaultValues: { email: '', age: 25, tags: ['music'] },
      })
    )

    expect(result.current.getValues('age')).toBe(25)
    expect(result.current.getValues('tags')).toEqual(['music'])
  })

  it('works without optional props', () => {
    const schema = z.object({ name: z.string() })

    const { result } = renderHook(() => useZodForm(schema))

    expect(result.current.register).toBeDefined()
    expect(result.current.handleSubmit).toBeDefined()
  })

  it('provides setValue method', () => {
    const schema = z.object({ name: z.string() })

    const { result } = renderHook(() =>
      useZodForm(schema, { defaultValues: { name: '' } })
    )

    act(() => {
      result.current.setValue('name', 'Updated')
    })

    expect(result.current.getValues('name')).toBe('Updated')
  })

  it('provides reset method', () => {
    const schema = z.object({ name: z.string() })

    const { result } = renderHook(() =>
      useZodForm(schema, { defaultValues: { name: 'initial' } })
    )

    act(() => {
      result.current.setValue('name', 'changed')
    })
    expect(result.current.getValues('name')).toBe('changed')

    act(() => {
      result.current.reset()
    })
    expect(result.current.getValues('name')).toBe('initial')
  })
})
