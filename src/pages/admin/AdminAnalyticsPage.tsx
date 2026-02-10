import { BarChart3, Users, MessageSquare, Heart, FileText } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  useUserStats,
  useEnquiryStats,
  useActivityStats,
  useSignupTrend,
  useTopArtists,
  useTopVenues,
} from '@/hooks/queries/use-analytics'

export default function AdminAnalyticsPage() {
  const { data: userStats, isLoading: userStatsLoading } = useUserStats()
  const { data: enquiryStats, isLoading: enquiryStatsLoading } =
    useEnquiryStats()
  const { data: activityStats, isLoading: activityStatsLoading } =
    useActivityStats()
  const { data: signupTrend, isLoading: signupTrendLoading } = useSignupTrend()
  const { data: topArtists, isLoading: topArtistsLoading } = useTopArtists()
  const { data: topVenues, isLoading: topVenuesLoading } = useTopVenues()

  return (
    <div className="space-y-6" data-testid="admin-analytics">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Analytics</h1>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={userStats?.users ?? 0}
          icon={Users}
          loading={userStatsLoading}
          testId="analytics-stat-users"
        />
        <StatCard
          title="Total Enquiries"
          value={
            (enquiryStats?.pending ?? 0) +
            (enquiryStats?.read ?? 0) +
            (enquiryStats?.responded ?? 0) +
            (enquiryStats?.archived ?? 0)
          }
          icon={FileText}
          loading={enquiryStatsLoading}
          testId="analytics-stat-enquiries"
        />
        <StatCard
          title="Messages"
          value={activityStats?.messages ?? 0}
          icon={MessageSquare}
          loading={activityStatsLoading}
          testId="analytics-stat-messages"
        />
        <StatCard
          title="Favorites"
          value={activityStats?.favorites ?? 0}
          icon={Heart}
          loading={activityStatsLoading}
          testId="analytics-stat-favorites"
        />
      </div>

      {/* Charts and Lists */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Signup Trend Chart */}
        <div
          className="rounded-lg border bg-card p-6"
          data-testid="analytics-signup-chart"
        >
          <h2 className="mb-4 text-xl font-semibold">
            Signups (Last 30 Days)
          </h2>
          {signupTrendLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={signupTrend ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getMonth() + 1}/${date.getDate()}`
                  }}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => {
                    const date = new Date(value as string)
                    return date.toLocaleDateString()
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Lists */}
        <div className="space-y-6">
          {/* Top Artists */}
          <div
            className="rounded-lg border bg-card p-6"
            data-testid="analytics-top-artists"
          >
            <h2 className="mb-4 text-xl font-semibold">Top Artists</h2>
            {topArtistsLoading ? (
              <div className="flex h-32 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : (
              <div className="space-y-3">
                {topArtists?.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No artists favorited yet
                  </p>
                ) : (
                  topArtists?.map((artist) => (
                    <div
                      key={artist.id}
                      className="flex items-center gap-3 rounded-lg border p-3"
                    >
                      {artist.avatar_url ? (
                        <img
                          src={artist.avatar_url}
                          alt={artist.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{artist.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {artist.favorite_count}{' '}
                          {artist.favorite_count === 1 ? 'favorite' : 'favorites'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Top Venues */}
          <div
            className="rounded-lg border bg-card p-6"
            data-testid="analytics-top-venues"
          >
            <h2 className="mb-4 text-xl font-semibold">Top Venues</h2>
            {topVenuesLoading ? (
              <div className="flex h-32 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : (
              <div className="space-y-3">
                {topVenues?.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No venues favorited yet
                  </p>
                ) : (
                  topVenues?.map((venue) => (
                    <div
                      key={venue.id}
                      className="flex items-center gap-3 rounded-lg border p-3"
                    >
                      {venue.avatar_url ? (
                        <img
                          src={venue.avatar_url}
                          alt={venue.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{venue.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {venue.favorite_count}{' '}
                          {venue.favorite_count === 1 ? 'favorite' : 'favorites'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  loading?: boolean
  testId?: string
}

function StatCard({
  title,
  value,
  icon: Icon,
  loading,
  testId,
}: StatCardProps) {
  return (
    <div
      className="rounded-lg border bg-card p-6"
      data-testid={testId}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      {loading ? (
        <div className="mt-2 h-8 w-20 animate-pulse rounded bg-muted" />
      ) : (
        <p className="mt-2 text-3xl font-bold">{value.toLocaleString()}</p>
      )}
    </div>
  )
}
