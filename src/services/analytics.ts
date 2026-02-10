import { supabase } from './supabase'

export interface UserStats {
  users: number
  artists: number
  venues: number
}

export interface EnquiryStats {
  pending: number
  read: number
  responded: number
  archived: number
}

export interface ActivityStats {
  messages: number
  favorites: number
}

export interface SignupTrendPoint {
  date: string
  count: number
}

export interface TopEntity {
  id: string
  name: string
  avatar_url: string | null
  favorite_count: number
}

export class AnalyticsService {
  static async getUserStats(): Promise<UserStats> {
    const [usersRes, artistsRes, venuesRes] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'ARTIST'),
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'VENUE'),
    ])

    if (usersRes.error) throw usersRes.error
    if (artistsRes.error) throw artistsRes.error
    if (venuesRes.error) throw venuesRes.error

    return {
      users: usersRes.count ?? 0,
      artists: artistsRes.count ?? 0,
      venues: venuesRes.count ?? 0,
    }
  }

  static async getEnquiryStats(): Promise<EnquiryStats> {
    const [pendingRes, readRes, respondedRes, archivedRes] = await Promise.all([
      supabase
        .from('enquiries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'PENDING'),
      supabase
        .from('enquiries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'READ'),
      supabase
        .from('enquiries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'RESPONDED'),
      supabase
        .from('enquiries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ARCHIVED'),
    ])

    if (pendingRes.error) throw pendingRes.error
    if (readRes.error) throw readRes.error
    if (respondedRes.error) throw respondedRes.error
    if (archivedRes.error) throw archivedRes.error

    return {
      pending: pendingRes.count ?? 0,
      read: readRes.count ?? 0,
      responded: respondedRes.count ?? 0,
      archived: archivedRes.count ?? 0,
    }
  }

  static async getActivityStats(): Promise<ActivityStats> {
    const [messagesRes, favoritesRes] = await Promise.all([
      supabase.from('messages').select('*', { count: 'exact', head: true }),
      supabase.from('favorites').select('*', { count: 'exact', head: true }),
    ])

    if (messagesRes.error) throw messagesRes.error
    if (favoritesRes.error) throw favoritesRes.error

    return {
      messages: messagesRes.count ?? 0,
      favorites: favoritesRes.count ?? 0,
    }
  }

  static async getSignupTrend(days: number = 30): Promise<SignupTrendPoint[]> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from('profiles')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    if (error) throw error

    // Group by date
    const dateMap = new Map<string, number>()
    data?.forEach((profile: { created_at: string }) => {
      const date = profile.created_at.split('T')[0]
      dateMap.set(date, (dateMap.get(date) ?? 0) + 1)
    })

    // Convert to array and sort
    return Array.from(dateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  static async getTopArtists(limit: number = 5): Promise<TopEntity[]> {
    // Get all artist favorites and count them
    const { data: favorites, error: favError } = await supabase
      .from('favorites')
      .select('artist_id')
      .not('artist_id', 'is', null)

    if (favError) throw favError
    if (!favorites || favorites.length === 0) return []

    // Count favorites per artist
    const countMap = new Map<string, number>()
    favorites.forEach((fav: { artist_id: string | null }) => {
      if (fav.artist_id) {
        countMap.set(fav.artist_id, (countMap.get(fav.artist_id) ?? 0) + 1)
      }
    })

    // Get top artist IDs
    const topArtistIds = Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id)

    if (topArtistIds.length === 0) return []

    // Fetch artist details with profile for avatar
    const { data: artists, error: artistsError } = await supabase
      .from('artists')
      .select('id, stage_name, profile_id, profiles!inner(avatar_url)')
      .in('id', topArtistIds)

    if (artistsError) throw artistsError

    // Combine with counts
    type ArtistWithProfile = {
      id: string
      stage_name: string
      profile_id: string
      profiles: { avatar_url: string | null }
    }

    return (artists ?? [])
      .map((artist: ArtistWithProfile) => ({
        id: artist.id,
        name: artist.stage_name,
        avatar_url: artist.profiles.avatar_url,
        favorite_count: countMap.get(artist.id) ?? 0,
      }))
      .sort((a, b) => b.favorite_count - a.favorite_count)
  }

  static async getTopVenues(limit: number = 5): Promise<TopEntity[]> {
    // Get all venue favorites and count them
    const { data: favorites, error: favError } = await supabase
      .from('favorites')
      .select('venue_id')
      .not('venue_id', 'is', null)

    if (favError) throw favError
    if (!favorites || favorites.length === 0) return []

    // Count favorites per venue
    const countMap = new Map<string, number>()
    favorites.forEach((fav: { venue_id: string | null }) => {
      if (fav.venue_id) {
        countMap.set(fav.venue_id, (countMap.get(fav.venue_id) ?? 0) + 1)
      }
    })

    // Get top venue IDs
    const topVenueIds = Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id)

    if (topVenueIds.length === 0) return []

    // Fetch venue details with profile for name and avatar
    const { data: venues, error: venuesError } = await supabase
      .from('venues')
      .select('id, profile_id, profiles!inner(display_name, avatar_url)')
      .in('id', topVenueIds)

    if (venuesError) throw venuesError

    // Combine with counts
    type VenueWithProfile = {
      id: string
      profile_id: string
      profiles: { display_name: string | null; avatar_url: string | null }
    }

    return (venues ?? [])
      .map((venue: VenueWithProfile) => ({
        id: venue.id,
        name: venue.profiles.display_name ?? 'Unknown Venue',
        avatar_url: venue.profiles.avatar_url,
        favorite_count: countMap.get(venue.id) ?? 0,
      }))
      .sort((a, b) => b.favorite_count - a.favorite_count)
  }
}
