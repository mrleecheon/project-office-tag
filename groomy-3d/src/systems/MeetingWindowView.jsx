import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

function buildWindowCanvas(ar) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 320
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  if (ar) {
    const sky = ctx.createLinearGradient(0, 0, 0, 320)
    sky.addColorStop(0, '#9eb4c8')
    sky.addColorStop(0.55, '#c8d4de')
    sky.addColorStop(1, '#dfe8ef')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, 512, 320)
    ctx.fillStyle = '#7a8a98'
    ;[
      [40, 140, 70, 180],
      [120, 110, 55, 210],
      [190, 125, 80, 195],
      [280, 95, 65, 225],
      [360, 130, 90, 190],
      [430, 105, 55, 215],
    ].forEach(([x, y, w, h]) => {
      ctx.fillRect(x, y, w, h)
      ctx.fillStyle = '#95a8b8'
      for (let row = y + 14; row < y + h - 8; row += 18) {
        for (let col = x + 10; col < x + w - 8; col += 16) {
          if ((col + row) % 32 === 0) ctx.fillRect(col, row, 7, 10)
        }
      }
      ctx.fillStyle = '#7a8a98'
    })
    ctx.fillStyle = 'rgba(255,255,255,0.25)'
    ctx.fillRect(0, 0, 512, 48)
  } else {
    ctx.fillStyle = '#1a2028'
    ctx.fillRect(0, 0, 512, 320)
    ctx.fillStyle = '#2a323c'
    ctx.fillRect(0, 200, 512, 120)
    ctx.fillStyle = '#3a444e'
    ;[
      [30, 150, 60, 170],
      [110, 120, 50, 200],
      [200, 135, 75, 185],
      [310, 110, 55, 210],
      [390, 140, 80, 180],
    ].forEach(([x, y, w, h]) => ctx.fillRect(x, y, w, h))
    ctx.strokeStyle = 'rgba(180,200,220,0.08)'
    for (let i = 0; i < 12; i += 1) {
      ctx.beginPath()
      ctx.moveTo(40 + i * 38, 0)
      ctx.lineTo(20 + i * 42, 320)
      ctx.stroke()
    }
    ctx.fillStyle = 'rgba(120,140,160,0.12)'
    ctx.fillRect(0, 0, 512, 320)
  }

  return canvas
}

/**
 * AR/폐허 스킨별 창밖 풍경 (캔버스 텍스처).
 */
export default function MeetingWindowView({
  ar = false,
  position = [5.82, 1.78, -0.35],
  rotation = [0, -Math.PI / 2, 0],
  size = [2.35, 1.45],
}) {
  const [w, h] = size
  const viewTexture = useMemo(() => {
    const canvas = buildWindowCanvas(ar)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [ar])

  useEffect(() => () => viewTexture.dispose(), [viewTexture])

  const frame = ar ? '#c5ced6' : '#2c2824'
  const sill = ar ? '#b8c0c8' : '#3a3430'

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[w + 0.22, h + 0.22, 0.1]} />
        <meshStandardMaterial color={frame} roughness={0.82} />
      </mesh>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={viewTexture} toneMapped={false} />
      </mesh>
      <mesh position={[0, -h / 2 - 0.06, 0.02]}>
        <boxGeometry args={[w + 0.08, 0.1, 0.14]} />
        <meshStandardMaterial color={sill} roughness={0.88} />
      </mesh>
      <mesh position={[-w / 2 + 0.02, 0, 0.02]}>
        <boxGeometry args={[0.04, h, 0.06]} />
        <meshStandardMaterial color={frame} roughness={0.85} />
      </mesh>
      <mesh position={[w / 2 - 0.02, 0, 0.02]}>
        <boxGeometry args={[0.04, h, 0.06]} />
        <meshStandardMaterial color={frame} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.03, h, 0.05]} />
        <meshStandardMaterial color={frame} roughness={0.85} />
      </mesh>
    </group>
  )
}
