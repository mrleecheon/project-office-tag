// Temporary route-gap audit — finds scenes that can soft-lock the player:
//  (1) DEAD-END: non-terminal scene with no outgoing path at all
//  (2) GATED-NO-FALLBACK: every choice is requirement-gated and there is no
//      next/returnTo fallback (the general form of the CH1 loop bug)
//  (3) RPG scene whose map has no leave/exit
// Safe to delete.

import { chapters } from '../../content/chapters/index.js'
import { SceneModes } from '../../engine/contracts.js'

const dead = []
const gated = []
const rpgNoExit = []
const selfLoop = []

for (const chapter of chapters) {
  const scenes = chapter.scenes ?? {}
  for (const [sceneId, scene] of Object.entries(scenes)) {
    const path = `${chapter.id}.${sceneId}`

    // terminal scenes are fine
    if (scene.mode === SceneModes.END) continue
    if (scene.end?.type === 'chapterComplete') continue

    if (scene.mode === SceneModes.RPG) {
      const map = chapter.maps?.[scene.mapId]
      const hasExit = Boolean(map?.leave?.sceneId)
        || Object.keys(map?.triggers ?? {}).length > 0
        || (map?.eventTiles ?? []).length > 0
        || (map?.npcs ?? []).length > 0
      if (!hasExit) rpgNoExit.push(`${path} (map: ${scene.mapId})`)
      continue
    }

    const hasNext = typeof scene.next === 'string'
    const hasReturnTo = typeof scene.returnTo === 'string'
    const hasInput = Boolean(scene.input?.next)
    const choices = Array.isArray(scene.choices) ? scene.choices : []
    const hasUngatedChoice = choices.some((c) => (c.requirements ?? []).length === 0)
    const allChoicesGated = choices.length > 0 && !hasUngatedChoice

    const hasGuaranteedPath = hasNext || hasInput || hasUngatedChoice
    const hasAnyPath = hasGuaranteedPath || hasReturnTo || choices.length > 0

    if (!hasAnyPath) {
      dead.push(path)
    } else if (allChoicesGated && !hasNext && !hasReturnTo && !hasInput) {
      // every visible choice could vanish in some state, with no fallback to auto-advance
      gated.push(`${path} (${choices.length} gated choices, no next/returnTo fallback)`)
    }

    // returnTo pointing to itself = guaranteed freeze
    if (hasReturnTo && scene.returnTo === sceneId) selfLoop.push(path)
  }
}

function report(title, list) {
  console.log(`\n## ${title}: ${list.length}`)
  for (const item of list) console.log(`   - ${item}`)
}

console.log('===== ROUTE-GAP AUDIT =====')
report('DEAD-END (no outgoing path → hard soft-lock)', dead)
report('GATED-NO-FALLBACK (all choices gated, no fallback → soft-lock risk)', gated)
report('RPG scene with no map exit', rpgNoExit)
report('returnTo self-loop', selfLoop)

const total = dead.length + gated.length + rpgNoExit.length + selfLoop.length
console.log(`\nTOTAL FINDINGS: ${total}`)
console.log('audit done')
