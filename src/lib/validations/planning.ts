/**
 * Planning tool validation schemas
 * Tasks, budget items, guests
 */

import { z } from 'zod'
import {
  requiredString,
  dateSchema,
  euroAmountSchema,
  emailSchema,
  germanPhoneSchema,
  uuidSchema,
} from './common'

// ========== TASK CATEGORIES ==========
const taskCategories = [
  'venue',
  'catering',
  'photography',
  'music',
  'flowers',
  'attire',
  'invitations',
  'other',
] as const

const taskPriorities = ['low', 'medium', 'high'] as const

/**
 * Create task schema
 */
export const createTaskSchema = z.object({
  title: requiredString('Task title').max(200, 'Title is too long'),
  description: z.string().max(2000, 'Description is too long').optional(),
  due_date: dateSchema.optional(),
  category: z
    .enum(taskCategories, { error: 'Please select a category' })
    .optional(),
  priority: z
    .enum(taskPriorities, { error: 'Invalid priority' })
    .default('medium'),
  assigned_to: uuidSchema.optional(),
  vendor_id: uuidSchema.optional(),
})

/**
 * Update task schema
 */
export const updateTaskSchema = createTaskSchema.partial().extend({
  completed: z.boolean().optional(),
  completed_at: z.string().datetime().optional(),
})

// ========== BUDGET CATEGORIES ==========
const budgetCategories = [
  'venue',
  'catering',
  'photography',
  'videography',
  'music',
  'flowers',
  'decor',
  'attire',
  'beauty',
  'stationery',
  'transportation',
  'gifts',
  'honeymoon',
  'other',
] as const

/**
 * Create budget item schema
 */
export const createBudgetItemSchema = z.object({
  category: z.enum(budgetCategories, { error: 'Please select a category' }),
  name: requiredString('Item name').max(100, 'Name is too long'),
  estimated_cost: euroAmountSchema,
  actual_cost: euroAmountSchema.optional(),
  vendor_id: uuidSchema.optional(),
  notes: z.string().max(500, 'Notes are too long').optional(),
  is_paid: z.boolean().default(false),
  payment_due_date: dateSchema.optional(),
})

/**
 * Update budget item schema
 */
export const updateBudgetItemSchema = createBudgetItemSchema.partial()

// ========== GUEST TYPES ==========
const guestTypes = [
  'bride_family',
  'groom_family',
  'bride_friend',
  'groom_friend',
  'mutual',
  'colleague',
  'other',
] as const

const rsvpStatuses = ['pending', 'attending', 'declined', 'maybe'] as const

/**
 * Create guest schema
 */
export const createGuestSchema = z.object({
  first_name: requiredString('First name').max(50, 'Name is too long'),
  last_name: requiredString('Last name').max(50, 'Name is too long'),
  email: emailSchema.optional(),
  phone: germanPhoneSchema,

  // Group
  party_id: uuidSchema.optional(),
  is_primary_contact: z.boolean().default(true),

  // RSVP
  rsvp_status: z
    .enum(rsvpStatuses, { error: 'Invalid RSVP status' })
    .default('pending'),
  plus_one_allowed: z.boolean().default(false),
  plus_one_name: z.string().max(100, 'Name is too long').optional(),

  // Meal/seating
  dietary_restrictions: z.array(z.string()).optional(),
  table_id: uuidSchema.optional(),
  seat_number: z.number().int().min(1).optional(),

  // Categories
  guest_type: z
    .enum(guestTypes, { error: 'Please select guest type' })
    .optional(),

  notes: z.string().max(500, 'Notes are too long').optional(),
})

/**
 * Update guest schema
 */
export const updateGuestSchema = createGuestSchema.partial()

/**
 * Bulk import guests (CSV)
 */
export const bulkGuestImportSchema = z.object({
  guests: z
    .array(createGuestSchema)
    .min(1, 'At least one guest required')
    .max(500, 'Maximum 500 guests per import'),
})

// Type exports
export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type TaskCategory = (typeof taskCategories)[number]
export type TaskPriority = (typeof taskPriorities)[number]

export type CreateBudgetItemInput = z.infer<typeof createBudgetItemSchema>
export type UpdateBudgetItemInput = z.infer<typeof updateBudgetItemSchema>
export type BudgetCategory = (typeof budgetCategories)[number]

export type CreateGuestInput = z.infer<typeof createGuestSchema>
export type UpdateGuestInput = z.infer<typeof updateGuestSchema>
export type BulkGuestImportInput = z.infer<typeof bulkGuestImportSchema>
export type GuestType = (typeof guestTypes)[number]
export type RsvpStatus = (typeof rsvpStatuses)[number]
