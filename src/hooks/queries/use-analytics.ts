import { useQuery } from '@tanstack/react-query'
import {
  AnalyticsService,
  type UserStats,
  type EnquiryStats,
  type ActivityStats,
  type SignupTrendPoint,
  type TopEntity,
} from '@/services/analytics'

export const analyticsKeys = {
  all: ['analytics'] as const,
  userStats: () => [...analyticsKeys.all, 'user-stats'] as const,
  enquiryStats: () => [...analyticsKeys.all, 'enquiry-stats'] as const,
  activityStats: () => [...analyticsKeys.all, 'activity-stats'] as const,
  signupTrend: (days: number) =>
    [...analyticsKeys.all, 'signup-trend', days] as const,
  topArtists: (limit: number) =>
    [...analyticsKeys.all, 'top-artists', limit] as const,
  topVenues: (limit: number) =>
    [...analyticsKeys.all, 'top-venues', limit] as const,
}

export function useUserStats() {
  return useQuery<UserStats>({
    queryKey: analyticsKeys.userStats(),
    queryFn: () => AnalyticsService.getUserStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useEnquiryStats() {
  return useQuery<EnquiryStats>({
    queryKey: analyticsKeys.enquiryStats(),
    queryFn: () => AnalyticsService.getEnquiryStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useActivityStats() {
  return useQuery<ActivityStats>({
    queryKey: analyticsKeys.activityStats(),
    queryFn: () => AnalyticsService.getActivityStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useSignupTrend(days: number = 30) {
  return useQuery<SignupTrendPoint[]>({
    queryKey: analyticsKeys.signupTrend(days),
    queryFn: () => AnalyticsService.getSignupTrend(days),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useTopArtists(limit: number = 5) {
  return useQuery<TopEntity[]>({
    queryKey: analyticsKeys.topArtists(limit),
    queryFn: () => AnalyticsService.getTopArtists(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useTopVenues(limit: number = 5) {
  return useQuery<TopEntity[]>({
    queryKey: analyticsKeys.topVenues(limit),
    queryFn: () => AnalyticsService.getTopVenues(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
