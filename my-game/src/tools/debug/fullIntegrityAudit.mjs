/**
 * One-shot full integrity audit — CH3/CH4/CH5 regression pass.
 * Run: node src/tools/debug/fullIntegrityAudit.mjs
 */
import { chapters } from '../../content/chapters/index.js'
import { SceneModes } from '../../engine/contracts.js'
import {
  GROOMY_AFFINITY_SHIELD_MIN,
  GROOMY_AFFINITY_WARM_MAX,
  GROOMY_AFFINITY_WARM_MIN,
} from '../../content/story/groomyAffinityThresholds.js'
import { EffectTypes } from '../../engine/contracts.js'
import {
  resolveProjectGroomyEnding,
  resolveProjectGroomyEndingSummaryKo,
  PROJECT_GROOMY_ENDINGS,
} from '../../engine/progression/endings.js'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { initialGameState } from '../../engine/state/initialState.js'

const uiPath = join(dirname(fileURLToPath(import.meta.url)), '../../content/story/projectGroomyUi.js')
const uiSource = readFileSync(uiPath, 'utf8')
const flagLabels = {}
const flagBlock = uiSource.match(/const flagLabels = \{([\s\S]*?)\n\}/)
if (flagBlock) {
  for (const m of flagBlock[1].matchAll(/^\s{2}([a-zA-Z0-9_]+):/gm)) {
    flagLabels[m[1]] = true
  }
}

const report = {
  danglingRefs: [],
  duplicateFullIds: [],
  duplicateLocalIds: [],
  orphanedScenes: [],
  cyclesNoEffect: [],
  cyclesWithReturnTo: [],
  gatedDeadEnds: [],
  affinityGaps: [],
  endingResolverIssues: [],
  flagsSetNotLabeled: [],
  flagsLabeledNeverSet: [],
  flagsSetNeverRead: [],
}

// ── 1. Index all scenes ──
const allScenes = new Map() // fullId -> { chapterId, localId, scene }
const byChapter = new Map()

for (const chapter of chapters) {
  const scenes = chapter.scenes ?? {}
  byChapter.set(chapter.id, scenes)
  for (const [localId, scene] of Object.entries(scenes)) {
    const fullId = scene.id ?? `${chapter.id}.${localId}`
    if (allScenes.has(fullId)) {
      report.duplicateFullIds.push(fullId)
    }
    allScenes.set(fullId, { chapterId: chapter.id, localId, scene })
  }
}

// localId collisions across chapters
const localIdOwners = new Map()
for (const [fullId, meta] of allScenes) {
  const key = meta.localId
  if (!localIdOwners.has(key)) localIdOwners.set(key, [])
  localIdOwners.get(key).push(meta.chapterId)
}
for (const [localId, owners] of localIdOwners) {
  if (owners.length > 1 && new Set(owners).size > 1) {
    report.duplicateLocalIds.push({ localId, chapters: [...new Set(owners)] })
  }
}

function resolveTarget(chapterId, target) {
  if (!target || typeof target !== 'string') return null
  const chapterScenes = byChapter.get(chapterId) ?? {}
  if (chapterScenes[target]) return { chapterId, localId: target }
  for (const ch of chapters) {
    if (ch.scenes?.[target]) return { chapterId: ch.id, localId: target }
  }
  return null
}

function collectEdges(chapterId, sceneId, scene) {
  const edges = []
  if (typeof scene.next === 'string') edges.push({ to: scene.next, via: 'next' })
  if (typeof scene.returnTo === 'string') edges.push({ to: scene.returnTo, via: 'returnTo' })
  if (scene.input?.next) edges.push({ to: scene.input.next, via: 'input.next' })
  for (const choice of scene.choices ?? []) {
    if (choice.next) edges.push({ to: choice.next, via: `choice:${choice.text?.slice(0, 30)}` })
  }
  if (scene.end?.nextChapterId) {
    const nextCh = chapters.find((c) => c.id === scene.end.nextChapterId)
    if (nextCh?.startSceneId) {
      edges.push({ to: nextCh.startSceneId, via: 'chapterComplete', chapterId: nextCh.id })
    }
  }
  return edges.map((e) => ({ ...e, from: sceneId, fromChapter: chapterId }))
}

// ── 1a. Dangling refs ──
let edgeCount = 0
for (const chapter of chapters) {
  for (const [sceneId, scene] of Object.entries(chapter.scenes ?? {})) {
    for (const edge of collectEdges(chapter.id, sceneId, scene)) {
      edgeCount++
      const targetChapter = edge.chapterId ?? chapter.id
      const resolved = resolveTarget(targetChapter, edge.to)
      if (!resolved) {
        report.danglingRefs.push({
          from: `${chapter.id}.${sceneId}`,
          to: edge.to,
          via: edge.via,
        })
      }
    }
  }
}

// ── 1b. Reachability (reverse BFS from starts + chapterComplete) ──
const reachable = new Set()
const queue = []
for (const chapter of chapters) {
  if (chapter.startSceneId) {
    queue.push({ chapterId: chapter.id, sceneId: chapter.startSceneId })
  }
}
while (queue.length) {
  const { chapterId, sceneId } = queue.shift()
  const key = `${chapterId}.${sceneId}`
  if (reachable.has(key)) continue
  reachable.add(key)
  const scene = byChapter.get(chapterId)?.[sceneId]
  if (!scene) continue
  for (const edge of collectEdges(chapterId, sceneId, scene)) {
    const targetChapter = edge.chapterId ?? chapterId
    const resolved = resolveTarget(targetChapter, edge.to)
    if (resolved) {
      queue.push({ chapterId: resolved.chapterId, sceneId: resolved.localId })
    }
  }
}

let totalScenes = 0
for (const chapter of chapters) {
  for (const sceneId of Object.keys(chapter.scenes ?? {})) {
    totalScenes++
    const key = `${chapter.id}.${sceneId}`
    if (!reachable.has(key)) {
      report.orphanedScenes.push(key)
    }
  }
}

// ── 2. Cycle detection (stateless — no effect differentiation) ──
function findCyclesFrom(startChapterId, startSceneId) {
  const cycles = []
  const visited = new Set()
  const stack = []

  function dfs(chapterId, sceneId) {
    const key = `${chapterId}.${sceneId}`
    const idx = stack.indexOf(key)
    if (idx >= 0) {
      cycles.push([...stack.slice(idx), key])
      return
    }
    if (visited.has(key)) return
    visited.add(key)
    stack.push(key)
    const scene = byChapter.get(chapterId)?.[sceneId]
    if (!scene) {
      stack.pop()
      return
    }
    if (scene.mode === SceneModes.END || scene.end?.type === 'chapterComplete') {
      stack.pop()
      return
    }
    for (const edge of collectEdges(chapterId, sceneId, scene)) {
      const targetChapter = edge.chapterId ?? chapterId
      const resolved = resolveTarget(targetChapter, edge.to)
      if (resolved) dfs(resolved.chapterId, resolved.localId)
    }
    stack.pop()
  }

  dfs(startChapterId, startSceneId)
  return cycles
}

const seenCycleKeys = new Set()
for (const chapter of chapters) {
  if (!chapter.startSceneId) continue
  for (const cycle of findCyclesFrom(chapter.id, chapter.startSceneId)) {
    const key = cycle.join('→')
    if (seenCycleKeys.has(key)) continue
    seenCycleKeys.add(key)
    const hasReturnTo = cycle.some((node, i) => {
      const [chId, scId] = node.split('.')
      const scene = byChapter.get(chId)?.[scId]
      return scene?.returnTo && cycle[(i + 1) % cycle.length]?.endsWith(`.${scene.returnTo}`)
    })
    if (hasReturnTo) report.cyclesWithReturnTo.push(cycle)
    else report.cyclesNoEffect.push(cycle)
  }
}

// ── 2b. Gated dead-end scan (routeAudit extended) ──
for (const chapter of chapters) {
  for (const [sceneId, scene] of Object.entries(chapter.scenes ?? {})) {
    if (scene.mode === SceneModes.END || scene.end?.type === 'chapterComplete') continue
    if (scene.mode === SceneModes.RPG) continue
    const choices = scene.choices ?? []
    const hasNext = typeof scene.next === 'string'
    const hasReturnTo = typeof scene.returnTo === 'string'
    const hasInput = Boolean(scene.input?.next)
    const hasUngated = choices.some((c) => (c.requirements ?? []).length === 0)
    if (choices.length > 0 && !hasUngated && !hasNext && !hasReturnTo && !hasInput) {
      report.gatedDeadEnds.push(`${chapter.id}.${sceneId} (${choices.length} gated choices)`)
    }
  }
}

// ── 2c. final_choice_pick affinity coverage ──
const affinityTiers = [
  { name: 'high (shield+)', min: GROOMY_AFFINITY_SHIELD_MIN, max: 99, expected: 'final_choice_high' },
  { name: 'mid (warm)', min: GROOMY_AFFINITY_WARM_MIN, max: GROOMY_AFFINITY_WARM_MAX, expected: 'final_choice_mid' },
  { name: 'low (wary)', min: -99, max: 1, expected: 'final_choice_low' },
]
const pickScene = byChapter.get('chapter-05')?.final_choice_pick
if (pickScene) {
  for (let aff = -5; aff <= 10; aff++) {
    const available = (pickScene.choices ?? []).filter((c) => {
      return (c.requirements ?? []).every((req) => {
        if (req.type === 'score' && req.score === 'groomyAffinity') {
          if (req.min != null && aff < req.min) return false
          if (req.max != null && aff > req.max) return false
        }
        return true
      })
    })
    if (available.length === 0) {
      report.affinityGaps.push({ affinity: aff, issue: 'no choice available at final_choice_pick' })
    } else if (available.length > 1) {
      report.affinityGaps.push({ affinity: aff, issue: `overlap: ${available.map((c) => c.next).join(', ')}` })
    }
  }
  // explicit gap between 1 and 2
  for (const aff of [1, 2]) {
    const tier = affinityTiers.find((t) => aff >= t.min && aff <= t.max)
    if (!tier) report.affinityGaps.push({ affinity: aff, issue: 'falls in no tier band' })
  }
}

// ── 2d. Ending resolver exhaustive spot-check ──
const dismantleFlags = [
  [],
  ['dismantledGroomy'],
  ['dismantledGroomy', 'dismantledWithFullKnowledge'],
  ['dismantledGroomy', 'truthExposed'],
  ['dismantledGroomy', 'dismantledWithFullKnowledge', 'truthExposed'],
]
const affinitySamples = [-2, 0, 3, 5, 6, 8]
const mysterySamples = [
  { mysteryEvidence: 0, flags: [] },
  { mysteryEvidence: 8, flags: ['ch3ConcludedHomicide'] },
  { mysteryEvidence: 10, flags: ['ch3ConcludedGroomyLinkedDeath'] },
  { mysteryEvidence: 10, flags: ['ch3WithheldFinalDeduction'] },
  { mysteryEvidence: 8, flags: ['ch3ConcludedHomicide', 'truthExposed', 'groomyStayedClose'] },
]

let resolverChecks = 0
for (const dFlags of dismantleFlags) {
  for (const aff of affinitySamples) {
    for (const mystery of mysterySamples) {
      resolverChecks++
      const state = {
        ...initialGameState,
        flags: [...dFlags, ...mystery.flags],
        scores: { ...initialGameState.scores, groomyAffinity: aff, mysteryEvidence: mystery.mysteryEvidence },
      }
      let ending
      let summary
      try {
        ending = resolveProjectGroomyEnding(state)
        summary = resolveProjectGroomyEndingSummaryKo(state, ending)
      } catch (err) {
        report.endingResolverIssues.push({ state: { dFlags, aff, mystery }, error: String(err) })
        continue
      }
      if (!ending?.id) {
        report.endingResolverIssues.push({ state: { dFlags, aff, mystery }, error: 'resolveProjectGroomyEnding returned no id' })
      }
      if (summary == null || summary === '') {
        report.endingResolverIssues.push({ state: { dFlags, aff, mystery }, error: 'empty summaryKo' })
      }
    }
  }
}

// Verify all 4 ending ids always produce summary
for (const id of ['true', 'normal', 'badA', 'badB']) {
  const ending = PROJECT_GROOMY_ENDINGS[id]
  const state = { ...initialGameState, flags: ['truthExposed'], scores: { groomyAffinity: 6, mysteryEvidence: 8 } }
  const summary = resolveProjectGroomyEndingSummaryKo(state, ending)
  if (!summary) report.endingResolverIssues.push({ error: `PROJECT_GROOMY_ENDINGS.${id} produced empty summary` })
}

// ── 3. Flag consistency ──
const flagsSet = new Set()
const flagsRead = new Set()

function scanFlagsInValue(val, mode) {
  if (val == null) return
  if (typeof val === 'string' && mode === 'read' && val.length > 2) {
    // heuristic: flag-like strings in includes checks handled separately
  }
  if (Array.isArray(val)) {
    for (const item of val) scanFlagsInValue(item, mode)
    return
  }
  if (typeof val === 'object') {
    if (val.type === EffectTypes.ADD_FLAG || val.type === 'addFlag') {
      if (val.flag) flagsSet.add(val.flag)
    }
    for (const [k, v] of Object.entries(val)) scanFlagsInValue(v, mode)
  }
}

for (const chapter of chapters) {
  for (const scene of Object.values(chapter.scenes ?? {})) {
    scanFlagsInValue(scene.effects, 'set')
    scanFlagsInValue(scene.choices, 'set')
    scanFlagsInValue(scene, 'set')
  }
}

// Read sites: grep-like via endings + known engine files — import endings already
const readPatterns = [
  'dismantledGroomy', 'dismantledWithFullKnowledge', 'truthExposed', 'groomyStayedClose',
  'ch3ConcludedHomicide', 'ch3ConcludedGroomyLinkedDeath', 'ch3WithheldFinalDeduction',
  'ch5_perceptionLayerOff', 'ch5_feltBatteryWeight', 'ch5_confirmedGroomyAlone', 'ch5_calledGuardian',
  'ch4_groomyAbandoned', 'witnessedIsolatedHourPlayback', 'glimpsedPriorExecutions',
  'recalledGuardianAraDuringCore', 'ch4_learnedGroomyIsExecutor', 'ch4_groomyKnowsTruth',
]
// Scan all scene requirements for flag reads
for (const chapter of chapters) {
  for (const scene of Object.values(chapter.scenes ?? {})) {
    const json = JSON.stringify(scene)
    for (const flag of flagsSet) {
      if (json.includes(flag)) flagsRead.add(flag)
    }
  }
}

// Also scan endings.js flags
for (const flag of [
  'dismantledGroomy', 'dismantledWithFullKnowledge', 'truthExposed', 'groomyStayedClose',
  'ch3ConcludedHomicide', 'ch3ConcludedGroomyLinkedDeath', 'ch3WithheldFinalDeduction',
]) {
  flagsRead.add(flag)
}

for (const flag of flagsSet) {
  if (!flagLabels[flag]) report.flagsSetNotLabeled.push(flag)
}
for (const flag of Object.keys(flagLabels)) {
  if (!flagsSet.has(flag) && !flagsRead.has(flag)) {
    // many labels are for flags set in other ways — only report recent patch flags
    const recent = /^(ch[345]_|dismantled|witnessed|glimpsed|recalled|ch4_|ch3_)/
    if (recent.test(flag) && !flagsSet.has(flag)) {
      report.flagsLabeledNeverSet.push(flag)
    }
  }
}
for (const flag of flagsSet) {
  if (!flagsRead.has(flag) && !flagLabels[flag]) {
    // still check unlabeled
  }
  if (flagsSet.has(flag) && !flagLabels[flag]) {
    // already in flagsSetNotLabeled
  }
}

// ── Output ──
console.log(JSON.stringify({
  summary: {
    chaptersInspected: chapters.length,
    totalScenes,
    totalEdges: edgeCount,
    resolverChecks,
    flagsSetCount: flagsSet.size,
    flagLabelsCount: Object.keys(flagLabels).length,
  },
  section1: {
    danglingRefs: report.danglingRefs,
    duplicateFullIds: report.duplicateFullIds,
    duplicateLocalIds: report.duplicateLocalIds,
    orphanedScenes: report.orphanedScenes,
  },
  section2: {
    cyclesNoEffect: report.cyclesNoEffect,
    cyclesWithReturnTo: report.cyclesWithReturnTo,
    gatedDeadEnds: report.gatedDeadEnds,
    affinityGaps: report.affinityGaps,
    endingResolverIssues: report.endingResolverIssues,
  },
  section3: {
    flagsSetNotLabeled: report.flagsSetNotLabeled.sort(),
    flagsLabeledNeverSet: report.flagsLabeledNeverSet.sort(),
    allFlagsSet: [...flagsSet].sort(),
  },
}, null, 2))
