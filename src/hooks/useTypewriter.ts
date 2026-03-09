import { useState, useEffect, useRef, useCallback } from 'react'

export interface Phrase {
  text: string
  displayMs: number
}

interface TypewriterOptions {
  typeSpeed?: number
  deleteSpeed?: number
}

type Phase = 'typing' | 'paused' | 'deleting' | 'waiting'

export function useTypewriter(phrases: Phrase[], opts?: TypewriterOptions) {
  const { typeSpeed = 80, deleteSpeed = 40 } = opts ?? {}
  const [displayText, setDisplayText] = useState('')
  const [phase, setPhase] = useState<Phase>('typing')
  const indexRef = useRef(0)
  const phraseIndexRef = useRef(0)
  const poolRef = useRef<number[]>([])

  const currentPhrase = phrases[phraseIndexRef.current]

  const nextPhrase = useCallback(() => {
    // Alternate: index 0 ("Agentic IDE"), then pick from shuffle pool, repeat
    if (phraseIndexRef.current === 0 && phrases.length > 1) {
      if (poolRef.current.length === 0) {
        // Refill pool with indices 1..N-1
        poolRef.current = Array.from({ length: phrases.length - 1 }, (_, i) => i + 1)
      }
      const pick = Math.floor(Math.random() * poolRef.current.length)
      phraseIndexRef.current = poolRef.current.splice(pick, 1)[0]
    } else {
      phraseIndexRef.current = 0
    }
  }, [phrases.length])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const text = currentPhrase.text

    switch (phase) {
      case 'typing':
        if (indexRef.current < text.length) {
          timer = setTimeout(() => {
            indexRef.current++
            setDisplayText(text.slice(0, indexRef.current))
          }, typeSpeed)
        } else {
          setPhase('paused')
        }
        break

      case 'paused':
        timer = setTimeout(() => setPhase('deleting'), currentPhrase.displayMs)
        break

      case 'deleting':
        if (indexRef.current > 0) {
          timer = setTimeout(() => {
            indexRef.current--
            setDisplayText(text.slice(0, indexRef.current))
          }, deleteSpeed)
        } else {
          nextPhrase()
          setPhase('waiting')
        }
        break

      case 'waiting':
        timer = setTimeout(() => setPhase('typing'), 500)
        break
    }

    return () => clearTimeout(timer)
  }, [displayText, phase, currentPhrase, typeSpeed, deleteSpeed, nextPhrase])

  const isTyping = phase === 'typing' || phase === 'deleting'

  return { displayText, isTyping }
}
