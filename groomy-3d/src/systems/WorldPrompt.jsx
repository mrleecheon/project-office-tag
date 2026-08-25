import { Html } from '@react-three/drei'
import { Vector3 } from 'three'
import './WorldPrompt.css'

const projected = new Vector3()

function clampAboveVnBand(el, camera, size) {
  projected.setFromMatrixPosition(el.matrixWorld)
  projected.project(camera)
  const x = projected.x * size.width * 0.5 + size.width * 0.5
  let y = -(projected.y * size.height * 0.5) + size.height * 0.5
  const vnTop = size.height * 0.7
  if (y > vnTop) y = vnTop
  return [x, y]
}

export default function WorldPrompt({
  position = [0, 0, 0],
  label,
  description,
}) {
  const action = label
  if (!action && !description) return null
  return (
    <Html
      position={position}
      distanceFactor={10}
      sprite
      zIndexRange={[8, 0]}
      calculatePosition={clampAboveVnBand}
      style={{ pointerEvents: 'none', transform: 'translate(-50%, -120%)' }}
    >
      <div className="world-prompt">
        {description && <p className="world-prompt-desc">{description}</p>}
        {action && <p className="world-prompt-label">{action}</p>}
      </div>
    </Html>
  )
}
