import { Navbar } from '../layout/Navbar'
import { Footer } from '../layout/Footer'

const containerStyle = { maxWidth: 800, margin: '0 auto', padding: '140px 48px 80px' }
const h1Style = { fontFamily: 'var(--fd)', fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }
const h2Style = { fontFamily: 'var(--fd)', fontSize: 20, fontWeight: 700, marginTop: 48, marginBottom: 16 } as const
const pStyle = { fontSize: 15, lineHeight: 1.85, color: 'var(--muted)', marginBottom: 16 } as const

export function PrivacyPage() {
  return (
    <>
      <Navbar />
      <div className="relative z-1" style={containerStyle}>
        <h1 style={h1Style}>Privacy Policy</h1>
        <p style={{ ...pStyle, fontSize: 13 }}>Last updated: March 2026</p>

        <p style={pStyle}>Agentic IDE Inc. ("we", "us", "our") operates the Agentic IDE desktop application. This Privacy Policy describes what data we collect, how we use it, and your rights regarding that data.</p>

        <h2 style={h2Style}>What We Collect</h2>
        <p style={pStyle}>Agentic IDE collects only <strong style={{ color: 'var(--text)' }}>anonymous usage data</strong>. This includes:</p>
        <ul style={{ ...pStyle, paddingLeft: 24 }}>
          <li>AI provider selection (Claude, Gemini, or Codex)</li>
          <li>Session duration (how long each IDE session runs)</li>
          <li>Skill activation counts (how many times skills are used)</li>
          <li>Estimated token usage (approximate tokens consumed per session)</li>
          <li>App version and platform (macOS, Windows, Linux)</li>
        </ul>
        <p style={pStyle}>All data is aggregated and <strong style={{ color: 'var(--text)' }}>cannot be used to identify individual users</strong>. Session identifiers are ephemeral UUIDs generated at session start and not linked to any personal identity.</p>

        <h2 style={h2Style}>What We Don't Collect</h2>
        <p style={pStyle}>We do not collect:</p>
        <ul style={{ ...pStyle, paddingLeft: 24 }}>
          <li>Names, email addresses, or any personally identifiable information</li>
          <li>IP addresses or device fingerprints</li>
          <li>File paths, source code, or project contents</li>
          <li>CLAUDE.md, GEMINI.md, or AGENTS.md file contents</li>
          <li>Skill content or custom instructions</li>
          <li>Keyboard input, screen recordings, or clipboard data</li>
        </ul>

        <h2 style={h2Style}>How We Use Data</h2>
        <p style={pStyle}>Anonymous usage data is used for:</p>
        <ul style={{ ...pStyle, paddingLeft: 24 }}>
          <li><strong style={{ color: 'var(--text)' }}>Product improvement</strong> — understanding which features are used most and where to focus development</li>
          <li><strong style={{ color: 'var(--text)' }}>Aggregate analytics</strong> — generating usage statistics such as total tokens saved across all users</li>
          <li><strong style={{ color: 'var(--text)' }}>Feature prioritization</strong> — deciding which providers and features to invest in</li>
        </ul>
        <p style={pStyle}>We may share aggregate, non-identifiable usage statistics with third parties. This data cannot be used to identify any individual user.</p>

        <h2 style={h2Style}>Third-Party Services</h2>
        <p style={pStyle}>Anonymous usage data is processed by <strong style={{ color: 'var(--text)' }}>Microsoft Azure Application Insights</strong> for data aggregation and analysis. Azure Application Insights processes data in accordance with Microsoft's privacy practices. No data is sold to advertisers.</p>

        <h2 style={h2Style}>Data Retention</h2>
        <p style={pStyle}>Anonymous usage data is retained for up to 24 months. After this period, data is permanently deleted from our analytics systems.</p>

        <h2 style={h2Style}>Children's Privacy</h2>
        <p style={pStyle}>Agentic IDE is not directed at children under the age of 13. We do not knowingly collect data from children.</p>

        <h2 style={h2Style}>CCPA Rights</h2>
        <p style={pStyle}>Since Agentic IDE does not collect personal information as defined under the California Consumer Privacy Act (CCPA), the rights to access, delete, and opt-out of sale of personal information do not apply. We do not sell personal information because we do not collect it.</p>

        <h2 style={h2Style}>Changes to This Policy</h2>
        <p style={pStyle}>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of the Software after changes constitutes acceptance of the revised policy.</p>

        <h2 style={h2Style}>Contact</h2>
        <p style={pStyle}>For privacy-related questions, reach out via <a href="/contact" style={{ color: 'var(--text)', textDecoration: 'underline' }}>our contact page</a>.</p>
      </div>
      <Footer />
    </>
  )
}
