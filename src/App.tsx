import { useState, useCallback } from 'react'
import { LoadingScreen } from './components/effects/LoadingScreen'
import { PixelRain } from './components/effects/PixelRain'
import { AppRoutes } from './router'
import type { RainDrop } from './types'

const SKIP_LOADING_KEY = 'aide-loading-seen'

export default function App() {
  const [showLoading, setShowLoading] = useState(
    () => !sessionStorage.getItem(SKIP_LOADING_KEY),
  )
  const [rainDrops, setRainDrops] = useState<RainDrop[] | undefined>()

  const handleLoadingComplete = useCallback((drops: RainDrop[]) => {
    sessionStorage.setItem(SKIP_LOADING_KEY, '1')
    setRainDrops(drops)
    setShowLoading(false)
  }, [])

  return (
    <>
      {showLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <PixelRain initialDrops={rainDrops} />
      {!showLoading && <AppRoutes />}
    </>
  )
}
