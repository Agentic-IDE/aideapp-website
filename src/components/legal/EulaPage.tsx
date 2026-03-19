import { Navbar } from '../layout/Navbar'
import { Footer } from '../layout/Footer'

const containerStyle = { maxWidth: 800, margin: '0 auto', padding: '140px 48px 80px' }
const h1Style = { fontFamily: 'var(--fd)', fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }
const h2Style = { fontFamily: 'var(--fd)', fontSize: 20, fontWeight: 700, marginTop: 48, marginBottom: 16 } as const
const pStyle = { fontSize: 15, lineHeight: 1.85, color: 'var(--muted)', marginBottom: 16 } as const

export function EulaPage() {
  return (
    <>
      <Navbar />
      <div className="relative z-1" style={containerStyle}>
        <h1 style={h1Style}>End User License Agreement</h1>
        <p style={{ ...pStyle, fontSize: 13 }}>Last updated: March 2026</p>

        <p style={pStyle}>This End User License Agreement ("EULA") is a legal agreement between you ("User") and Agentic IDE Inc. ("Company") for the use of the Agentic IDE desktop application ("Software").</p>

        <h2 style={h2Style}>1. License Grant</h2>
        <p style={pStyle}>The Company grants you a free, non-exclusive, non-transferable, revocable license to download, install, and use the Software on your personal or work computer for software development purposes, including commercial projects. This license applies to the free edition of Agentic IDE.</p>

        <h2 style={h2Style}>2. Restrictions</h2>
        <p style={pStyle}>You may not: (a) reverse engineer, decompile, or disassemble the Software; (b) modify, adapt, or create derivative works of the Software binary; (c) redistribute, sublicense, rent, lease, or lend the Software to third parties; (d) remove or alter any proprietary notices, labels, or marks on the Software; (e) use the Software to develop a competing product.</p>

        <h2 style={h2Style}>3. Intellectual Property</h2>
        <p style={pStyle}>The Software and all copies thereof are proprietary to and the property of Agentic IDE Inc. All rights not specifically granted in this EULA are reserved by the Company. Skills, profiles, and custom content created by you using the Software remain your property.</p>

        <h2 style={h2Style}>4. Anonymous Telemetry</h2>
        <p style={pStyle}>The Software collects anonymous usage data to improve the product. This includes: AI provider selection (Claude, Gemini, Codex), session duration, skill activation counts, and estimated token usage. No personally identifiable information is collected. No source code, file paths, or user content is transmitted. This data may be shared in aggregate, non-identifiable form with third parties for analytics purposes. See our Privacy Policy for full details.</p>

        <h2 style={h2Style}>5. Third-Party Services</h2>
        <p style={pStyle}>The Software integrates with third-party AI services including Claude Code (Anthropic), Gemini CLI (Google), and Codex CLI (OpenAI). Your use of these services is governed by their respective terms of service and privacy policies. The Company is not responsible for the behavior, availability, or output of third-party AI services.</p>

        <h2 style={h2Style}>6. Termination</h2>
        <p style={pStyle}>This license is effective until terminated. It will terminate automatically if you fail to comply with any term of this EULA. Upon termination, you must uninstall the Software and destroy all copies in your possession.</p>

        <h2 style={h2Style}>7. Disclaimer of Warranties</h2>
        <p style={{ ...pStyle, textTransform: 'uppercase', fontSize: 13 }}>THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. THE COMPANY DOES NOT WARRANT THAT THE SOFTWARE WILL BE UNINTERRUPTED OR ERROR-FREE.</p>

        <h2 style={h2Style}>8. Limitation of Liability</h2>
        <p style={{ ...pStyle, textTransform: 'uppercase', fontSize: 13 }}>IN NO EVENT SHALL AGENTIC IDE INC. BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE SOFTWARE.</p>

        <h2 style={h2Style}>9. Governing Law</h2>
        <p style={pStyle}>This EULA shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.</p>

        <h2 style={h2Style}>10. Contact</h2>
        <p style={pStyle}>For questions about this EULA, contact us at <a href="mailto:legal@aideapp.dev" style={{ color: 'var(--text)', textDecoration: 'underline' }}>legal@aideapp.dev</a>.</p>
      </div>
      <Footer />
    </>
  )
}
