import { Route, Routes } from 'react-router-dom'
import { LandingPage } from './components/landing/LandingPage'
import { EulaPage } from './components/legal/EulaPage'
import { PrivacyPage } from './components/legal/PrivacyPage'
import { TermsPage } from './components/legal/TermsPage'
import { ContactPage } from './components/contact/ContactPage'
import { ChangelogPage } from './components/changelog/ChangelogPage'
import { AuthPage } from './components/auth/AuthPage'
import { AuthCallback } from './components/auth/AuthCallback'
import { AccountPage } from './components/account/AccountPage'
import { TeamDetailPage } from './components/account/TeamDetailPage'
import { OrgDetailPage } from './components/account/OrgDetailPage'
import { InviteAcceptPage } from './components/account/InviteAcceptPage'
import { PricingPage } from './components/pricing/PricingPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage initialMode="login" />} />
      <Route path="/signup" element={<AuthPage initialMode="signup" />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/account/team/:id" element={<TeamDetailPage />} />
      <Route path="/account/org/:id" element={<OrgDetailPage />} />
      <Route path="/invite/accept" element={<InviteAcceptPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/eula" element={<EulaPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/changelog" element={<ChangelogPage />} />
    </Routes>
  )
}
