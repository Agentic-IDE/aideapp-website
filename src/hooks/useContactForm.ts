import { useState, useEffect, type FormEvent } from 'react'
import { submitContact } from '../services/contact.service'

export type ContactStatus = 'idle' | 'loading' | 'success' | 'error'

export function useContactForm() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<ContactStatus>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email || status === 'loading' || status === 'success') return
    setStatus('loading')
    try {
      await submitContact({ email, message: message || undefined })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  // Auto-reset after success/error
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => {
        if (status === 'success') {
          setEmail('')
          setMessage('')
        }
        setStatus('idle')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [status])

  return { email, setEmail, message, setMessage, status, handleSubmit }
}
