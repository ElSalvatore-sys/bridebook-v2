# API Contracts

> MVP API endpoints specification for EA Platform

---

## Overview

EA Platform uses **Supabase** as the backend, which means most data operations go through the Supabase client directly to PostgreSQL with RLS policies. This document defines the data contracts and API patterns.

### API Approaches

| Approach | Use Case |
|----------|----------|
| **Supabase Client** | CRUD operations, real-time subscriptions |
| **Edge Functions** | Webhooks, complex transactions, third-party integrations |

---

## Authentication

Authentication is handled entirely by **Supabase Auth**. No custom endpoints needed.

### Supabase Auth Methods

| Method | Description |
|--------|-------------|
| `signInWithOAuth({ provider: 'google' })` | Google OAuth sign-in |
| `signInWithPassword({ email, password })` | Email/password sign-in |
| `signUp({ email, password })` | New user registration |
| `signOut()` | Sign out current user |
| `resetPasswordForEmail(email)` | Password reset email |
| `getUser()` | Get current user |
| `getSession()` | Get current session |

### Auth Callback Route

```
GET /auth/callback
```

Handles OAuth redirect from Google. Exchanges code for session.

---

## Profiles API

User profiles for both artists and venues.

### Types

```typescript
type ProfileType = 'artist' | 'venue'

interface Profile {
  id: string                  // UUID, matches auth.uid()
  type: ProfileType
  display_name: string
  bio: string | null
  avatar_url: string | null
  location: string | null
  is_public: boolean
  created_at: string
  updated_at: string
}

interface ArtistProfile extends Profile {
  type: 'artist'
  stage_name: string
  genres: string[]
  hourly_rate: number | null
  portfolio_urls: string[]
}

interface VenueProfile extends Profile {
  type: 'venue'
  venue_name: string
  venue_type: string          // 'bar' | 'club' | 'restaurant' | 'hotel' | 'event_space'
  capacity: number | null
  amenities: string[]
  address: string
}
```

### Endpoints (via Supabase Client)

#### Get Current User Profile
```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single()
```

#### Create Profile
```typescript
const { data, error } = await supabase
  .from('profiles')
  .insert({
    id: userId,
    type: 'artist',
    display_name: 'John Doe',
    // ...
  })
  .select()
  .single()
```

#### Update Profile
```typescript
const { data, error } = await supabase
  .from('profiles')
  .update({ display_name: 'New Name' })
  .eq('id', userId)
  .select()
  .single()
```

---

## Artists API

### Search Artists

```typescript
interface ArtistSearchParams {
  query?: string           // Full-text search
  genres?: string[]        // Filter by genres
  location?: string        // Filter by location
  min_rate?: number        // Minimum hourly rate
  max_rate?: number        // Maximum hourly rate
  page?: number            // Pagination
  limit?: number           // Items per page (default: 20)
}

interface ArtistSearchResponse {
  artists: ArtistProfile[]
  total: number
  page: number
  total_pages: number
}
```

#### Implementation
```typescript
let query = supabase
  .from('profiles')
  .select('*', { count: 'exact' })
  .eq('type', 'artist')
  .eq('is_public', true)

if (params.query) {
  query = query.textSearch('display_name', params.query)
}

if (params.genres?.length) {
  query = query.overlaps('genres', params.genres)
}

if (params.location) {
  query = query.ilike('location', `%${params.location}%`)
}

if (params.min_rate) {
  query = query.gte('hourly_rate', params.min_rate)
}

if (params.max_rate) {
  query = query.lte('hourly_rate', params.max_rate)
}

const { data, count, error } = await query
  .range(offset, offset + limit - 1)
  .order('created_at', { ascending: false })
```

### Get Artist by ID

```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', artistId)
  .eq('type', 'artist')
  .single()
```

---

## Venues API

### Search Venues

```typescript
interface VenueSearchParams {
  query?: string           // Full-text search
  venue_type?: string      // Filter by venue type
  location?: string        // Filter by location
  min_capacity?: number    // Minimum capacity
  amenities?: string[]     // Required amenities
  page?: number
  limit?: number
}

interface VenueSearchResponse {
  venues: VenueProfile[]
  total: number
  page: number
  total_pages: number
}
```

#### Implementation
```typescript
let query = supabase
  .from('profiles')
  .select('*', { count: 'exact' })
  .eq('type', 'venue')
  .eq('is_public', true)

if (params.venue_type) {
  query = query.eq('venue_type', params.venue_type)
}

if (params.min_capacity) {
  query = query.gte('capacity', params.min_capacity)
}

if (params.amenities?.length) {
  query = query.contains('amenities', params.amenities)
}

// ... pagination
```

### Get Venue by ID

```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', venueId)
  .eq('type', 'venue')
  .single()
```

---

## Bookings API

### Types

```typescript
type BookingStatus =
  | 'pending'      // Initial request
  | 'accepted'     // Venue accepted
  | 'declined'     // Venue declined
  | 'cancelled'    // Either party cancelled
  | 'completed'    // Event happened

interface Booking {
  id: string
  artist_id: string
  venue_id: string
  date: string             // ISO date
  start_time: string       // HH:MM
  end_time: string         // HH:MM
  status: BookingStatus
  notes: string | null
  rate_agreed: number | null
  created_at: string
  updated_at: string

  // Joined data
  artist?: ArtistProfile
  venue?: VenueProfile
}
```

### List User Bookings

```typescript
interface BookingListParams {
  status?: BookingStatus
  from_date?: string
  to_date?: string
  page?: number
  limit?: number
}

// As artist
const { data, error } = await supabase
  .from('bookings')
  .select(`
    *,
    venue:profiles!venue_id(*)
  `)
  .eq('artist_id', userId)
  .order('date', { ascending: true })

// As venue
const { data, error } = await supabase
  .from('bookings')
  .select(`
    *,
    artist:profiles!artist_id(*)
  `)
  .eq('venue_id', userId)
  .order('date', { ascending: true })
```

### Create Booking Request

```typescript
interface CreateBookingRequest {
  venue_id: string
  date: string
  start_time: string
  end_time: string
  notes?: string
}

const { data, error } = await supabase
  .from('bookings')
  .insert({
    artist_id: userId,
    venue_id: params.venue_id,
    date: params.date,
    start_time: params.start_time,
    end_time: params.end_time,
    notes: params.notes,
    status: 'pending'
  })
  .select()
  .single()
```

### Update Booking Status

```typescript
// Venue accepts/declines
const { data, error } = await supabase
  .from('bookings')
  .update({
    status: 'accepted',
    rate_agreed: agreedRate
  })
  .eq('id', bookingId)
  .eq('venue_id', userId)  // RLS ensures only venue can update
  .select()
  .single()

// Either party cancels
const { data, error } = await supabase
  .from('bookings')
  .update({ status: 'cancelled' })
  .eq('id', bookingId)
  .or(`artist_id.eq.${userId},venue_id.eq.${userId}`)
  .select()
  .single()
```

---

## Messages API

### Types

```typescript
interface MessageThread {
  id: string
  booking_id: string
  participant_ids: string[]
  last_message_at: string
  created_at: string

  // Joined
  booking?: Booking
  messages?: Message[]
}

interface Message {
  id: string
  thread_id: string
  sender_id: string
  content: string
  read_at: string | null
  created_at: string

  // Joined
  sender?: Profile
}
```

### Get User Threads

```typescript
const { data, error } = await supabase
  .from('message_threads')
  .select(`
    *,
    booking:bookings(*),
    messages(
      *,
      sender:profiles(id, display_name, avatar_url)
    )
  `)
  .contains('participant_ids', [userId])
  .order('last_message_at', { ascending: false })
```

### Get Thread Messages

```typescript
const { data, error } = await supabase
  .from('messages')
  .select(`
    *,
    sender:profiles(id, display_name, avatar_url)
  `)
  .eq('thread_id', threadId)
  .order('created_at', { ascending: true })
  .range(0, 50)
```

### Send Message

```typescript
const { data, error } = await supabase
  .from('messages')
  .insert({
    thread_id: threadId,
    sender_id: userId,
    content: messageContent
  })
  .select()
  .single()

// Also update thread's last_message_at
await supabase
  .from('message_threads')
  .update({ last_message_at: new Date().toISOString() })
  .eq('id', threadId)
```

### Real-time Messages

```typescript
const channel = supabase
  .channel(`thread:${threadId}`)
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `thread_id=eq.${threadId}`
    },
    (payload) => {
      // Handle new message
      console.log('New message:', payload.new)
    }
  )
  .subscribe()
```

---

## Availability API

### Types

```typescript
interface Availability {
  id: string
  profile_id: string
  day_of_week: number      // 0 = Sunday, 6 = Saturday
  start_time: string       // HH:MM
  end_time: string         // HH:MM
  is_available: boolean
}

interface AvailabilityException {
  id: string
  profile_id: string
  date: string             // Specific date
  is_available: boolean
  start_time?: string
  end_time?: string
  reason?: string
}
```

### Get Availability

```typescript
// Weekly schedule
const { data: schedule } = await supabase
  .from('availability')
  .select('*')
  .eq('profile_id', profileId)
  .order('day_of_week')

// Exceptions for date range
const { data: exceptions } = await supabase
  .from('availability_exceptions')
  .select('*')
  .eq('profile_id', profileId)
  .gte('date', startDate)
  .lte('date', endDate)
```

### Update Availability

```typescript
// Upsert weekly schedule
const { data, error } = await supabase
  .from('availability')
  .upsert(
    weeklySlots.map(slot => ({
      profile_id: userId,
      day_of_week: slot.dayOfWeek,
      start_time: slot.startTime,
      end_time: slot.endTime,
      is_available: slot.isAvailable
    })),
    { onConflict: 'profile_id,day_of_week' }
  )
```

---

## Edge Functions

For operations requiring server-side logic:

### POST /functions/v1/send-booking-notification

Sends email notifications for booking status changes.

```typescript
// Request
{
  booking_id: string
  notification_type: 'new_request' | 'accepted' | 'declined' | 'cancelled'
}

// Response
{
  success: boolean
  message_id?: string
}
```

### POST /functions/v1/webhook/stripe (Future)

Handles Stripe webhook events for payments.

---

## Error Handling

### Standard Error Response

```typescript
interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | RLS policy denied access |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `CONFLICT` | 409 | Duplicate or state conflict |
| `RATE_LIMITED` | 429 | Too many requests |

---

## Rate Limits

Supabase default limits (can be increased on Pro plan):

| Operation | Limit |
|-----------|-------|
| API requests | 500/minute |
| Auth requests | 30/minute |
| Storage uploads | 50/minute |
| Real-time connections | 200 concurrent |

---

## References

- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [PostgREST API](https://postgrest.org/en/stable/api.html)
