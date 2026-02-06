import { ArrowLeft, Link2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ThreadParticipant } from '@/services'

interface ThreadHeaderProps {
  participant: ThreadParticipant
  bookingRequestId?: string | null
  onBack?: () => void
}

export function ThreadHeader({
  participant,
  bookingRequestId,
  onBack,
}: ThreadHeaderProps) {
  const name = `${participant.first_name} ${participant.last_name}`
  const initials = `${participant.first_name?.[0] ?? ''}${participant.last_name?.[0] ?? ''}`.toUpperCase()

  return (
    <div className="flex items-center gap-3 border-b px-4 py-3" data-testid="thread-header">
      {onBack && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0"
          data-testid="thread-back-btn"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}

      <Avatar className="h-9 w-9 shrink-0">
        {participant.avatar_url && (
          <AvatarImage src={participant.avatar_url} alt={name} />
        )}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="text-xs capitalize text-muted-foreground">
          {participant.role.toLowerCase()}
        </p>
      </div>

      {bookingRequestId && (
        <Link to="/bookings" className="shrink-0">
          <Badge variant="outline" className="gap-1">
            <Link2 className="h-3 w-3" />
            Linked to booking
          </Badge>
        </Link>
      )}
    </div>
  )
}
