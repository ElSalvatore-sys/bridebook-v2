import { LayoutGrid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFilterStore, type ViewMode } from '@/stores'

export function ViewToggle() {
  const viewMode = useFilterStore((s) => s.viewMode)
  const setViewMode = useFilterStore((s) => s.setViewMode)

  const toggles: { mode: ViewMode; icon: typeof LayoutGrid; label: string }[] = [
    { mode: 'grid', icon: LayoutGrid, label: 'Grid view' },
    { mode: 'list', icon: List, label: 'List view' },
  ]

  return (
    <div className="flex items-center rounded-md border" data-testid="view-toggle">
      {toggles.map(({ mode, icon: Icon, label }) => (
        <Button
          key={mode}
          variant={viewMode === mode ? 'secondary' : 'ghost'}
          size="icon"
          className="h-8 w-8 rounded-none first:rounded-l-md last:rounded-r-md"
          onClick={() => setViewMode(mode)}
          data-testid={`view-${mode}`}
        >
          <Icon className="h-4 w-4" />
          <span className="sr-only">{label}</span>
        </Button>
      ))}
    </div>
  )
}
