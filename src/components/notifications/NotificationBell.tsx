import { Bell, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  useNotifications,
  useNotificationUnreadCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/hooks/queries/use-notifications'
import { cn } from '@/lib/utils'

const typeColors: Record<string, string> = {
  enquiry_received: 'bg-blue-500',
  enquiry_status_changed: 'bg-yellow-500',
  message_received: 'bg-green-500',
  new_favorite: 'bg-pink-500',
}

export function NotificationBell() {
  const navigate = useNavigate()
  const { data: notifications = [] } = useNotifications(10)
  const { data: unreadCount = 0 } = useNotificationUnreadCount()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const handleItemClick = (notification: (typeof notifications)[0]) => {
    if (!notification.read_at) {
      markRead.mutate(notification.id)
    }
    if (notification.link) {
      navigate(notification.link)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          data-testid="notification-bell"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              data-testid="notification-badge"
              className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-xs flex items-center justify-center bg-destructive text-destructive-foreground"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        align="end"
        data-testid="notification-dropdown"
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto py-1 px-2 text-xs"
              onClick={() => markAllRead.mutate()}
              data-testid="notification-mark-all-read"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div
              className="py-8 text-center text-sm text-muted-foreground"
              data-testid="notification-empty"
            >
              No notifications yet
            </div>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                data-testid={`notification-item-${n.id}`}
                className={cn(
                  'w-full text-left px-4 py-3 hover:bg-accent transition-colors border-b last:border-b-0 flex gap-3',
                  !n.read_at && 'bg-muted/50'
                )}
                onClick={() => handleItemClick(n)}
              >
                <span
                  className={cn(
                    'mt-1.5 h-2 w-2 rounded-full shrink-0',
                    typeColors[n.type] ?? 'bg-gray-500'
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      'text-sm truncate',
                      !n.read_at && 'font-semibold'
                    )}
                  >
                    {n.title}
                  </p>
                  {n.body && (
                    <p className="text-xs text-muted-foreground truncate">
                      {n.body}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDistanceToNow(new Date(n.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="border-t px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs"
            onClick={() => navigate('/notifications')}
          >
            View all
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
