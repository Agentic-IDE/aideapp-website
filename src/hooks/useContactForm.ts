import { useState, type FormEvent } from 'react'
import { submitContact } from '../services/contact.service'

export function useContactForm() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email || submitted) return
    setLoading(true)
    setError(null)
    try {
      await submitContact({ email, message: message || undefined })
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return { email, setEmail, message, setMessage, submitted, loading, error, handleSubmit }
}
