import { useEffect, useState } from 'react'
import ScreenTransition from '../../ui/layout/ScreenTransition'

export default function BootScreen({ lines, onDone }) {
  const [visible, setVisible] = useState([])
  const bootLines = Array.isArray(lines) ? lines : []

  useEffect(() => {
    const timers = bootLines.map((line, index) => (
      setTimeout(() => setVisible((previous) => [...previous, line]), 350 + index * 180)
    ))
    timers.push(setTimeout(onDone, 350 + bootLines.length * 180 + 600))
    return () => timers.forEach(clearTimeout)
  }, [bootLines, onDone])

  return (
    <ScreenTransition className="screen boot">
      <div>
        <small className="systemEyebrow">GROOMY OFFICE</small>
        {visible.map((line) => <p key={line}>{line}</p>)}
      </div>
    </ScreenTransition>
  )
}
