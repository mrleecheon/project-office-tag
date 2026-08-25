import { useCallback, useState } from 'react'
import AdScene from '../game/scenes/AdScene.jsx'
import ShockScene from '../game/scenes/ShockScene.jsx'
import OpeningStage from './OpeningStage.jsx'

/**
 * 광고 → 삑(쇼크) → 3D 로비 유지 + opening beat 순회.
 * 삑 이후에 2D 메신저로 자르지 않는다.
 */
export default function IntroSequence() {
  const [step, setStep] = useState('ad')
  const goShock = useCallback(() => setStep('shock'), [])
  const goOpening = useCallback(() => setStep('opening'), [])

  if (step === 'ad') return <AdScene onDone={goShock} />
  if (step === 'shock') return <ShockScene onDone={goOpening} />
  return <OpeningStage />
}
