import { useState, useEffect, useRef } from 'react'

interface TypewriterOptions {
  typeSpeed?: number
  deleteSpeed?: number
  pauseDuration?: number
}

type Phase = 'typing' | 'paused' | 'deleting' | 'waiting'

export function useTypewriter(text: string, opts?: TypewriterOptions) {
  const { typeSpeed = 80, deleteSpeed = 40, pauseDuration = 3000 } = opts ?? {}
  const [displayText, setDisplayText] = useState('')
  const [phase, setPhase] = useState<Phase>('typing')
  const indexRef = useRef(0)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

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
        timer = setTimeout(() => setPhase('deleting'), pauseDuration)
        break

      case 'deleting':
        if (indexRef.current > 0) {
          timer = setTimeout(() => {
            indexRef.current--
            setDisplayText(text.slice(0, indexRef.current))
          }, deleteSpeed)
        } else {
          setPhase('waiting')
        }
        break

      case 'waiting':
        timer = setTimeout(() => setPhase('typing'), pauseDuration / 3)
        break
    }

    return () => clearTimeout(timer)
  }, [displayText, phase, text, typeSpeed, deleteSpeed, pauseDuration])

  const isTyping = phase === 'typing' || phase === 'deleting'

  return { displayText, isTyping }
}
