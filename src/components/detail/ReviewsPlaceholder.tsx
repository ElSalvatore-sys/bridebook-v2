import { MessageSquare } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function ReviewsPlaceholder() {
  return (
    <Card data-testid="reviews-placeholder">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <MessageSquare className="mb-3 h-10 w-10 text-muted-foreground/50" />
        <h3 className="font-semibold text-muted-foreground">Reviews coming soon</h3>
        <p className="mt-1 text-sm text-muted-foreground/70">
          Be the first to leave a review
        </p>
      </CardContent>
    </Card>
  )
}
