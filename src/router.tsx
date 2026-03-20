import { Route, Routes } from 'react-router-dom'
import { LandingPage } from './components/landing/LandingPage'
import { EulaPage } from './components/legal/EulaPage'
import { PrivacyPage } from './components/legal/PrivacyPage'
import { TermsPage } from './components/legal/TermsPage'
import { ContactPage } from './components/contact/ContactPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/eula" element={<EulaPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  )
}
