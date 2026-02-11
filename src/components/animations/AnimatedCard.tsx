import { cn } from '@/lib/utils'

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
}

/**
 * Simple card with CSS hover effect
 * Removed excessive 3D tilt for cleaner, professional appearance
 */
export const AnimatedCard = ({ children, className }: AnimatedCardProps) => {
  return (
    <div
      className={cn(
        'transition-all duration-200 hover:scale-[1.02] hover:shadow-lg',
        className
      )}
    >
      {children}
    </div>
  )
}
