import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import {
  ThreadHeader,
  MessageBubble,
  MessageInput,
} from '@/components/messaging'
import { useThread, useSendMessage } from '@/hooks/queries'
import { useAuth } from '@/context/AuthContext'

export function ThreadDetailPage() {
  const { threadId } = useParams<{ threadId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: threadDetail, isLoading, error } = useThread(threadId ?? '')
  const sendMessage = useSendMessage()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentUserId = user?.id ?? ''

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [threadDetail?.messages])

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-220px)] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !threadDetail) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error?.message ?? 'Thread not found'}
        </AlertDescription>
      </Alert>
    )
  }

  const otherParticipant =
    threadDetail.participant_one?.id === currentUserId
      ? threadDetail.participant_two
      : threadDetail.participant_one

  const handleSend = (content: string) => {
    if (!threadId) return
    sendMessage.mutate({ threadId, content })
  }

  return (
    <div
      className="flex h-[calc(100vh-220px)] flex-col overflow-hidden rounded-lg border"
      data-testid="thread-detail-page"
    >
      {otherParticipant && (
        <ThreadHeader
          participant={otherParticipant}
          bookingRequestId={threadDetail.booking_request_id}
          onBack={() => navigate('/messages')}
        />
      )}

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {threadDetail.messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.sender_id === currentUserId}
              senderName={
                msg.sender_id !== currentUserId && otherParticipant
                  ? `${otherParticipant.first_name} ${otherParticipant.last_name}`
                  : undefined
              }
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <MessageInput onSend={handleSend} isPending={sendMessage.isPending} />
    </div>
  )
}

export default ThreadDetailPage
