import { Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { showSuccess } from '@/lib/toast'

interface ShareButtonProps {
  title: string
  className?: string
}

export function ShareButton({ title, className }: ShareButtonProps) {
  const handleShare = async () => {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    await navigator.clipboard.writeText(url)
    showSuccess('Link copied!')
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={handleShare}
      data-testid="share-button"
    >
      <Share2 className="h-4 w-4" />
      <span className="sr-only">Share</span>
    </Button>
  )
}
