import IntroSequence from './intro/IntroSequence.jsx'
import WhiteRoomIntro from './intro/WhiteRoomIntro.jsx'
import ExploreStage from './intro/ExploreStage.jsx'
import OriginalMessenger from './ui/OriginalMessenger.jsx'
import PlayRoot from './PlayRoot.jsx'
import ChipWakeStage from './intro/ChipWakeStage.jsx'
import KangIsolMorningStage from './intro/KangIsolMorningStage.jsx'
import CoffeeDebug from './scenes/CoffeeDebug.jsx'
import { useGameState } from './state/gameStateStore.js'
import { INTRO_SCENE, PRODUCT_PHASE } from './runtime/productFlow.js'

/**
 * 제품 셸. 스토리 본문은 my-game에 두고, 여기서는 모드만 고른다.
 *
 * intro        광고 → 쇼크(삑) → 3D 로비 + opening beats → 흰 방 → 톡라인
 * whiteRoom    (오프닝 안에서 흰 방 마운트. 레거시 엔트리 유지)
 * talkline     기존 2D 톡라인
 * explore      안쪽 통로 이후 3D 복도 → 오피스 → VN → 자유 조작
 */
export default function App() {
  const introPhase = useGameState((s) => s.introPhase)
  const beginExplore = useGameState((s) => s.beginExplore)
  const talklineChapterId = useGameState((s) => s.talklineChapterId)
  const talklineSceneId = useGameState((s) => s.talklineSceneId)
  const playerNickname = useGameState((s) => s.playerNickname)
  const chipWakeStep = useGameState((s) => s.chipWakeStep)
  const beginChipWakeGuide = useGameState((s) => s.beginChipWakeGuide)
  const returnChipOfficeAfterChoi = useGameState((s) => s.returnChipOfficeAfterChoi)

  if (new URLSearchParams(window.location.search).has('lobby')) {
    return <PlayRoot />
  }

  if (new URLSearchParams(window.location.search).has('coffee')) {
    return <CoffeeDebug />
  }

  if (introPhase === PRODUCT_PHASE.WHITE_ROOM) {
    return <WhiteRoomIntro />
  }

  if (introPhase === PRODUCT_PHASE.CHIP_WAKE) {
    return <ChipWakeStage />
  }

  if (introPhase === PRODUCT_PHASE.KANG_ISOL_MORNING) {
    return <KangIsolMorningStage />
  }

  if (introPhase === PRODUCT_PHASE.TALKLINE) {
    return (
      <OriginalMessenger
        afterOfficeIntro
        skipLoad
        startSceneId={talklineSceneId || INTRO_SCENE.TALKLINE}
        startChapterId={talklineChapterId}
        nickname={playerNickname}
        onInterceptScene={(sceneId) => {
          if (chipWakeStep === 'talkline' && (sceneId === 'chip_wake_3d' || sceneId === 'chapter-01.chip_wake_3d')) {
            beginChipWakeGuide()
            return true
          }
          if (
            chipWakeStep === 'choiTalkline'
            && (sceneId === 'choi_office_done' || sceneId === 'chapter-01.choi_office_done')
          ) {
            returnChipOfficeAfterChoi()
            return true
          }
          if (talklineChapterId) return false
          if (sceneId !== 'iseol_intro' && sceneId !== 'prologue.iseol_intro') return false
          beginExplore()
          return true
        }}
      />
    )
  }

  if (introPhase === PRODUCT_PHASE.EXPLORE) {
    return <ExploreStage />
  }

  return <IntroSequence />
}
