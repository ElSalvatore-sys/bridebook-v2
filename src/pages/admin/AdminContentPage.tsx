import { Music, MapPin, Image } from 'lucide-react'
import { useAdminStats } from '@/hooks/queries/use-admin'

export function AdminContentPage() {
  const { data: stats, isLoading } = useAdminStats()

  const contentStats = [
    { name: 'artists', label: 'Artists', value: stats?.artists ?? 0, icon: Music },
    { name: 'venues', label: 'Venues', value: stats?.venues ?? 0, icon: MapPin },
    { name: 'media', label: 'Media Items', value: 0, icon: Image },
  ]

  return (
    <div className="space-y-6 p-6" data-testid="admin-content">
      <h1 className="text-2xl font-bold">Content Overview</h1>

      <div className="grid grid-cols-3 gap-4" data-testid="admin-content-stats">
        {isLoading
          ? [1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
            ))
          : contentStats.map(({ name, label, value, icon: Icon }) => (
              <div key={name} className="rounded-lg border bg-card p-4 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{label}</span>
                </div>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            ))}
      </div>

      <div className="rounded-lg border p-6 text-center text-muted-foreground">
        <p>Content moderation queue coming soon.</p>
      </div>
    </div>
  )
}
