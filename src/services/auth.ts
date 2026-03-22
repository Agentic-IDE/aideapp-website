/** Cookie-based auth session management for the website. */

interface AuthSession {
  email: string
  token: string
  userId: string
}

const COOKIE_NAME = 'auth_session'
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 // 30 days in seconds

/** Store auth session in a cookie after login/signup. */
export function setAuthCookie(email: string, token: string, userId: string): void {
  const payload = btoa(JSON.stringify({ email, token, userId }))
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE_NAME}=${payload}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`
}

/** Read the auth session from the cookie. Returns null if not logged in. */
export function getAuthSession(): AuthSession | null {
  const match = document.cookie.split('; ').find(c => c.startsWith(`${COOKIE_NAME}=`))
  if (!match) return null
  try {
    return JSON.parse(atob(match.split('=')[1]))
  } catch {
    return null
  }
}

/** Clear the auth session cookie (sign out). */
export function clearAuthSession(): void {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`
}

/** Truncate email for display: "n...@gmail.com" */
export function truncateEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return email
  return `${local[0]}...@${domain}`
}
