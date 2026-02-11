import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HeroSection() {
  return (
    <>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/heroes/events-hero.webp"
          alt="Nightlife"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-[#171717]/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <h1 className="font-display text-6xl md:text-8xl text-white mb-6">
          Bloghead
        </h1>
        <p className="text-2xl md:text-3xl text-white/90 mb-12 max-w-3xl mx-auto font-sans">
          Connect with the best nightlife experiences. Book artists, discover venues.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <Button size="lg" className="bg-[#610AD1] hover:bg-[#610AD1]/90 text-white">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link to="/discover/venues">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Explore Venues
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}
