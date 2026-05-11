import RpgScene from './renderers/rpg/RpgScene'
import { chapter01 } from './content/chapters/chapter-01'

export default function Chapter1({ nickname = '플레이어', prologueFlags = [], onClear = () => {} }) {
  const state = {
    nickname,
    flags: prologueFlags,
    mapPositions: {},
  }
  const scene = chapter01.scenes[chapter01.startSceneId]
  const map = chapter01.maps[scene.mapId]

  return (
    <RpgScene
      chapter={chapter01}
      scene={scene}
      map={map}
      state={state}
      onTrigger={onClear}
      onMove={() => {}}
    />
  )
}
