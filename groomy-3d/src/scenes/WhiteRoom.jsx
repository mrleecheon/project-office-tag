import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { OfficeDesk } from '../assets/OfficeFurniture.jsx'
import WorldPrompt from '../systems/WorldPrompt.jsx'

function GlowingPaperShard({ id, position, dimmed = false, showPrompt = false }) {
  const mat = useRef()
  useFrame(({ clock }) => {
    if (!mat.current || dimmed) return
    const pulse = 0.35 + Math.sin(clock.elapsedTime * 2.2 + position[0] * 3) * 0.22
    mat.current.emissiveIntensity = pulse
  })

  return (
    <group position={position}>
      <mesh
        rotation={[-Math.PI / 2, 0, (position[0] + position[2]) * 0.35]}
        userData={{ interactId: dimmed ? undefined : id, interactReach: 1.85 }}
      >
        <planeGeometry args={[0.28, 0.36]} />
        <meshStandardMaterial
          ref={mat}
          color={dimmed ? '#c8c8c4' : '#ffffff'}
          emissive={dimmed ? '#000000' : '#dff4ff'}
          emissiveIntensity={dimmed ? 0 : 0.45}
          roughness={0.55}
          metalness={0.05}
          transparent
          opacity={dimmed ? 0.15 : 0.95}
        />
      </mesh>
      {!dimmed && (
        <mesh position={[0, 0.35, 0]} userData={{ interactId: id, interactReach: 1.85 }}>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
      {showPrompt && !dimmed && <WorldPrompt position={[0, 0.55, 0]} label="E" />}
    </group>
  )
}

/**
 * @param {object} props
 * @param {boolean} [props.showPaperPrompt] 오프닝 책상 백지
 * @param {readonly object[]|null} [props.papers] 파편 사냥 모드 (null이면 책상 백지 유지)
 * @param {Record<string, number[]>} [props.paperPositions]
 * @param {string[]} [props.interactedIds]
 * @param {string|null} [props.lookId]
 * @param {boolean} [props.hideInteracted] true면 상호작용 끝난 조각 미표시
 */
export default function WhiteRoom({
  showPaperPrompt = false,
  papers = null,
  paperPositions = {},
  interactedIds = [],
  lookId = null,
  hideInteracted = true,
}) {
  const fragmentMode = Array.isArray(papers) && papers.length > 0
  const interactedSet = useMemo(() => new Set(interactedIds), [interactedIds])

  return (
    <group>
      <color attach="background" args={['#f3f3f0']} />
      <hemisphereLight args={['#ffffff', '#d0d0cc', 0.9]} />
      <ambientLight intensity={0.62} />
      <directionalLight position={[2, 6, 3]} intensity={0.55} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#f7f7f4" roughness={0.92} />
      </mesh>
      <mesh position={[0, 1.7, -6]}>
        <boxGeometry args={[18, 3.4, 0.2]} />
        <meshStandardMaterial color="#f5f5f2" />
      </mesh>
      <mesh position={[0, 1.7, 6]}>
        <boxGeometry args={[18, 3.4, 0.2]} />
        <meshStandardMaterial color="#f5f5f2" />
      </mesh>
      <mesh position={[-6, 1.7, 0]}>
        <boxGeometry args={[0.2, 3.4, 18]} />
        <meshStandardMaterial color="#f2f2ef" />
      </mesh>
      <mesh position={[6, 1.7, 0]}>
        <boxGeometry args={[0.2, 3.4, 18]} />
        <meshStandardMaterial color="#f2f2ef" />
      </mesh>
      <mesh position={[0, 3.38, 0]}>
        <boxGeometry args={[18, 0.12, 18]} />
        <meshStandardMaterial color="#fcfcfa" />
      </mesh>

      {!fragmentMode && (
        <>
          <OfficeDesk position={[0, 0, -2.1]} width={1.6} depth={0.74} ar />
          <mesh position={[0.12, 0.77, -1.95]} rotation={[-0.02, 0.08, 0]} userData={{ interactId: 'paper' }}>
            <boxGeometry args={[0.22, 0.008, 0.3]} />
            <meshStandardMaterial color="#ffffff" roughness={0.95} />
          </mesh>
          <mesh position={[0.12, 0.95, -1.95]} userData={{ interactId: 'paper' }}>
            <boxGeometry args={[1.1, 0.7, 1.1]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
          {showPaperPrompt && <WorldPrompt position={[0.12, 1.12, -1.95]} label="E  백지 확인" />}
        </>
      )}

      {fragmentMode &&
        papers.map((frag) => {
          const done = interactedSet.has(frag.id)
          if (hideInteracted && done) return null
          const pos = paperPositions[frag.id] ?? [0, 0.025, 0]
          return (
            <GlowingPaperShard
              key={frag.id}
              id={frag.id}
              position={pos}
              dimmed={done}
              showPrompt={lookId === frag.id && !done}
            />
          )
        })}
    </group>
  )
}
