import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useZodForm } from '@/lib/forms/use-zod-form'
import { sendMessageSchema } from '@/lib/validations'

interface MessageInputProps {
  onSend: (content: string) => void
  isPending: boolean
}

export function MessageInput({ onSend, isPending }: MessageInputProps) {
  const form = useZodForm(sendMessageSchema, {
    defaultValues: { content: '' },
  })

  const handleSubmit = form.handleSubmit((data) => {
    onSend(data.content)
    form.reset()
  })

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 border-t p-4"
      data-testid="message-input"
    >
      <Textarea
        {...form.register('content')}
        placeholder="Type a message..."
        rows={2}
        className="min-h-0 resize-none"
        onKeyDown={handleKeyDown}
        disabled={isPending}
      />
      <Button
        type="submit"
        size="icon"
        disabled={isPending || !form.watch('content')?.trim()}
        data-testid="send-message-btn"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}
