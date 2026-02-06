import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIsFavorite, useToggleFavorite } from '@/hooks/queries'
import type { FavoriteType } from '@/services'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  vendorId: string
  vendorType: FavoriteType
  className?: string
}

export function FavoriteButton({ vendorId, vendorType, className }: FavoriteButtonProps) {
  const { data: isFavorite } = useIsFavorite(vendorId, vendorType)
  const { mutate: toggleFavorite, isPending } = useToggleFavorite()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite({ vendorId, vendorType })
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('h-8 w-8 rounded-full', className)}
      onClick={handleClick}
      disabled={isPending}
      data-testid="favorite-button"
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-colors',
          isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
        )}
      />
      <span className="sr-only">
        {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      </span>
    </Button>
  )
}
