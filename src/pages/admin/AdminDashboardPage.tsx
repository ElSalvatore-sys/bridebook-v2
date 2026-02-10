import { Link } from 'react-router-dom'
import { Users, Music, MapPin, CalendarCheck, Activity, Shield } from 'lucide-react'
import { useAdminStats, useAdminActivity } from '@/hooks/queries/use-admin'

export function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats()
  const { data: activity, isLoading: activityLoading } = useAdminActivity()

  const statCards = [
    { name: 'users', label: 'Total Users', value: stats?.users ?? 0, icon: Users },
    { name: 'artists', label: 'Artists', value: stats?.artists ?? 0, icon: Music },
    { name: 'venues', label: 'Venues', value: stats?.venues ?? 0, icon: MapPin },
    { name: 'bookings', label: 'Bookings', value: stats?.bookings ?? 0, icon: CalendarCheck },
  ]

  return (
    <div className="space-y-6 p-6" data-testid="admin-dashboard">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      {statsLoading ? (
        <div data-testid="admin-stats-loading" className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map(({ name, label, value, icon: Icon }) => (
            <div
              key={name}
              data-testid={`admin-stat-${name}`}
              className="rounded-lg border bg-card p-4 space-y-2"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="h-4 w-4" />
                <span className="text-sm">{label}</span>
              </div>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
          <div data-testid="admin-activity-feed" className="space-y-2">
            {activityLoading ? (
              <div className="h-20 bg-muted animate-pulse rounded" />
            ) : activity && activity.length > 0 ? (
              activity.map((item) => (
                <div key={item.id} className="flex items-center gap-2 rounded border p-3 text-sm">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span>{item.description}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
          <div className="space-y-2" data-testid="admin-quick-links">
            <Link
              to="/admin/users"
              className="flex items-center gap-2 rounded border p-3 text-sm hover:bg-accent transition-colors"
            >
              <Users className="h-4 w-4" />
              Manage Users
            </Link>
            <Link
              to="/admin/content"
              className="flex items-center gap-2 rounded border p-3 text-sm hover:bg-accent transition-colors"
            >
              <Music className="h-4 w-4" />
              Content Overview
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
