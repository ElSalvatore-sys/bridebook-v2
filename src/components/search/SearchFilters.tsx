import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCities } from '@/hooks/queries/use-locations'
import { useGenres } from '@/hooks/queries/use-genres'
import type { SearchType } from '@/lib/validations/search'

const TYPE_OPTIONS: { value: SearchType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'artists', label: 'Artists' },
  { value: 'venues', label: 'Venues' },
]

interface SearchFiltersProps {
  type: SearchType
  cityId: string | null
  genreId: string | null
  onTypeChange: (type: SearchType) => void
  onCityChange: (cityId: string | null) => void
  onGenreChange: (genreId: string | null) => void
  onClearAll: () => void
}

export function SearchFilters({
  type,
  cityId,
  genreId,
  onTypeChange,
  onCityChange,
  onGenreChange,
  onClearAll,
}: SearchFiltersProps) {
  const { data: cities } = useCities()
  const { data: genres } = useGenres()

  const hasActiveFilters = cityId !== null || genreId !== null || type !== 'all'

  const selectedCity = cities?.find((c) => c.id === cityId)
  const selectedGenre = genres?.find((g) => g.id === genreId)

  return (
    <div className="space-y-3" data-testid="search-filters">
      {/* Type toggle buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex gap-1">
          {TYPE_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              variant={type === opt.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTypeChange(opt.value)}
              data-testid={`filter-type-${opt.value}`}
            >
              {opt.label}
            </Button>
          ))}
        </div>

        {/* City filter */}
        {(type === 'all' || type === 'venues') && (
          <Select
            value={cityId ?? 'all'}
            onValueChange={(v) => onCityChange(v === 'all' ? null : v)}
          >
            <SelectTrigger className="w-[160px] h-8" data-testid="filter-city">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities?.map((city) => (
                <SelectItem key={city.id} value={city.id}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Genre filter */}
        {(type === 'all' || type === 'artists') && (
          <Select
            value={genreId ?? 'all'}
            onValueChange={(v) => onGenreChange(v === 'all' ? null : v)}
          >
            <SelectTrigger className="w-[160px] h-8" data-testid="filter-genre">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres?.map((genre) => (
                <SelectItem key={genre.id} value={genre.id}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            data-testid="filter-clear-all"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Active filter badges */}
      {(selectedCity || selectedGenre) && (
        <div className="flex gap-2 flex-wrap">
          {selectedCity && (
            <Badge variant="secondary" className="gap-1">
              {selectedCity.name}
              <button onClick={() => onCityChange(null)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedGenre && (
            <Badge variant="secondary" className="gap-1">
              {selectedGenre.name}
              <button onClick={() => onGenreChange(null)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
