import { Route, Routes } from 'react-router-dom'
import { LandingPage } from './components/landing/LandingPage'
import { EulaPage } from './components/legal/EulaPage'
import { PrivacyPage } from './components/legal/PrivacyPage'
import { TermsPage } from './components/legal/TermsPage'
import { ContactPage } from './components/contact/ContactPage'
import { ChangelogPage } from './components/changelog/ChangelogPage'
import { AuthPage } from './components/auth/AuthPage'
import { AuthCallback } from './components/auth/AuthCallback'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage initialMode="login" />} />
      <Route path="/signup" element={<AuthPage initialMode="signup" />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/eula" element={<EulaPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/changelog" element={<ChangelogPage />} />
    </Routes>
  )
}
