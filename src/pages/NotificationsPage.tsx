import { Bell, Check, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useNotificationUnreadCount,
} from '@/hooks/queries/use-notifications'
import { NotificationService } from '@/services/notifications'
import { cn } from '@/lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import { notificationKeys } from '@/hooks/queries/use-notifications'

const typeColors: Record<string, string> = {
  enquiry_received: 'bg-blue-500',
  enquiry_status_changed: 'bg-yellow-500',
  message_received: 'bg-green-500',
  new_favorite: 'bg-pink-500',
}

export function NotificationsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: notifications = [], isLoading } = useNotifications()
  const { data: unreadCount = 0 } = useNotificationUnreadCount()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const handleClick = (n: (typeof notifications)[0]) => {
    if (!n.read_at) {
      markRead.mutate(n.id)
    }
    if (n.link) {
      navigate(n.link)
    }
  }

  const handleDelete = async (id: string) => {
    await NotificationService.delete(id)
    queryClient.invalidateQueries({ queryKey: notificationKeys.all })
  }

  if (isLoading) {
    return (
      <div className="space-y-4" data-testid="notifications-loading">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-9 w-32" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6" data-testid="notifications-page">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllRead.mutate()}
            data-testid="notifications-mark-all-read"
          >
            <Check className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div
          className="text-center py-16 text-muted-foreground"
          data-testid="notifications-empty"
        >
          <Bell className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">You're all caught up!</p>
          <p className="text-sm">No notifications to show.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              data-testid={`notification-card-${n.id}`}
              className={cn(
                'flex items-start gap-3 p-4 rounded-lg border cursor-pointer hover:bg-accent transition-colors group',
                !n.read_at && 'bg-muted/50 border-primary/20'
              )}
              onClick={() => handleClick(n)}
            >
              <span
                className={cn(
                  'mt-1.5 h-2.5 w-2.5 rounded-full shrink-0',
                  typeColors[n.type] ?? 'bg-gray-500'
                )}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    'text-sm',
                    !n.read_at && 'font-semibold'
                  )}
                >
                  {n.title}
                </p>
                {n.body && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {n.body}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(n.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 shrink-0"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(n.id)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
