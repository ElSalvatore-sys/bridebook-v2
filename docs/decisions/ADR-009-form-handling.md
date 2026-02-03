# ADR-009: Form Handling

## Status
Accepted

## Context
EA Platform has numerous forms: profile creation, booking requests, availability settings, search filters, and more. We need a form handling strategy that provides:
- Type-safe validation
- Good developer experience
- Performance (minimal re-renders)
- Accessibility
- Consistent error handling

## Decision
We will use **React Hook Form** for form state management and **Zod** for schema validation.

## Rationale

### Why React Hook Form?

1. **Performance**: Uses uncontrolled inputs by default, minimizing re-renders.

2. **TypeScript Integration**: Excellent generic types, especially with Zod resolver.

3. **Minimal Boilerplate**: Simple API for registration and submission.

4. **Form State Access**: Easy access to `isDirty`, `isValid`, `isSubmitting` states.

5. **DevTools**: Form state debugging tools available.

6. **shadcn/ui Integration**: Official form component uses React Hook Form.

### Why Zod for Validation?

1. **TypeScript Inference**: Schema types are inferred automatically.

2. **Runtime Validation**: Validates data at runtime, not just compile-time.

3. **Composable Schemas**: Easy to compose, extend, and reuse schemas.

4. **Error Messages**: Customizable, localizable error messages.

5. **Parse, Don't Validate**: Transforms data while validating (e.g., string to date).

### Type-Safe Flow
```
Zod Schema → TypeScript Type → React Hook Form → Validated Data
     ↓              ↓                  ↓               ↓
  z.object()    z.infer<>        useForm<T>()     onSubmit(data)
```

## Consequences

### Positive
- Single source of truth for validation (Zod schema)
- TypeScript types derived from schemas
- Minimal re-renders during form interaction
- Consistent validation patterns across all forms
- Easy integration with shadcn/ui Form component
- Custom error messages for better UX

### Negative
- Learning curve for Zod schema syntax
- Must remember to use `resolver` option
- Some complex validations require custom refinements
- Bundle size increase (though both libraries are small)

### Mitigations
- Create reusable schema partials for common fields
- Document common Zod patterns for team
- Use shadcn/ui Form component for consistency

## Implementation Notes

### Basic Form Pattern
```typescript
// src/schemas/booking.ts
import { z } from 'zod'

export const bookingSchema = z.object({
  venueId: z.string().uuid(),
  date: z.string().pipe(z.coerce.date()),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  notes: z.string().max(500).optional(),
})

export type BookingFormData = z.infer<typeof bookingSchema>
```

### Form Component
```typescript
// src/components/BookingForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { bookingSchema, BookingFormData } from '@/schemas/booking'

export function BookingForm({ onSubmit }: Props) {
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      notes: '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* More fields... */}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}
```

### Reusable Schema Partials
```typescript
// src/schemas/common.ts
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(1, 'Email is required')

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
  .optional()

export const urlSchema = z
  .string()
  .url('Invalid URL')
  .optional()
  .or(z.literal(''))
```

### With shadcn/ui Form
```typescript
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
```

## Validation Patterns

### Async Validation
```typescript
const usernameSchema = z.string().refine(
  async (username) => {
    const exists = await checkUsernameExists(username)
    return !exists
  },
  { message: 'Username already taken' }
)
```

### Cross-Field Validation
```typescript
const timeRangeSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
}).refine(
  (data) => data.startTime < data.endTime,
  { message: 'End time must be after start time', path: ['endTime'] }
)
```

### Conditional Fields
```typescript
const profileSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('artist'),
    stageName: z.string().min(1),
    genres: z.array(z.string()).min(1),
  }),
  z.object({
    type: z.literal('venue'),
    venueName: z.string().min(1),
    capacity: z.number().positive(),
  }),
])
```

## Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **React Hook Form + Zod** | Type-safe, performant | Two libraries | **Selected** |
| **Formik + Yup** | Mature, well-documented | More re-renders, older patterns | Rejected |
| **React Hook Form + Yup** | Familiar Yup syntax | Yup types less inferrable | Rejected |
| **Native React forms** | No dependencies | Lots of boilerplate | Rejected |
| **TanStack Form** | Modern, signals-based | Less mature, smaller ecosystem | Rejected |

## Error Handling Strategy

| Error Type | Handling |
|------------|----------|
| Validation error | Display inline with FormMessage |
| Server error | Toast notification |
| Network error | Toast with retry option |
| Rate limit | Toast with wait message |

## References
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [shadcn/ui Form](https://ui.shadcn.com/docs/components/form)
- [@hookform/resolvers](https://github.com/react-hook-form/resolvers)
