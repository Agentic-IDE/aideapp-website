import { useState, type FormEvent } from 'react'
import { submitWaitlist } from '../services/waitlist.service'

export function useWaitlistForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email || submitted) return
    setLoading(true)
    setError(null)
    try {
      await submitWaitlist({ email })
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return { email, setEmail, submitted, loading, error, handleSubmit }
}
