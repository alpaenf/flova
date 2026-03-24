'use client'

import dynamic from 'next/dynamic'

const SplashScreen = dynamic(() => import('./splash-screen'), { ssr: false })

export default function SplashWrapper() {
  return <SplashScreen />
}
