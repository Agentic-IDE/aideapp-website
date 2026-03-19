import { Navbar } from '../layout/Navbar'
import { Footer } from '../layout/Footer'
import { HeroSection } from './HeroSection'
import { MissionSection } from './MissionSection'
import { ModesSection } from './ModesSection'
import { PartnersSection } from './PartnersSection'

export function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <MissionSection />
      <ModesSection />
      <PartnersSection />
      <Footer />
    </>
  )
}
