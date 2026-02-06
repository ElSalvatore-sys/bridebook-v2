import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useFilterStore, type SortOption } from '@/stores'

interface SortConfig {
  value: SortOption
  label: string
}

const ARTIST_SORT_OPTIONS: SortConfig[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
]

const VENUE_SORT_OPTIONS: SortConfig[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest' },
]

interface SortDropdownProps {
  vendorType: 'artist' | 'venue'
}

export function SortDropdown({ vendorType }: SortDropdownProps) {
  const sortBy = useFilterStore((s) => s.sortBy)
  const setSortBy = useFilterStore((s) => s.setSortBy)

  const options = vendorType === 'artist' ? ARTIST_SORT_OPTIONS : VENUE_SORT_OPTIONS
  const currentLabel = options.find((o) => o.value === sortBy)?.label ?? 'Sort'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" data-testid="sort-dropdown">
          <ArrowUpDown className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">{currentLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setSortBy(option.value)}
            className={sortBy === option.value ? 'bg-accent' : ''}
            data-testid={`sort-option-${option.value}`}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
