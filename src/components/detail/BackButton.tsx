import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function BackButton() {
  const navigate = useNavigate()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(-1)}
      data-testid="back-button"
    >
      <ArrowLeft className="mr-1 h-4 w-4" />
      Back
    </Button>
  )
}
