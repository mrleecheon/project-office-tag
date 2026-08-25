import { useEffect, useMemo, useState } from 'react'
import { emitAudioCue } from '../../engine/audio/audioBus.js'

const phases = [
  { id: 'black', label: '', duration: 900 },
  { id: 'studio', label: 'MIRRORCELL STUDIO', duration: 900 },
  { id: 'crt', label: 'CRT BOOTSTRAP', duration: 1100 },
  { id: 'signal', label: 'SIGNAL INTERFERENCE', duration: 1000 },
  { id: 'init', label: 'SYSTEM INITIALIZATION', duration: 1200 },
  { id: 'reveal', label: 'PROJECT GROOMY', duration: 1100 },
]

export default function StartupSequence({ onDone, skippable = false }) {
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [allowSkip, setAllowSkip] = useState(false)
  const phase = phases[phaseIndex]
  const totalDuration = useMemo(
    () => phases.reduce((acc, entry) => acc + entry.duration, 0),
    [],
  )

  useEffect(() => {
    const skipTimer = window.setTimeout(() => setAllowSkip(true), 2000)
    return () => window.clearTimeout(skipTimer)
  }, [])

  useEffect(() => {
    // Failsafe: never allow startup overlay to block forever.
    const guard = window.setTimeout(onDone, totalDuration + 1200)
    return () => window.clearTimeout(guard)
  }, [onDone, totalDuration])

  useEffect(() => {
    const cueByPhase = {
      studio: 'ui:notification',
      crt: 'ui:transition',
      signal: 'ui:glitch',
      init: 'ui:open',
      reveal: 'ui:confirm',
    }
    const cue = cueByPhase[phase?.id]
    if (cue) emitAudioCue(cue)
  }, [phase?.id])

  useEffect(() => {
    if (phaseIndex >= phases.length - 1) {
      const doneTimer = window.setTimeout(onDone, phases[phaseIndex].duration)
      return () => window.clearTimeout(doneTimer)
    }
    const timer = window.setTimeout(() => setPhaseIndex((value) => value + 1), phase.duration)
    return () => window.clearTimeout(timer)
  }, [onDone, phase.duration, phaseIndex])

  const handleSkip = () => {
    if (!skippable || !allowSkip) return
    emitAudioCue('ui:confirm')
    onDone()
  }

  return (
    <div className={`startupSequence phase-${phase.id}`} onClick={handleSkip} role="presentation">
      <div className="startupNoise" />
      <div className="startupScanline" />
      <div className="startupGlow" />
      <div className="startupContent">
        <small>Experimental Build / {Math.round(totalDuration / 1000)}s</small>
        <h2>{phase.label}</h2>
        {skippable && allowSkip && <p>Click to skip</p>}
      </div>
    </div>
  )
}
