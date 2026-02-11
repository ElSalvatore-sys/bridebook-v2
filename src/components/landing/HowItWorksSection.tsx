import { Search, Calendar, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Discover',
    description: 'Browse venues and artists',
    step: '01',
  },
  {
    icon: Calendar,
    title: 'Book',
    description: 'Reserve instantly',
    step: '02',
  },
  {
    icon: CheckCircle,
    title: 'Enjoy',
    description: 'Amazing experience',
    step: '03',
  },
]

export default function HowItWorksSection() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-display text-5xl md:text-6xl text-white mb-4">
          How It Works
        </h2>
        <p className="text-xl text-white/70 font-sans">Three simple steps</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {steps.map((step, index) => (
          <div key={index} className="text-center relative">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#610AD1]/20 border-2 border-[#610AD1] mb-6">
              <step.icon className="w-10 h-10 text-[#610AD1]" />
            </div>
            <div className="absolute top-0 right-0 text-6xl font-display text-white/10">
              {step.step}
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 font-sans">
              {step.title}
            </h3>
            <p className="text-white/70 font-sans">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
