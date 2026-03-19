import { Navbar } from '../layout/Navbar'
import { Footer } from '../layout/Footer'

const containerStyle = { maxWidth: 800, margin: '0 auto', padding: '140px 48px 80px' }
const h1Style = { fontFamily: 'var(--fd)', fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }
const h2Style = { fontFamily: 'var(--fd)', fontSize: 20, fontWeight: 700, marginTop: 48, marginBottom: 16 } as const
const pStyle = { fontSize: 15, lineHeight: 1.85, color: 'var(--muted)', marginBottom: 16 } as const

export function TermsPage() {
  return (
    <>
      <Navbar />
      <div className="relative z-1" style={containerStyle}>
        <h1 style={h1Style}>Terms of Service</h1>
        <p style={{ ...pStyle, fontSize: 13 }}>Last updated: March 2026</p>

        <p style={pStyle}>These Terms of Service ("Terms") govern your use of the Agentic IDE desktop application ("Service") provided by Agentic IDE Inc. ("Company", "we", "us"). By downloading or using Agentic IDE, you agree to these Terms.</p>

        <h2 style={h2Style}>1. Acceptance</h2>
        <p style={pStyle}>By downloading, installing, or using Agentic IDE, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, do not use the Service.</p>

        <h2 style={h2Style}>2. Service Description</h2>
        <p style={pStyle}>Agentic IDE is a free AI-native development platform that provides skill management, a multi-provider terminal IDE (supporting Claude Code, Gemini CLI, and Codex CLI), profile-based configuration, skill import/export, and usage analytics. The Service is provided free of charge for the free edition.</p>

        <h2 style={h2Style}>3. User Responsibilities</h2>
        <p style={pStyle}>You are responsible for: (a) your use of third-party AI providers accessed through the Service; (b) any code generated, modified, or deployed using the Service; (c) compliance with the terms of service of AI providers you connect to; (d) ensuring your use complies with all applicable laws and regulations.</p>

        <h2 style={h2Style}>4. Prohibited Uses</h2>
        <p style={pStyle}>You may not use the Service to: (a) engage in any illegal activity; (b) create malware, viruses, or destructive software; (c) circumvent software protections, DRM, or access controls; (d) harass, abuse, or harm others; (e) impersonate any person or entity; (f) interfere with or disrupt the Service or its infrastructure.</p>

        <h2 style={h2Style}>5. Anonymous Telemetry</h2>
        <p style={pStyle}>By using the Service, you consent to the collection of anonymous usage data as described in our <a href="/privacy" style={{ color: 'var(--text)', textDecoration: 'underline' }}>Privacy Policy</a>. This data is anonymous, cannot identify you, and is used to improve the product. No personal information is collected.</p>

        <h2 style={h2Style}>6. Intellectual Property</h2>
        <p style={pStyle}>The Service, including its source code, design, and documentation, is owned by Agentic IDE Inc. and protected by copyright and intellectual property laws. Skills, profiles, and custom content you create using the Service are your property. You retain all rights to your work product.</p>

        <h2 style={h2Style}>7. Third-Party Services</h2>
        <p style={pStyle}>The Service integrates with third-party AI providers. We do not control and are not responsible for the output, accuracy, availability, or behavior of these services. Your use of third-party services is subject to their respective terms.</p>

        <h2 style={h2Style}>8. Disclaimer of Warranties</h2>
        <p style={{ ...pStyle, textTransform: 'uppercase', fontSize: 13 }}>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.</p>

        <h2 style={h2Style}>9. Limitation of Liability</h2>
        <p style={{ ...pStyle, textTransform: 'uppercase', fontSize: 13 }}>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, AGENTIC IDE INC. SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY. OUR TOTAL LIABILITY SHALL NOT EXCEED $0 (ZERO DOLLARS) FOR THE FREE EDITION.</p>

        <h2 style={h2Style}>10. Indemnification</h2>
        <p style={pStyle}>You agree to indemnify, defend, and hold harmless Agentic IDE Inc. and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, or expenses arising from your use of the Service or violation of these Terms.</p>

        <h2 style={h2Style}>11. Governing Law</h2>
        <p style={pStyle}>These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of California.</p>

        <h2 style={h2Style}>12. Changes to Terms</h2>
        <p style={pStyle}>We reserve the right to modify these Terms at any time. Changes will be posted on this page. Continued use of the Service after changes constitutes acceptance of the revised Terms.</p>

        <h2 style={h2Style}>13. Contact</h2>
        <p style={pStyle}>For questions about these Terms, contact us at <a href="mailto:legal@aideapp.dev" style={{ color: 'var(--text)', textDecoration: 'underline' }}>legal@aideapp.dev</a>.</p>
      </div>
      <Footer />
    </>
  )
}
