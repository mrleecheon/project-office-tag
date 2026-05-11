import { useEffect, useState } from 'react'
import ScreenTransition from '../../ui/layout/ScreenTransition'

export default function BootScreen({ lines, onDone }) {
  const [visible, setVisible] = useState([])

  useEffect(() => {
    const timers = lines.map((line, index) => (
      setTimeout(() => setVisible((previous) => [...previous, line]), 350 + index * 180)
    ))
    timers.push(setTimeout(onDone, 350 + lines.length * 180 + 600))
    return () => timers.forEach(clearTimeout)
  }, [lines, onDone])

  return (
    <ScreenTransition className="screen boot">
      <div>{visible.map((line) => <p key={line}>{line}</p>)}</div>
    </ScreenTransition>
  )
}
