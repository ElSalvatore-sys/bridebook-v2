import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { PageHeader } from '@/components/ui/page-header'
import {
  ThreadList,
  ThreadHeader,
  MessageBubble,
  MessageInput,
} from '@/components/messaging'
import { useThreads, useThread, useSendMessage } from '@/hooks/queries'
import { useAuth } from '@/context/AuthContext'
import { useEffect, useRef } from 'react'

export function MessagesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: threads, isLoading: threadsLoading } = useThreads()
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const { data: threadDetail, isLoading: threadLoading } = useThread(selectedThreadId ?? '')
  const sendMessage = useSendMessage()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentUserId = user?.id ?? ''

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [threadDetail?.messages])

  const handleSend = (content: string) => {
    if (!selectedThreadId) return
    sendMessage.mutate({ threadId: selectedThreadId, content })
  }

  const otherParticipant = threadDetail
    ? threadDetail.participant_one?.id === currentUserId
      ? threadDetail.participant_two
      : threadDetail.participant_one
    : null

  // Mobile: show thread list, clicking navigates to /messages/:id
  // Desktop: two-panel layout
  return (
    <div className="space-y-4" data-testid="messages-page">
      <PageHeader
        title="Messages"
        description="Your conversations"
      />

      <div className="flex h-[calc(100vh-220px)] overflow-hidden rounded-lg border">
        {/* Thread list panel */}
        <div className="w-full border-r md:w-80 md:shrink-0">
          {threadsLoading ? (
            <LoadingSpinner className="p-8" />
          ) : (
            <ScrollArea className="h-full">
              <ThreadList
                threads={threads ?? []}
                selectedThreadId={selectedThreadId ?? undefined}
                onSelectThread={(id) => {
                  // Mobile: navigate to thread detail page
                  if (window.innerWidth < 768) {
                    navigate(`/messages/${id}`)
                  } else {
                    setSelectedThreadId(id)
                  }
                }}
                currentUserId={currentUserId}
              />
            </ScrollArea>
          )}
        </div>

        {/* Message detail panel (desktop only) */}
        <div className="hidden flex-1 flex-col md:flex">
          {selectedThreadId && threadDetail ? (
            <>
              {otherParticipant && (
                <ThreadHeader
                  participant={otherParticipant}
                  bookingRequestId={threadDetail.booking_request_id}
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
            </>
          ) : selectedThreadId && threadLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
              <p>Select a conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessagesPage
