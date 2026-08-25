import { useLayoutEffect, useRef } from 'react'
import { ContactShadows } from '@react-three/drei'

export default function HeroProp({ children, contact = true, contactScale = 2.2, ...props }) {
  const root = useRef()

  useLayoutEffect(() => {
    root.current?.traverse((node) => {
      if (node.isMesh) node.castShadow = true
    })
  })

  return (
    <group {...props}>
      <group ref={root}>{children}</group>
      {contact && (
        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.42}
          scale={contactScale}
          blur={1.7}
          far={1.4}
          resolution={256}
          frames={1}
        />
      )}
    </group>
  )
}
