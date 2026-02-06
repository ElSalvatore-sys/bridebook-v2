import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { ThreadWithDetails, ThreadParticipant } from '@/services'

interface ThreadListProps {
  threads: ThreadWithDetails[]
  selectedThreadId?: string
  onSelectThread: (threadId: string) => void
  currentUserId: string
}

function getOtherParticipant(
  thread: ThreadWithDetails,
  currentUserId: string
): ThreadParticipant | null {
  if (thread.participant_one?.id === currentUserId) {
    return thread.participant_two
  }
  return thread.participant_one
}

function getInitials(p: ThreadParticipant): string {
  return `${p.first_name?.[0] ?? ''}${p.last_name?.[0] ?? ''}`.toUpperCase()
}

function formatRelativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60_000)
  const diffHrs = Math.floor(diffMs / 3_600_000)
  const diffDays = Math.floor(diffMs / 86_400_000)

  if (diffMins < 1) return 'now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHrs < 24) return `${diffHrs}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export function ThreadList({
  threads,
  selectedThreadId,
  onSelectThread,
  currentUserId,
}: ThreadListProps) {
  if (threads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center" data-testid="threads-empty">
        <p className="text-muted-foreground">No conversations yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Start a conversation from an artist or venue page
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y" data-testid="thread-list">
      {threads.map((thread) => {
        const other = getOtherParticipant(thread, currentUserId)
        const isActive = thread.id === selectedThreadId
        const hasUnread = thread.unread_count > 0
        const name = other
          ? `${other.first_name} ${other.last_name}`
          : 'Unknown'
        const preview = thread.last_message?.content ?? 'No messages yet'

        return (
          <button
            key={thread.id}
            onClick={() => onSelectThread(thread.id)}
            data-testid={`thread-item-${thread.id}`}
            className={cn(
              'flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-accent/50',
              isActive && 'bg-accent',
              hasUnread && 'font-medium'
            )}
          >
            <Avatar className="h-10 w-10 shrink-0">
              {other?.avatar_url && (
                <AvatarImage src={other.avatar_url} alt={name} />
              )}
              <AvatarFallback>
                {other ? getInitials(other) : '??'}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className={cn('truncate text-sm', hasUnread && 'font-semibold')}>
                  {name}
                </span>
                {thread.last_message && (
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatRelativeTime(thread.last_message.created_at)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <p className="truncate text-sm text-muted-foreground">
                  {preview.length > 50 ? `${preview.slice(0, 50)}...` : preview}
                </p>
                {hasUnread && (
                  <span className="ml-auto flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground">
                    {thread.unread_count > 99 ? '99+' : thread.unread_count}
                  </span>
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
