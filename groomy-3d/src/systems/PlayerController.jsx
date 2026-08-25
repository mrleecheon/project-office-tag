import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'
import { ROOM_GRAPH, useGameState } from '../state/gameStateStore.js'

const SPEED = 4.2
const REACH = 11
const NEAR = 8
const _world = new THREE.Vector3()

function readInteractMeta(object) {
  let node = object
  while (node) {
    const id = node.userData?.interactId
    if (id) {
      return {
        id,
        reach: node.userData.interactReach,
      }
    }
    node = node.parent
  }
  return null
}

function planarDist(from, object) {
  object.getWorldPosition(_world)
  return Math.hypot(from.x - _world.x, from.z - _world.z)
}

function inReach(camera, object, hitDistance, reach) {
  if (reach == null) return hitDistance <= REACH
  return planarDist(camera.position, object) <= reach
}

export default function PlayerController({ bounds, spawn, spawnYaw }) {
  const { camera, scene } = useThree()
  const keys = useRef({})
  const controls = useRef(null)
  const ray = useMemo(() => new THREE.Raycaster(), [])
  const lookId = useRef(null)
  const setLookId = useGameState((s) => s.setLookId)
  const setRightEyeHold = useGameState((s) => s.setRightEyeHold)
  const setDebugProbe = useGameState((s) => s.setDebugProbe)
  const doorOpen = useGameState((s) => s.doorOpen)
  const exitOpen = useGameState((s) => s.exitOpen)
  const currentRoom = useGameState((s) => s.currentRoom)
  const inputMode = useGameState((s) => s.inputMode)
  const scriptedWalk = useGameState((s) => s.scriptedWalk)
  const coffeePhase = useGameState((s) => s.coffeeGame.phase)
  const brewing = coffeePhase === 'brewing'
  const play3d = inputMode === '3d'
  const spawned = useRef(false)

  useEffect(() => {
    spawned.current = false
  }, [currentRoom])

  useEffect(() => {
    if (play3d) return undefined
    controls.current?.unlock?.()
    document.exitPointerLock?.()
    keys.current = {}
    return undefined
  }, [play3d])

  useEffect(() => {
    if (!brewing) return undefined
    controls.current?.unlock?.()
    document.exitPointerLock?.()
    keys.current = {}
    return undefined
  }, [brewing])

  useEffect(() => () => {
    controls.current?.unlock?.()
    document.exitPointerLock?.()
  }, [])

  useEffect(() => {
    if (!play3d) return undefined
    const down = (event) => {
      keys.current[event.code] = true
      if (event.code === 'KeyF') setRightEyeHold(true)
    }
    const up = (event) => {
      keys.current[event.code] = false
      if (event.code === 'KeyF') setRightEyeHold(false)
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      keys.current = {}
    }
  }, [play3d, setRightEyeHold])

  useFrame((_, delta) => {
    if (!spawned.current && spawn) {
      camera.position.set(spawn[0], spawn[1], spawn[2])
      spawned.current = true
    }
    camera.position.y = 1.6

    const isLocked = play3d && Boolean(controls.current?.isLocked)

    if (isLocked && !scriptedWalk) {
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
      }
    }

    camera.position.x = THREE.MathUtils.clamp(camera.position.x, bounds.minX, bounds.maxX)
    const meta = ROOM_GRAPH[currentRoom]
    const open = currentRoom === 'lobby' ? doorOpen : Boolean(exitOpen[currentRoom])
    let minZ = bounds.minZ
    if (meta?.blockMinZ != null && !open) minZ = meta.blockMinZ
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, minZ, bounds.maxZ)

    const dir = new THREE.Vector3()
    camera.getWorldDirection(dir)
    ray.far = REACH
    ray.set(camera.position, dir)
    const hits = ray.intersectObjects(scene.children, true)
    const rayHit = hits.find((item) => {
      const meta = readInteractMeta(item.object)
      return meta && inReach(camera, item.object, item.distance, meta.reach)
    })

    let nextId = rayHit ? readInteractMeta(rayHit.object).id : null
    let via = nextId ? 'ray' : 'none'
    let nearest = null

    if (!nextId) {
      const here = camera.position
      scene.traverse((object) => {
        if (!object.isMesh) return
        const meta = readInteractMeta(object)
        if (!meta) return
        object.getWorldPosition(_world)
        const dist3 = here.distanceTo(_world)
        const planar = Math.hypot(here.x - _world.x, here.z - _world.z)
        const ok = meta.reach == null ? dist3 <= NEAR : planar <= meta.reach
        if (!ok) return
        const rank = meta.reach == null ? dist3 : planar
        if (!nearest || rank < nearest.dist) nearest = { id: meta.id, dist: rank }
      })
      if (nearest) {
        nextId = nearest.id
        via = 'near'
      }
    }

    if (nextId !== lookId.current) {
      lookId.current = nextId
      setLookId(nextId)
    }

    setDebugProbe({
      lookId: nextId,
      via,
      locked: isLocked,
      x: Number(camera.position.x.toFixed(2)),
      z: Number(camera.position.z.toFixed(2)),
    })
  })

  return play3d && !brewing ? <PointerLockControls ref={controls} /> : null
}
