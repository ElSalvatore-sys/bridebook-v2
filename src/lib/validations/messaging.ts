/**
 * Messaging validation schemas
 */

import { z } from 'zod'
import { requiredString } from './common'

export const sendMessageSchema = z.object({
  content: requiredString('Message').max(2000, 'Message is too long'),
})

export type SendMessageInput = z.infer<typeof sendMessageSchema>
