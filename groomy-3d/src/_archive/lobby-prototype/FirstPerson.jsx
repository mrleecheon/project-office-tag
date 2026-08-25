import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'

const SPEED = 4.2
const BOUNDS = { minX: -9.2, maxX: 9.2, minZ: -9.2, maxZ: 9.2 }

export default function FirstPerson({ onLook }) {
  const { camera, scene } = useThree()
  const keys = useRef({})
  const controls = useRef(null)
  const ray = useMemo(() => new THREE.Raycaster(), [])
  const lookId = useRef(null)

  useEffect(() => {
    const down = (event) => {
      keys.current[event.code] = true
    }
    const up = (event) => {
      keys.current[event.code] = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  useFrame((_, delta) => {
    if (controls.current?.isLocked) {
      const move = new THREE.Vector3()
      const forward = new THREE.Vector3()
      const right = new THREE.Vector3()
      camera.getWorldDirection(forward)
      forward.y = 0
      forward.normalize()
      right.crossVectors(forward, camera.up).normalize()
      if (keys.current.KeyW) move.add(forward)
      if (keys.current.KeyS) move.sub(forward)
      if (keys.current.KeyD) move.add(right)
      if (keys.current.KeyA) move.sub(right)
      if (move.lengthSq() > 0) {
        move.normalize().multiplyScalar(SPEED * delta)
        camera.position.add(move)
        camera.position.x = THREE.MathUtils.clamp(camera.position.x, BOUNDS.minX, BOUNDS.maxX)
        camera.position.z = THREE.MathUtils.clamp(camera.position.z, BOUNDS.minZ, BOUNDS.maxZ)
      }
    }
    camera.position.y = 1.6

    const dir = new THREE.Vector3()
    camera.getWorldDirection(dir)
    ray.set(camera.position, dir)
    const hits = ray.intersectObjects(scene.children, true)
    const hit = hits.find((item) => item.object.userData.interactId && item.distance < 2.6)
    const nextId = hit?.object.userData.interactId ?? null
    if (nextId !== lookId.current) {
      lookId.current = nextId
      onLook?.(nextId)
    }
  })

  return <PointerLockControls ref={controls} />
}
