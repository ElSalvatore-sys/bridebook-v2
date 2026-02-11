import { Calendar, Music, MapPin, Star, Users, Zap } from 'lucide-react'

const features = [
  {
    icon: Calendar,
    title: 'Instant Booking',
    description: 'Book venues and artists in seconds.',
    color: 'text-[#610AD1]',
  },
  {
    icon: Music,
    title: 'Discover Talent',
    description: 'Find perfect artists for your event.',
    color: 'text-[#FB7A43]',
  },
  {
    icon: MapPin,
    title: 'Local & Global',
    description: 'Explore venues worldwide.',
    color: 'text-[#F92B02]',
  },
  {
    icon: Star,
    title: 'Verified Reviews',
    description: 'Real reviews from real people.',
    color: 'text-[#610AD1]',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Join nightlife enthusiasts.',
    color: 'text-[#FB7A43]',
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Instant booking notifications.',
    color: 'text-[#F92B02]',
  },
]

export default function FeaturesSection() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-display text-5xl md:text-6xl text-white mb-4">
          Everything You Need
        </h2>
        <p className="text-xl text-white/70 max-w-2xl mx-auto font-sans">
          Connect venues, artists, and fans seamlessly
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-8 rounded-xl bg-[#232323] border border-white/10 hover:border-[#610AD1]/50 hover:shadow-lg transition-all duration-200"
          >
            <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
            <h3 className="text-2xl font-bold text-white mb-3 font-sans">
              {feature.title}
            </h3>
            <p className="text-white/70 font-sans">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
