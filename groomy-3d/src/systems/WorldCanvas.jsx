import { Canvas } from '@react-three/fiber'
import WorldPostFx from './WorldPostFx.jsx'
import { enableSoftShadows } from './WorldGraphics.jsx'

export default function WorldCanvas({ children, camera, ...props }) {
  return (
    <Canvas
      shadows
      camera={camera}
      gl={{ antialias: true, toneMappingExposure: 1.05 }}
      onCreated={({ gl }) => enableSoftShadows(gl)}
      {...props}
    >
      {children}
      <WorldPostFx />
    </Canvas>
  )
}
