import { Globe, Instagram, Music2, Headphones, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ContactInfoProps {
  instagram?: string | null
  soundcloud?: string | null
  spotify?: string | null
  website?: string | null
  onBookingClick?: () => void
}

const SOCIAL_LINKS = [
  { key: 'instagram' as const, icon: Instagram, label: 'Instagram', prefix: 'https://instagram.com/' },
  { key: 'spotify' as const, icon: Music2, label: 'Spotify', prefix: '' },
  { key: 'soundcloud' as const, icon: Headphones, label: 'SoundCloud', prefix: '' },
  { key: 'website' as const, icon: Globe, label: 'Website', prefix: '' },
] as const

export function ContactInfo({
  instagram,
  soundcloud,
  spotify,
  website,
  onBookingClick,
}: ContactInfoProps) {
  const values: Record<string, string | null | undefined> = { instagram, soundcloud, spotify, website }
  const links = SOCIAL_LINKS.filter((s) => values[s.key])

  return (
    <div className="space-y-4">
      {links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {links.map((link) => {
            const value = values[link.key]!
            const href = value.startsWith('http') ? value : `${link.prefix}${value}`
            const Icon = link.icon
            return (
              <Button
                key={link.key}
                variant="outline"
                size="sm"
                asChild
              >
                <a href={href} target="_blank" rel="noopener noreferrer">
                  <Icon className="mr-1.5 h-4 w-4" />
                  {link.label}
                </a>
              </Button>
            )
          })}
        </div>
      )}
      <Button
        className="w-full"
        onClick={onBookingClick}
        data-testid="booking-cta"
      >
        <Mail className="mr-2 h-4 w-4" />
        Send Booking Request
      </Button>
    </div>
  )
}
