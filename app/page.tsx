import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { RideCompare } from "@/components/ride-compare"
import { FeaturesSection } from "@/components/features-section"
import { PartnersSection } from "@/components/partners-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <RideCompare />
      <FeaturesSection />
      <PartnersSection />
      <Footer />
    </main>
  )
}
