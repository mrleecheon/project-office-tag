import { emitAudioCue } from '../../engine/audio/audioBus.js'

const hoverState = new WeakSet()

function resolveInteractiveRoot(target) {
  if (!target || !(target instanceof Element)) return null
  return target.closest('button,[role="button"],a,[data-hover-audio]')
}

export function playHoverAudioOnce(event) {
  const root = resolveInteractiveRoot(event?.currentTarget ?? event?.target)
  if (!root) return
  if (hoverState.has(root)) return
  hoverState.add(root)
  emitAudioCue('ui:hover')
}

export function clearHoverAudioState(event) {
  const root = resolveInteractiveRoot(event?.currentTarget ?? event?.target)
  if (!root) return
  hoverState.delete(root)
}
