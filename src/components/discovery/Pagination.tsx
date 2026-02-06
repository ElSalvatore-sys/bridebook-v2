import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFilterStore } from '@/stores'

interface PaginationProps {
  totalCount: number | null
}

export function Pagination({ totalCount }: PaginationProps) {
  const page = useFilterStore((s) => s.page)
  const pageSize = useFilterStore((s) => s.pageSize)
  const setPage = useFilterStore((s) => s.setPage)

  if (!totalCount || totalCount <= pageSize) return null

  const totalPages = Math.ceil(totalCount / pageSize)

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    pages.push(1)

    if (page > 3) {
      pages.push('ellipsis')
    }

    const start = Math.max(2, page - 1)
    const end = Math.min(totalPages - 1, page + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (page < totalPages - 2) {
      pages.push('ellipsis')
    }

    pages.push(totalPages)

    return pages
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-8" data-testid="pagination">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => setPage(page - 1)}
        disabled={page <= 1}
        data-testid="pagination-prev"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      {getPageNumbers().map((pageNum, idx) =>
        pageNum === 'ellipsis' ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
            ...
          </span>
        ) : (
          <Button
            key={pageNum}
            variant={page === pageNum ? 'default' : 'outline'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setPage(pageNum)}
            data-testid={`pagination-page-${pageNum}`}
          >
            {pageNum}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => setPage(page + 1)}
        disabled={page >= totalPages}
        data-testid="pagination-next"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  )
}
