/**
 * Admin Service
 * Platform administration: stats, user management, activity feed
 */

import { supabase } from './supabase'
import { handleSupabaseError } from '@/lib/errors'
import type { ProfileRole } from './profiles'

export interface PlatformStats {
  users: number
  artists: number
  venues: number
  bookings: number
  enquiries: number
  messages: number
}

export interface AdminUser {
  id: string
  email: string
  display_name: string | null
  first_name: string
  last_name: string
  role: ProfileRole
  created_at: string
}

export interface AdminActivity {
  id: string
  type: 'booking' | 'enquiry' | 'message'
  description: string
  created_at: string
}

export interface AdminUsersResult {
  users: AdminUser[]
  total: number
}

export class AdminService {
  static async getStats(): Promise<PlatformStats> {
    const tables = ['profiles', 'artists', 'venues', 'booking_requests', 'enquiries', 'messages'] as const
    const counts = await Promise.all(
      tables.map(async (table) => {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
        if (error) handleSupabaseError(error)
        return count ?? 0
      })
    )

    return {
      users: counts[0],
      artists: counts[1],
      venues: counts[2],
      bookings: counts[3],
      enquiries: counts[4],
      messages: counts[5],
    }
  }

  static async getUsers(page = 1, limit = 20, search?: string): Promise<AdminUsersResult> {
    let query = supabase
      .from('profiles')
      .select('id, email, display_name, first_name, last_name, role, created_at', { count: 'exact' })

    if (search) {
      query = query.or(`display_name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) handleSupabaseError(error)

    return {
      users: (data ?? []) as AdminUser[],
      total: count ?? 0,
    }
  }

  static async updateUserRole(userId: string, role: ProfileRole): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)

    if (error) handleSupabaseError(error)
  }

  static async getRecentActivity(limit = 10): Promise<AdminActivity[]> {
    const { data, error } = await supabase
      .from('booking_requests')
      .select('id, created_at')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) handleSupabaseError(error)

    return (data ?? []).map((b) => ({
      id: b.id,
      type: 'booking' as const,
      description: `Booking ${b.id.slice(0, 8)} created`,
      created_at: b.created_at,
    }))
  }

  static async getFlaggedContent(): Promise<{ count: number }> {
    return { count: 0 }
  }
}
