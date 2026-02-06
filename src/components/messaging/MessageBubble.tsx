import { cn } from '@/lib/utils'
import type { Message } from '@/services'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  senderName?: string
}

function formatMessageTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function MessageBubble({ message, isOwn, senderName }: MessageBubbleProps) {
  return (
    <div
      className={cn('flex flex-col gap-1', isOwn ? 'items-end' : 'items-start')}
      data-testid={`message-${message.id}`}
    >
      {!isOwn && senderName && (
        <span className="text-xs text-muted-foreground">{senderName}</span>
      )}
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap break-words',
          isOwn
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        )}
      >
        {message.content}
      </div>
      <span className="text-xs text-muted-foreground">
        {formatMessageTime(message.created_at)}
      </span>
    </div>
  )
}
