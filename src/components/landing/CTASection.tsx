import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CTASection() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="font-display text-5xl md:text-6xl text-white mb-6">
        Ready to Get Started?
      </h2>
      <p className="text-xl text-white/70 mb-8 font-sans">
        Join thousands creating amazing experiences
      </p>
      <Link to="/signup">
        <Button size="lg" className="bg-[#610AD1] hover:bg-[#610AD1]/90 text-white">
          Create Free Account
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </Link>
    </div>
  )
}
