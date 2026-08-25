import { Canvas, useFrame } from '@react-three/fiber'
import { RenderTexture, PerspectiveCamera } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { AD_BEATS, AD_DURATION_MS } from './adBeats.js'
import './AdScene.css'

function currentBeat(elapsed) {
  let beat = AD_BEATS[0]
  for (const item of AD_BEATS) {
    if (elapsed >= item.t) beat = item
  }
  return beat
}

function Person({ position, hue = '#d4c4a8', tall = 0.72 }) {
  return (
    <group position={position}>
      <mesh position={[0, tall * 0.55, 0]}>
        <capsuleGeometry args={[0.12, tall, 4, 8]} />
        <meshStandardMaterial color={hue} roughness={0.7} />
      </mesh>
      <mesh position={[0, tall + 0.16, 0]}>
        <sphereGeometry args={[0.13, 12, 12]} />
        <meshStandardMaterial color="#e8d5c4" roughness={0.55} />
      </mesh>
    </group>
  )
}

function AdBroadcast({ setId }) {
  const cam = useRef()
  const officeMix = ['officeTease', 'officeFull', 'tag', 'legal', 'logo'].includes(setId)
  const ruin = setId === 'glitch'
  const snow = setId === 'snow' || setId === 'black'
  const bg = ruin ? '#2a241c' : officeMix ? '#c8d4de' : '#c9b08a'
  const wall = ruin ? '#3d342c' : officeMix ? '#eef3f6' : '#b08968'

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (!cam.current) return
    const z = setId === 'badge' || setId === 'tag' ? 2.35 : 3.15
    cam.current.position.lerp(new THREE.Vector3(Math.sin(t * 0.25) * 0.15, 1.05, z), 0.08)
    cam.current.lookAt(0, 0.85, 0)
  })

  if (snow) {
    return (
      <>
        <PerspectiveCamera ref={cam} makeDefault fov={42} position={[0, 1.05, 3.1]} />
        <color attach="background" args={['#0a0a0c']} />
        <mesh>
          <planeGeometry args={[8, 6]} />
          <meshBasicMaterial color="#141416" />
        </mesh>
      </>
    )
  }

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault fov={40} position={[0, 1.05, 3.1]} />
      <color attach="background" args={[bg]} />
      <ambientLight intensity={ruin ? 0.15 : 0.55} />
      <pointLight position={[1.4, 2.2, 1.2]} intensity={ruin ? 4 : 18} color={officeMix ? '#fff4dc' : '#ffd9a0'} />
      <directionalLight position={[-2, 3, 2]} intensity={ruin ? 0.4 : 1.1} color={officeMix ? '#dce8ff' : '#ffcc88'} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color={ruin ? '#2c2620' : officeMix ? '#dfe7ee' : '#8a6a4e'} />
      </mesh>
      <mesh position={[0, 1.4, -2.2]}>
        <boxGeometry args={[7, 2.8, 0.12]} />
        <meshStandardMaterial color={wall} />
      </mesh>

      {!officeMix && !ruin && (
        <>
          <mesh position={[0, 0.32, -0.2]}>
            <boxGeometry args={[1.6, 0.08, 0.9]} />
            <meshStandardMaterial color="#6b4a32" />
          </mesh>
          <mesh position={[0, 0.16, -0.2]}>
            <boxGeometry args={[1.5, 0.28, 0.8]} />
            <meshStandardMaterial color="#5a3d28" />
          </mesh>
          <Person position={[-0.55, 0, 0.15]} hue="#3a4a6a" tall={0.78} />
          <Person position={[0.35, 0, 0.35]} hue="#c45c5c" tall={0.42} />
          <mesh position={[0.9, 0.28, 0.4]}>
            <boxGeometry args={[0.7, 0.42, 0.55]} />
            <meshStandardMaterial color="#5c4030" />
          </mesh>
        </>
      )}

      {(officeMix || ruin) && (
        <>
          <mesh position={[-1.2, 0.42, -0.4]}>
            <boxGeometry args={[1.1, 0.08, 0.7]} />
            <meshStandardMaterial color={ruin ? '#4a4038' : '#f4f7fa'} />
          </mesh>
          <mesh position={[1.1, 0.55, -0.6]}>
            <boxGeometry args={[0.42, 1.1, 0.42]} />
            <meshStandardMaterial color={ruin ? '#3a322c' : '#2a6d8a'} />
          </mesh>
          <Person position={[-0.9, 0, 0.2]} hue={ruin ? '#6a6258' : '#2c3d55'} tall={0.78} />
          <Person position={[0.55, 0, 0.15]} hue={ruin ? '#5a5248' : '#8aa4b8'} tall={0.74} />
          <mesh position={[0, 1.55, -2.12]}>
            <planeGeometry args={[2.4, 0.28]} />
            <meshBasicMaterial color={ruin ? '#5a4030' : '#c9a227'} />
          </mesh>
        </>
      )}

      {(setId === 'badge' || setId === 'tag') && (
        <mesh position={[0.15, 0.95, 0.55]} rotation={[0.4, 0.6, 0.1]}>
          <boxGeometry args={[0.42, 0.26, 0.03]} />
          <meshStandardMaterial color="#1c242c" metalness={0.6} roughness={0.25} emissive="#c9a227" emissiveIntensity={setId === 'tag' ? 2.4 : 0.4} />
        </mesh>
      )}
    </>
  )
}

function CrtScreen({ setId }) {
  return (
    <mesh position={[0, 1.18, -1.28]}>
      <planeGeometry args={[1.42, 0.95]} />
      <meshBasicMaterial toneMapped={false}>
        <RenderTexture attach="map" anisotropy={4} frames={Infinity} width={512} height={342}>
          <AdBroadcast setId={setId} />
        </RenderTexture>
      </meshBasicMaterial>
    </mesh>
  )
}

function LivingRoom({ setId, black }) {
  const cam = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (!cam.current) return
    cam.current.position.set(0.1 + Math.sin(t * 0.18) * 0.05, 1.22, 3.05)
    cam.current.lookAt(0, 1.14, -1.4)
  })

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault fov={40} position={[0.1, 1.22, 3.05]} />
      <color attach="background" args={[black ? '#000000' : '#120f14']} />
      <fog attach="fog" args={['#120f14', 5, 12]} />
      <ambientLight intensity={black ? 0 : 0.2} />
      <pointLight position={[-1.5, 2.1, 0.3]} intensity={black ? 0 : 10} color="#d2b48c" distance={8} />
      <pointLight position={[0, 1.25, -0.5]} intensity={black ? 0 : setId === 'glitch' ? 28 : 14} color={setId === 'glitch' ? '#88ffaa' : '#7ebfff'} distance={5} />

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#3a2e28" />
      </mesh>
      <mesh position={[0, 1.5, -2.35]}>
        <boxGeometry args={[6, 3, 0.18]} />
        <meshStandardMaterial color="#241e1c" />
      </mesh>
      <mesh position={[-2.6, 1.5, 0]}>
        <boxGeometry args={[0.18, 3, 5]} />
        <meshStandardMaterial color="#2a2220" />
      </mesh>
      <mesh position={[0, 0.38, -1.58]}>
        <boxGeometry args={[1.7, 0.62, 0.55]} />
        <meshStandardMaterial color="#4a3428" />
      </mesh>
      <mesh position={[0, 1.16, -1.52]}>
        <boxGeometry args={[1.62, 1.12, 0.42]} />
        <meshStandardMaterial color="#111214" />
      </mesh>
      {!black && <CrtScreen setId={setId} />}
      <mesh position={[-0.52, 1.82, -1.52]}>
        <cylinderGeometry args={[0.012, 0.012, 0.42, 6]} />
        <meshStandardMaterial color="#888" metalness={0.8} />
      </mesh>
      <mesh position={[0.52, 1.82, -1.52]}>
        <cylinderGeometry args={[0.012, 0.012, 0.38, 6]} />
        <meshStandardMaterial color="#888" metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.38, 1.15]} rotation={[0.04, 0, 0]}>
        <boxGeometry args={[2.1, 0.32, 0.85]} />
        <meshStandardMaterial color="#3f302a" />
      </mesh>
    </>
  )
}

export default function AdScene({ onDone }) {
  const [elapsed, setElapsed] = useState(0)
  const beat = useMemo(() => currentBeat(elapsed), [elapsed])
  const elapsedRef = useRef(0)
  const boostRef = useRef(0)
  const originRef = useRef(0)
  elapsedRef.current = elapsed

  useEffect(() => {
    originRef.current = performance.now()
    boostRef.current = 0
    let frame = 0
    const tick = (now) => {
      setElapsed(now - originRef.current + boostRef.current)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (elapsed >= AD_DURATION_MS) onDone()
  }, [elapsed, onDone])

  const advanceBeat = () => {
    const next = AD_BEATS.find((item) => item.t > elapsedRef.current + 40)
    if (!next) {
      onDone()
      return
    }
    boostRef.current += next.t - elapsedRef.current
    setElapsed(next.t)
  }

  const black = beat.set === 'black'
  const glitch = beat.set === 'glitch'

  return (
    <div className={`ad ${glitch ? 'is-glitch' : ''} ${black ? 'is-black' : ''}`}>
      <Canvas>
        <LivingRoom setId={beat.set} black={black} />
      </Canvas>
      <div className="ad-scan" />
      <button type="button" className="ad-overlay" onClick={advanceBeat} aria-label="다음 장면">
        {beat.kicker && <p className="ad-kicker">{beat.kicker}</p>}
        {beat.latin && <p className="ad-latin">{beat.latin}</p>}
        {beat.line && <p className="ad-line">{beat.line}</p>}
        {beat.disclaimer && <p className="ad-disclaimer">{beat.disclaimer}</p>}
        {beat.set === 'logo' && (
          <div className="ad-logo">
            <span>PROJECT</span>
            <strong>ECHOES</strong>
            <em>ECHOVIS · RESONANTIA</em>
          </div>
        )}
      </button>
    </div>
  )
}
