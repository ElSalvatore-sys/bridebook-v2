import { Suspense, lazy } from 'react'

// Lazy load landing sections for code-splitting
const HeroSection = lazy(() => import('@/components/landing/HeroSection'))
const FeaturesSection = lazy(() => import('@/components/landing/FeaturesSection'))
const StatsSection = lazy(() => import('@/components/landing/StatsSection'))
const HowItWorksSection = lazy(() => import('@/components/landing/HowItWorksSection'))
const CTASection = lazy(() => import('@/components/landing/CTASection'))

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#610AD1]"></div>
  </div>
)

/**
 * Home/Landing Page
 * Clean, static, professional design matching original Bloghead
 * 5 sections: Hero, Features, Stats, How It Works, CTA
 */
export const HomePage = () => {
  return (
    <div className="relative bg-[#171717]">
      <Suspense fallback={<LoadingSpinner />}>
        {/* Section 1: Hero - Full viewport with background image */}
        <section className="relative min-h-screen flex items-center justify-center">
          <HeroSection />
        </section>

        {/* Section 2: Features - Grid of 6 cards */}
        <section className="py-24 px-4">
          <FeaturesSection />
        </section>

        {/* Section 3: Stats - Counter with stats */}
        <section className="py-24 px-4 bg-[#232323]">
          <StatsSection />
        </section>

        {/* Section 4: How It Works - 3-step process */}
        <section className="py-24 px-4">
          <HowItWorksSection />
        </section>

        {/* Section 5: CTA - Final call to action */}
        <section className="py-24 px-4 bg-gradient-to-b from-[#171717] to-[#232323]">
          <CTASection />
        </section>
      </Suspense>
    </div>
  )
}
