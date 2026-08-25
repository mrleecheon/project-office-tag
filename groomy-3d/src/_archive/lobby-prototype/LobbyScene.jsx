/**
 * 폐기 예정 로비 프로토타입. 실제 로비는 scenes/Lobby.jsx + PlayRoot.
 * 새 콘텐츠는 여기에 넣지 말 것.
 */
import { Canvas } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import FirstPerson from './FirstPerson.jsx'
import './LobbyScene.css'

const palette = {
  ruin: {
    bg: '#12100e',
    floor: '#3a342e',
    wall: '#2d2925',
    ceiling: '#2a2622',
    desk: '#4a4036',
    door: '#1c1a18',
    fog: '#12100e',
    light: '#c9b48a',
  },
  ar: {
    bg: '#d8e4ee',
    floor: '#e8eef4',
    wall: '#f3f6f8',
    ceiling: '#ffffff',
    desk: '#cfd8e0',
    door: '#9ec4e8',
    fog: '#d8e4ee',
    light: '#ffffff',
  },
}

function LobbyWorld({ ar, hasKey }) {
  const c = ar ? palette.ar : palette.ruin

  return (
    <>
      <color attach="background" args={[c.bg]} />
      <fog attach="fog" args={[c.fog, ar ? 16 : 8, ar ? 28 : 22]} />
      <hemisphereLight args={[ar ? '#eef5ff' : '#6a645c', ar ? '#b8c8d8' : '#1a1612', ar ? 0.9 : 0.55]} />
      <pointLight position={[0, 3.2, 0]} intensity={ar ? 18 : 8} distance={16} color={c.light} />
      <pointLight position={[-2.2, 0.8, -4.2]} intensity={hasKey ? 0 : 4} distance={5} color="#e6c25a" />

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={c.floor} />
      </mesh>
      <mesh position={[0, 3.4, 0]}>
        <boxGeometry args={[20, 0.2, 20]} />
        <meshStandardMaterial color={c.ceiling} />
      </mesh>
      <Wall position={[0, 1.7, -10]} size={[20, 3.4, 0.3]} color={c.wall} />
      <Wall position={[0, 1.7, 10]} size={[20, 3.4, 0.3]} color={c.wall} />
      <Wall position={[-10, 1.7, 0]} size={[0.3, 3.4, 20]} color={c.wall} />
      <Wall position={[10, 1.7, 0]} size={[0.3, 3.4, 20]} color={c.wall} />

      <mesh position={[-4.2, 0.55, -5.6]}>
        <boxGeometry args={[2.6, 1.1, 1.2]} />
        <meshStandardMaterial color={c.desk} />
      </mesh>
      <mesh position={[-3.4, 1.18, -5.6]}>
        <boxGeometry args={[0.8, 0.08, 0.5]} />
        <meshStandardMaterial color={ar ? '#9aa8b4' : '#6d6254'} />
      </mesh>

      {!ar && (
        <>
          <mesh position={[4.8, 0.28, -3.4]} rotation={[0.15, -0.4, 0.1]}>
            <boxGeometry args={[1.1, 0.55, 0.7]} />
            <meshStandardMaterial color="#4a3a30" />
          </mesh>
          <mesh position={[-6.4, 0.2, 3.1]} rotation={[0, 0.6, 0.2]}>
            <boxGeometry args={[1.3, 0.4, 0.8]} />
            <meshStandardMaterial color="#2c2824" />
          </mesh>
        </>
      )}

      <mesh position={[0, 1.55, -9.88]}>
        <boxGeometry args={[2.8, 3.3, 0.18]} />
        <meshStandardMaterial color={ar ? '#d0dde8' : '#3a342e'} />
      </mesh>
      <mesh position={[0, 1.55, -9.82]}>
        <boxGeometry args={[2.4, 3.1, 0.16]} />
        <meshStandardMaterial color={c.door} metalness={ar ? 0.4 : 0.05} roughness={ar ? 0.25 : 0.9} />
      </mesh>
      <mesh position={[0, 2.85, -9.7]}>
        <boxGeometry args={[1.1, 0.16, 0.08]} />
        <meshStandardMaterial color={ar ? '#3a7cae' : '#6a5a40'} />
      </mesh>
      <mesh position={[1.45, 1.38, -9.62]} userData={{ interactId: 'reader' }}>
        <boxGeometry args={[0.28, 0.42, 0.12]} />
        <meshStandardMaterial
          color={hasKey ? '#d4c070' : '#8a7a4a'}
          emissive={hasKey ? '#d4b24a' : '#5a4a20'}
          emissiveIntensity={hasKey ? 1.4 : 0.7}
        />
      </mesh>
      <mesh position={[1.45, 1.72, -9.55]}>
        <boxGeometry args={[0.5, 0.12, 0.04]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {!hasKey && (
        <mesh position={[-2.35, 0.08, -4.55]} rotation={[0, 0.5, 0]} userData={{ interactId: 'key' }}>
          <boxGeometry args={[0.55, 0.06, 0.28]} />
          <meshStandardMaterial color="#d4c36a" emissive="#b79a30" emissiveIntensity={1.1} />
        </mesh>
      )}
    </>
  )
}

function Wall({ position, size, color }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export default function LobbyScene() {
  const [ar, setAr] = useState(false)
  const [hasKey, setHasKey] = useState(false)
  const [lookId, setLookId] = useState(null)
  const [hint, setHint] = useState('머리가 너무 아파.')
  const [flash, setFlash] = useState(false)
  useEffect(() => {
    const onKey = (event) => {
      if (event.code !== 'KeyE') return
      if (lookId === 'key' && !hasKey) {
        setHasKey(true)
        setHint('전임자 사원증을 주웠다. 문에 태그해야 한다.')
      }
      if (lookId === 'reader') {
        if (!hasKey) {
          setHint('카드키가 없다. 책상 아래를 보자.')
          return
        }
        if (ar) return
        setFlash(true)
        setHint('삑ㅡ')
        window.setTimeout(() => {
          setAr(true)
          setFlash(false)
          setHint('눈이 부시다. 여긴… 회사?')
        }, 900)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lookId, hasKey, ar])

  const prompt =
    lookId === 'key' && !hasKey
      ? 'E  카드키 줍기'
      : lookId === 'reader'
        ? hasKey
          ? 'E  사원증 태그'
          : '카드키가 필요하다'
        : null

  return (
    <div className="lobby">
      <Canvas camera={{ fov: 70, position: [0, 1.6, 2.4] }}>
        <LobbyWorld ar={ar} hasKey={hasKey} />
        <FirstPerson onLook={setLookId} />
      </Canvas>
      {flash && <div className="lobby-flash" />}
      <div className="lobby-hud">
        <p>{hint}</p>
        {prompt && <p className="lobby-prompt">{prompt}</p>}
        <p className="lobby-hint">클릭 시점 잠금 · WASD · E 상호작용 · ESC 해제</p>
      </div>
    </div>
  )
}
