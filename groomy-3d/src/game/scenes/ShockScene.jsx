import { useEffect, useRef } from 'react'
import './ShockScene.css'

export default function ShockScene({ onDone }) {
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    const end = window.setTimeout(() => onDoneRef.current?.(), 3200)
    return () => window.clearTimeout(end)
  }, [])

  return (
    <div className="shock" onClick={() => onDoneRef.current?.()} role="presentation">
      <div className="shock-flash" />
      <div className="shock-noise" />
      <p className="shock-text">삑ㅡ</p>
      <p className="shock-sub">사원증을 찍는 순간, 모든 게 흐릿해졌다.</p>
      <p className="shock-hint">클릭하여 계속</p>
    </div>
  )
}
