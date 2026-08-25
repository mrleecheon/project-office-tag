import { AnimatePresence, motion } from 'framer-motion'
import { SceneModes } from '../../engine/contracts.js'
import { resolveScreenPreset } from '../../engine/animation/motionPresets.js'
import ChatScene from '../../renderers/chat/ChatScene.jsx'
import RpgScene from '../../renderers/rpg/RpgScene.jsx'
import VnScene from '../../renderers/vn/VnScene.jsx'

function renderSceneContent({
  scene,
  chapter,
  context,
  map,
  state,
  onChoice,
  onInput,
  onDone,
  onTrigger,
  onMove,
}) {
  if (!scene) return null

  if (scene.mode === SceneModes.CHAT) {
    return (
      <ChatScene
        scene={scene}
        context={context}
        onChoice={onChoice}
        onInput={onInput}
        onAutoNext={onDone}
      />
    )
  }

  if (scene.mode === SceneModes.VN) {
    return (
      <VnScene
        scene={scene}
        context={context}
        onChoice={onChoice}
        onDone={onDone}
      />
    )
  }

  if (scene.mode === SceneModes.RPG) {
    return (
      <RpgScene
        chapter={chapter}
        scene={scene}
        map={map}
        state={state}
        onTrigger={onTrigger}
        onMove={onMove}
      />
    )
  }

  return null
}

export default function SceneViewport({
  scene,
  chapter,
  context,
  map,
  state,
  onChoice,
  onInput,
  onDone,
  onTrigger,
  onMove,
}) {
  if (!scene) return null
  const screenPreset = scene.mode === SceneModes.CHAT
    ? resolveScreenPreset('default')
    : resolveScreenPreset('cinematic')

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={scene.id}
        className="sceneViewportLayer"
        {...screenPreset}
      >
        {renderSceneContent({
          scene,
          chapter,
          context,
          map,
          state,
          onChoice,
          onInput,
          onDone,
          onTrigger,
          onMove,
        })}
      </motion.div>
    </AnimatePresence>
  )
}
