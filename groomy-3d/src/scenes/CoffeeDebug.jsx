import { Suspense, useEffect } from 'react'
import WorldCanvas from '../systems/WorldCanvas.jsx'
import PlayerController from '../systems/PlayerController.jsx'
import CoffeeStation from './CoffeeStation.jsx'
import { useGameState } from '../state/gameStateStore.js'
import '../PlayRoot.css'
import '../systems/WorldPrompt.css'

export default function CoffeeDebug() {
  const lookId = useGameState((s) => s.lookId)
  const coffeeGame = useGameState((s) => s.coffeeGame)
  const startOfficeCoffeeBrewing = useGameState((s) => s.startOfficeCoffeeBrewing)
  const pourCoffeeShot = useGameState((s) => s.pourCoffeeShot)
  const order = coffeeGame.orders[coffeeGame.currentOrderIndex] ?? null
  const atMachine = lookId === 'coffee-button' || lookId === 'coffee-deliver'

  useEffect(() => {
    startOfficeCoffeeBrewing()
    useGameState.setState({ inputMode: '3d' })
  }, [startOfficeCoffeeBrewing])

  useEffect(() => {
    const onKey = (event) => {
      if (event.code !== 'KeyE' || !atMachine) return
      if (coffeeGame.phase === 'brewing') pourCoffeeShot()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [atMachine, coffeeGame.phase, pourCoffeeShot])

  return (
    <div className="play-root">
      <WorldCanvas camera={{ fov: 70, position: [0, 1.6, 0.6] }}>
        <Suspense fallback={null}>
          <color attach="background" args={['#1c1a18']} />
          <hemisphereLight args={['#fff4e8', '#2a241c', 0.7]} />
          <ambientLight intensity={0.45} />
          <directionalLight position={[2.4, 5.5, 3]} intensity={0.7} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[12, 12]} />
            <meshStandardMaterial color="#3a342c" roughness={0.92} />
          </mesh>
          <CoffeeStation
            origin={[0, 0, -1.35]}
            lookId={lookId}
            phase={coffeeGame.phase}
            order={order}
            shots={coffeeGame.currentShots}
            showPrompt={coffeeGame.phase === 'brewing'}
          />
        </Suspense>
        <PlayerController
          bounds={{ minX: -2.4, maxX: 2.4, minZ: -1.6, maxZ: 3.2 }}
          spawn={[0, 1.6, 0.6]}
        />
      </WorldCanvas>
      <div className="play-crosshair" />
    </div>
  )
}
