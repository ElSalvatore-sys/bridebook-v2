import { useEffect, useRef, useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIsFavorite, useToggleFavorite } from '@/hooks/queries'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'
import type { FavoriteType } from '@/services'
import { cn } from '@/lib/utils'

const STYLE_ID = 'favorite-button-keyframes'

const HEART_STYLES = `
@keyframes heart-pop {
  0% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(0.9); }
  75% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
@keyframes heart-burst {
  0% { transform: scale(0.5); opacity: 0.8; }
  100% { transform: scale(2); opacity: 0; }
}
`

const SIZE_MAP = {
  sm: { button: 'h-7 w-7', icon: 'h-4 w-4' },
  md: { button: 'h-8 w-8', icon: 'h-5 w-5' },
  lg: { button: 'h-9 w-9', icon: 'h-6 w-6' },
} as const

interface FavoriteButtonProps {
  vendorId: string
  vendorType: FavoriteType
  size?: 'sm' | 'md' | 'lg'
  variant?: 'overlay' | 'inline'
  className?: string
}

export function FavoriteButton({
  vendorId,
  vendorType,
  size = 'md',
  variant = 'inline',
  className,
}: FavoriteButtonProps) {
  const { user } = useAuth()
  const { data: isFavorite } = useIsFavorite(vendorId, vendorType)
  const { mutate: toggleFavorite, isPending } = useToggleFavorite()
  const [isAnimating, setIsAnimating] = useState(false)
  const [showBurst, setShowBurst] = useState(false)
  const animationTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const burstTimer = useRef<ReturnType<typeof setTimeout>>(null)

  // Inject keyframe styles once
  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = HEART_STYLES
    document.head.appendChild(style)
  }, [])

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (animationTimer.current) clearTimeout(animationTimer.current)
      if (burstTimer.current) clearTimeout(burstTimer.current)
    }
  }, [])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast('Sign in to save favorites')
      return
    }

    // Trigger bounce animation
    setIsAnimating(true)
    animationTimer.current = setTimeout(() => setIsAnimating(false), 400)

    // Trigger burst on add (not currently a favorite)
    if (!isFavorite) {
      setShowBurst(true)
      burstTimer.current = setTimeout(() => setShowBurst(false), 500)
    }

    toggleFavorite(
      { vendorId, vendorType },
      {
        onSuccess: (result) => {
          if (result.isFavorite) {
            toast.success('Added to favorites')
          } else {
            toast('Removed from favorites')
          }
        },
      }
    )
  }

  const { button: buttonSize, icon: iconSize } = SIZE_MAP[size]

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'relative rounded-full',
        buttonSize,
        variant === 'overlay' && 'bg-background/80 backdrop-blur-sm hover:bg-background/90',
        className,
      )}
      onClick={handleClick}
      disabled={isPending}
      data-testid="favorite-button"
    >
      {showBurst && (
        <span
          className="absolute inset-0 rounded-full border-2 border-red-500"
          style={{ animation: 'heart-burst 500ms ease-out forwards' }}
        />
      )}
      <Heart
        className={cn(
          iconSize,
          'transition-colors duration-200',
          isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground',
        )}
        style={isAnimating ? { animation: 'heart-pop 400ms ease' } : undefined}
      />
      <span className="sr-only">
        {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      </span>
    </Button>
  )
}
