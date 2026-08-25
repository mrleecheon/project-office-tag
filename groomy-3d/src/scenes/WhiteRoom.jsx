import { OfficeDesk } from '../assets/OfficeFurniture.jsx'
import WorldPrompt from '../systems/WorldPrompt.jsx'

export default function WhiteRoom({ showPaperPrompt = false }) {
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
    </group>
  )
}
