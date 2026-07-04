import { Navigation } from "./navigation"
import { HeroSection } from "./hero-section"
import { FlavorCarousel } from "./flavor-carousel"
import { BentoGrid } from "./bento-grid"
import { ActivationsSection } from "./activations-section"
import { SocialSection } from "./social-section"
import { Footer } from "./footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FlavorCarousel />
      <BentoGrid />
      <ActivationsSection />
      <SocialSection />
      <Footer />
    </main>
  )
}
