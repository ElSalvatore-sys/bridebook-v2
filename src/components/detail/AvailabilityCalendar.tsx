import { Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAvailability } from '@/hooks/queries'

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function formatTime(time: string): string {
  const [h, m] = time.split(':')
  const hour = parseInt(h, 10)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${display}:${m} ${suffix}`
}

interface AvailabilityCalendarProps {
  artistId: string
}

export function AvailabilityCalendar({ artistId }: AvailabilityCalendarProps) {
  const { data: slots, isLoading } = useAvailability(artistId)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  // Group slots by day_of_week (0=Monday in our schema)
  const byDay = new Map<number, Array<{ start: string; end: string }>>()
  for (const slot of slots ?? []) {
    const existing = byDay.get(slot.day_of_week) ?? []
    existing.push({ start: slot.start_time, end: slot.end_time })
    byDay.set(slot.day_of_week, existing)
  }

  const isEmpty = (slots ?? []).length === 0

  return (
    <Card data-testid="availability-calendar">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4" />
          Weekly Availability
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <p className="text-sm text-muted-foreground">No availability set</p>
        ) : (
          <div className="space-y-2">
            {DAY_NAMES.map((name, i) => {
              const daySlots = byDay.get(i)
              return (
                <div key={name} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-sm font-medium">{name}</span>
                  {daySlots ? (
                    <div className="flex flex-wrap gap-1.5">
                      {daySlots.map((s, j) => (
                        <Badge
                          key={j}
                          variant="secondary"
                          className="bg-green-500/10 text-green-700 dark:text-green-400"
                        >
                          {formatTime(s.start)} - {formatTime(s.end)}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Not set</span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
