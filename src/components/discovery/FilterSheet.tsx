import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { FilterPanel } from './FilterPanel'
import { useFilterStore } from '@/stores'

interface FilterSheetProps {
  vendorType: 'artist' | 'venue'
}

export function FilterSheet({ vendorType }: FilterSheetProps) {
  const getActiveFilterCount = useFilterStore((s) => s.getActiveFilterCount)
  const filterCount = getActiveFilterCount()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden" data-testid="filter-sheet-trigger">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
          {filterCount > 0 && (
            <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {filterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-4 overflow-y-auto">
          <FilterPanel vendorType={vendorType} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
