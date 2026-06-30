/**
 * Playtime estimator from chapter content + runtime pacing constants.
 * Run: node src/tools/content-build/estimatePlaytime.mjs
 */
import { chapters } from '../../content/chapters/index.js'
import { createMessengerPacingController } from '../../features/messenger/runtime/pacingController.js'
import { getTypewriterDelay } from '../../engine/animation/typewriter.js'
import { SceneModes } from '../../engine/contracts.js'

const INTRO_MS = 1800 + 1600 + 5000 // auto slides + tag + title click (~5s)
const NFC_BOOT_MS = 8000
const CHAPTER_CLEAR_MS = 4500
const CHAPTER_HANDOFF_MS = 2000

const USER = {
  /** Typewriter completes, player taps next */
  normal: { afterLineMs: 1800, afterChoiceMs: 3500, rpgStepMs: 280, rpgInteractMs: 400 },
  /** AUTO mode approx */
  auto: { afterLineMs: 850, afterChoiceMs: 1200, rpgStepMs: 200, rpgInteractMs: 250 },
  /** Aggressive skip */
  fast: { afterLineMs: 400, afterChoiceMs: 800, rpgStepMs: 120, rpgInteractMs: 150 },
}

function lineText(line) {
  return String(line?.text ?? '').trim()
}

function estimateVnScene(scene, profile) {
  const lines = scene.lines ?? []
  let ms = 0
  for (const line of lines) {
    const text = lineText(line)
    if (!text) {
      ms += profile.afterLineMs * 0.3
      continue
    }
    if (line.sfx) {
      ms += (line.autoAdvanceDelay ?? 420) + profile.afterLineMs * 0.2
      continue
    }
    const delay = getTypewriterDelay(text, Boolean(line.important))
    ms += text.length * delay
    if (line.autoAdvance) {
      ms += line.autoAdvanceDelay ?? (line.sfx ? 420 : 650)
    } else {
      ms += profile.afterLineMs
    }
  }
  const choices = scene.choices?.length ?? 0
  ms += choices * profile.afterChoiceMs
  return ms
}

function estimateChatScene(scene, profile) {
  const pacing = createMessengerPacingController(scene.id)
  const lines = scene.lines ?? []
  let ms = 0
  let prevSpeaker = null
  lines.forEach((line, index) => {
    const text = lineText(line)
    const speaker = line.char ?? 'system'
    const showTyping = speaker !== 'system' && speaker !== 'player' && text.length > 0
    if (showTyping) {
      ms += pacing.getTypingDuration({ text, index, emotionalPressure: 0 })
    } else {
      ms += Math.min(280, pacing.getTypingDuration({ text, index, emotionalPressure: 0 }) * 0.18)
    }
    ms += profile.afterLineMs * 0.35
    const same = prevSpeaker === speaker
    ms += same ? 70 : pacing.getDeliveryGap({ index, unstable: false })
    prevSpeaker = speaker
  })
  ms += 220
  const choices = scene.choices?.length ?? 0
  ms += choices * profile.afterChoiceMs
  if (choices) ms += pacing.getChoiceCommitDelay({ unstable: false })
  return ms
}

function estimateRpgHubVisits(scene) {
  // Hub returns after sub-scenes; fast path ~6 interactives + travel
  const returns = scene.returnTo ? 1 : 0
  const subTriggers = (scene.mapId === 'floor5' ? 6 : 2)
  return subTriggers * (USER.normal.rpgStepMs * 8 + USER.normal.rpgInteractMs)
}

function estimateScene(scene, profile) {
  if (!scene) return 0
  switch (scene.mode) {
    case SceneModes.VN:
      return estimateVnScene(scene, profile)
    case SceneModes.CHAT:
      return estimateChatScene(scene, profile)
    case SceneModes.RPG:
      return estimateRpgHubVisits(scene)
    default:
      return 3000
  }
}

function sumChapter(chapter, sceneIds, profile) {
  let ms = 0
  const ids = sceneIds ?? Object.keys(chapter.scenes ?? {})
  for (const id of ids) {
    ms += estimateScene(chapter.scenes[id], profile)
  }
  return ms
}

function formatMin(ms) {
  const sec = Math.round(ms / 1000)
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return s ? `${m}분 ${s}초` : `${m}분`
}

function countTextStats(chapter) {
  let chars = 0
  let lines = 0
  for (const scene of Object.values(chapter.scenes ?? {})) {
    for (const line of scene.lines ?? []) {
      const t = lineText(line)
      if (t) {
        chars += t.length
        lines += 1
      }
    }
  }
  return { chars, lines, scenes: Object.keys(chapter.scenes ?? {}).length }
}

// Minimum route (mirrors fullPlaythrough.test.js main path scene ids)
const minRoute = {
  prologue: [
    'start', 'entrance_bridge', 'lobby_reveal', 'groomy_intro', 'chat_boot', 'after_nickname',
    'search_pocket', 'entrance_tag', 'iseol_intro', 'prologue_complete',
  ],
  'chapter-01': [
    'morning_briefing', 'meeting_room_rpg', 'meeting_chat', 'floor3_vn', 'floor3_rpg',
    'exit_floor3', 'deduction_chat', 'chapter_end',
  ],
  'chapter-02': [
    'arrival_vn', 'signal_vn', 'records_vn', 'floor5_rpg', 'server_panel_chat', 'vault_terminal_chat',
    'guard_chat', 'analyst_chat', 'locker_chat',
    'mirror_clue_vn', 'escalation_vn', 'groomy_debrief', 'ch2_chapter_closing', 'chapter_end',
  ],
  'chapter-03': [
    'ch3_morning_after', 'desk_assignment_vn', 'desk_drawer_rpg', 'resignation_letter_clue',
    'family_photo_clue', 'recorder_found_clue', 'guardian_recall_vn', 'groomy_absence_chat',
    'bathroom_glitch_vn', 'floor3_decision_chat', 'floor3_decision_continue', 'storage_entry_vn',
    'storage_rpg', 'storage_clue_recorder_full', 'body_discovery_vn', 'groomy_comforted_at_body',
    'recorder_playback_vn', 'caretaker_first_contact_chat', 'caretaker_pressed', 'ch3_deduction_chat',
    'ch3_deduction_after_homicide', 'ch3_chapter_closing', 'chapter_end',
  ],
  'chapter-04': [
    'ch4_accusation', 'groomy_gate', 'diary_full', 'caretaker_core_descent', 'truth_revelation',
    'battery_revelation', 'groomy_realization_gate', 'groomy_realization_high', 'ch4_end',
  ],
  'chapter-05': [
    'perception_off', 'office_truth', 'ch5_battery_weight', 'groomy_only_alive', 'guardian_call',
    'final_choice_pick', 'final_choice_high', 'ending_true', 'ch5_end',
  ],
}

// CH2 RPG hub revisits between sub-scenes (floor5_rpg)
const CH2_RPG_MS = 6 * (USER.normal.rpgStepMs * 10 + USER.normal.rpgInteractMs)

const profiles = ['normal', 'auto', 'fast']
const results = {}

for (const profileName of profiles) {
  const profile = USER[profileName]
  let totalMs = NFC_BOOT_MS + INTRO_MS
  const byChapter = {}

  for (const chapter of chapters) {
    const minIds = minRoute[chapter.id]
    let ms = sumChapter(chapter, minIds, profile)
    if (chapter.id === 'chapter-02') ms += CH2_RPG_MS
    ms += CHAPTER_CLEAR_MS + CHAPTER_HANDOFF_MS
    byChapter[chapter.id] = ms
    totalMs += ms
  }

  // All registered scenes (100% content visit — unrealistic upper bound)
  let exploreMs = NFC_BOOT_MS + INTRO_MS
  for (const chapter of chapters) {
    let ms = sumChapter(chapter, null, profile)
    if (chapter.id === 'chapter-02') ms += CH2_RPG_MS * 2
    ms += CHAPTER_CLEAR_MS
    exploreMs += ms
  }

  results[profileName] = { totalMs, byChapter, exploreMs }
}

// Reading-speed fallback (250 CPM Korean prose)
const readingStats = chapters.map((ch) => {
  const s = countTextStats(ch)
  return { id: ch.id, title: ch.title, ...s }
})
const totalChars = readingStats.reduce((a, b) => a + b.chars, 0)
const readOnlyMin = Math.round(totalChars / 250)

console.log('=== Project GROOMY — Playtime Estimate ===\n')
console.log('Method: scene line counts × typewriter/pacing constants + user pause model')
console.log(`Total dialogue characters (all scenes): ${totalChars.toLocaleString()}`)
console.log(`Read-only @ 250 chars/min: ~${readOnlyMin}분 (no UI delays, no choices)\n`)

for (const profileName of profiles) {
  const { totalMs, byChapter, exploreMs } = results[profileName]
  console.log(`--- ${profileName.toUpperCase()} (minimum route / TRUE path) ---`)
  console.log(`Total: ${formatMin(totalMs)} (${(totalMs / 60000).toFixed(1)} min)`)
  for (const chapter of chapters) {
    console.log(`  ${chapter.id}: ${formatMin(byChapter[chapter.id])}`)
  }
  console.log(`  (100% scene catalog): ${formatMin(exploreMs)}\n`)
}

console.log('--- Per-chapter content volume ---')
for (const row of readingStats) {
  console.log(
    `  ${row.id}: ${row.scenes} scenes, ${row.lines} lines, ${row.chars.toLocaleString()} chars (~${Math.round(row.chars / 250)}분 읽기만)`,
  )
}

const firstPlayIds = { ...minRoute }
firstPlayIds['chapter-01'] = Object.keys(chapters.find((c) => c.id === 'chapter-01').scenes)

function sumRoute(routeMap, profile) {
  let ms = NFC_BOOT_MS + INTRO_MS
  for (const chapter of chapters) {
    let chMs = sumChapter(chapter, routeMap[chapter.id], profile)
    if (chapter.id === 'chapter-02') chMs += CH2_RPG_MS * 1.5
    chMs += CHAPTER_CLEAR_MS + CHAPTER_HANDOFF_MS
    ms += chMs
  }
  return ms
}

const firstPlayNormal = sumRoute(firstPlayIds, USER.normal)
const firstPlayRelaxed = sumRoute(firstPlayIds, {
  afterLineMs: 2800,
  afterChoiceMs: 5000,
  rpgStepMs: 350,
  rpgInteractMs: 550,
})

console.log('\n--- FIRST PLAY (TRUE path + full CH1 + CH2 hub) ---')
console.log(`NORMAL pace: ${formatMin(firstPlayNormal)} (${(firstPlayNormal / 60000).toFixed(1)} min)`)
console.log(`Relaxed read (2.8s/line, 5s/choice): ${formatMin(firstPlayRelaxed)} (${(firstPlayRelaxed / 60000).toFixed(1)} min)`)

console.log('\nNotes:')
console.log('- Minimum route = fullPlaythrough.test.js main path (not all optional CH1 branches).')
console.log('- NORMAL = typewriter + ~1.8s/line + ~3.5s/choice; AUTO/FAST = faster advance.')
console.log('- EXPLORE = every registered scene once; CH1 has many optional hubs not in min route.')
console.log('- Add ~15–25% for save menu, profile/clue tabs, VN backlog, wrong-path retries.')
