import { Navbar } from '../layout/Navbar'
import { Footer } from '../layout/Footer'
import { HeroSection } from './HeroSection'
import { MissionSection } from './MissionSection'
import { ModesSection } from './ModesSection'
import { YCSection } from './YCSection'
import { WaitlistSection } from './WaitlistSection'

export function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <MissionSection />
      <ModesSection />
      <YCSection />
      <WaitlistSection />
      <Footer />
    </>
  )
}
