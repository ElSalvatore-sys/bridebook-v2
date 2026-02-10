import { Link, useNavigate } from 'react-router-dom'
import { Menu, LogOut, Settings, Search } from 'lucide-react'
import { useAuth } from '@/hooks'
import { useCurrentProfile } from '@/hooks/queries'
import { useUIStore } from '@/stores'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { GlobalSearchBar } from '@/components/search/SearchBar'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const roleBadgeClasses: Record<string, string> = {
  ARTIST: 'bg-brand text-brand-foreground',
  VENUE: 'bg-primary text-primary-foreground',
  USER: 'bg-secondary text-secondary-foreground',
  ADMIN: 'bg-destructive text-destructive-foreground',
}

function getInitials(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.charAt(0)?.toUpperCase() || ''
  const last = lastName?.charAt(0)?.toUpperCase() || ''
  return first + last || '?'
}

export function Header() {
  const { user, signOut } = useAuth()
  const { data: profile } = useCurrentProfile()
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const navigate = useNavigate()

  const initials = getInitials(profile?.first_name, profile?.last_name)
  const displayName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'User'
  const role = profile?.role || 'USER'

  return (
    <header
      data-testid="header"
      className="sticky top-0 z-40 bg-background border-b"
    >
      <div className="flex h-14 items-center gap-4 px-4">
        {/* Left side */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
          data-testid="header-hamburger"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        <Link
          to="/dashboard"
          className="font-bold text-xl text-primary"
          data-testid="header-logo"
        >
          bloghead
        </Link>

        {/* Desktop search bar */}
        <div className="hidden sm:flex flex-1 max-w-md mx-4">
          <GlobalSearchBar />
        </div>

        {/* Mobile search icon */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden ml-auto"
          onClick={() => navigate('/search')}
          data-testid="header-search-mobile"
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NotificationBell />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
                data-testid="header-user-menu"
              >
                <Avatar className="h-8 w-8">
                  {profile?.avatar_url && (
                    <AvatarImage src={profile.avatar_url} alt={displayName} />
                  )}
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-medium leading-none">{displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  <Badge className={roleBadgeClasses[role] || roleBadgeClasses.USER} variant="secondary">
                    {role}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
