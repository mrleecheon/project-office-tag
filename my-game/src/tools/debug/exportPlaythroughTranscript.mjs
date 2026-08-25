/**
 * Main-route playthrough transcript for external review (Claude, etc.).
 * Mirrors fullPlaythrough.test.js main path through all chapters → TRUE ending.
 *
 * Run: node src/tools/debug/exportPlaythroughTranscript.mjs
 * Output: docs/full-playthrough-transcript.txt
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chapters } from '../../content/chapters/index.js'
import { resolveLineText } from '../../content/manifests/text.js'
import { characters } from '../../content/world/characters.js'
import { SceneModes } from '../../engine/contracts.js'
import { chapterRegistry } from '../../engine/progression/chapterRegistry.js'
import { resolveChapterClearCopy, resolveProjectGroomyEnding } from '../../engine/progression/endings.js'
import { applyEffects } from '../../engine/state/actions.js'
import { gameReducer } from '../../engine/state/gameReducer.js'
import { initialGameState } from '../../engine/state/initialState.js'
import { createSceneOrchestrator } from '../../game/runtime/orchestration/sceneOrchestrator.js'
import { resolveChoiceAvailability } from '../../game/transitions/transitionPolicy.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(__dirname, '../../../docs/full-playthrough-transcript.txt')
const NICKNAME = '테스터'

const lines = []
let lastLoggedSceneKey = ''

function push(...parts) {
  for (const part of parts) lines.push(part)
}

function speakerLabel(charId, state) {
  if (charId === 'player') return state.nickname || characters.player?.name || '나'
  return characters[charId]?.name ?? charId
}

function lineContext(state) {
  return {
    nickname: state.nickname,
    scores: state.scores,
    flags: state.flags,
    inventory: state.inventory,
  }
}

function logScene(state) {
  const sceneKey = `${state.activeChapterId}.${state.activeSceneId}`
  if (sceneKey === lastLoggedSceneKey) return
  lastLoggedSceneKey = sceneKey

  const chapter = chapterRegistry.getChapter(state.activeChapterId)
  const scene = chapterRegistry.getScene(state.activeChapterId, state.activeSceneId)
  const chapterLabel = chapter?.title ?? state.activeChapterId

  push('')
  push('═'.repeat(72))
  push(`[${chapter?.label ?? state.activeChapterId}] ${chapterLabel}`)
  push(`씬: ${scene.localId} · 모드: ${scene.mode}`)
  if (scene.systemMessage) push(`시스템: ${scene.systemMessage}`)

  if (scene.mode === SceneModes.RPG) {
    const map = chapter?.maps?.[scene.mapId]
    push(`[RPG 탐색] ${map?.label ?? scene.mapId}`)
    return
  }

  if (scene.mode === SceneModes.END) {
    push('[엔딩 씬]')
  }

  const ctx = lineContext(state)
  for (const line of scene.lines ?? []) {
    const text = resolveLineText(line, ctx).trim()
    if (!text) continue
    if (line.isNarration || line.char === 'system') {
      for (const paragraph of text.split(/\n+/)) {
        push(`  · ${paragraph}`)
      }
    } else {
      push(`  ${speakerLabel(line.char, state)}: ${text}`)
    }
  }

  const available = resolveChoiceAvailability({ state, choices: scene.choices ?? [] })
  if (available.length) {
    push('  ─ 선택지 ─')
    for (const choice of available) {
      push(`    ○ ${choice.text}`)
    }
  }
}

function logChapterClear(chapterId, state) {
  const copy = resolveChapterClearCopy(chapterId, state)
  push('')
  push('─'.repeat(72))
  push(`[챕터 클리어] ${copy.kicker}`)
  push(`${copy.title}`)
  push(copy.body)
  if (copy.sub) push(copy.sub)
  push('─'.repeat(72))
}

function createRuntime(seedState = initialGameState) {
  let state = { ...seedState, screen: 'playing' }
  const errors = []

  const dispatch = (action) => {
    state = gameReducer(state, action)
  }

  const orchestrator = createSceneOrchestrator({
    dispatch,
    getState: () => state,
    setClearCopy: () => {},
    setNextChapterId: () => {},
    setRuntimeError: (error) => errors.push(error),
  })

  function assertOk(ok, message) {
    if (!ok) throw new Error(`${message}: ${JSON.stringify(errors)}`)
  }

  return {
    get state() {
      return state
    },
    go(sceneId) {
      const ok = orchestrator.goToScene(sceneId)
      assertOk(ok, `blocked at ${state.activeChapterId}.${sceneId}`)
      assertOk(errors.length === 0, `runtime error at ${sceneId}`)
      logScene(state)
      return state
    },
    choose(choiceText) {
      const scene = chapterRegistry.getScene(state.activeChapterId, state.activeSceneId)
      const available = resolveChoiceAvailability({ state, choices: scene.choices ?? [] })
      const choice = available.find((entry) => entry.text === choiceText)
      if (!choice) {
        throw new Error(`choice not available "${choiceText}" in ${state.activeChapterId}.${state.activeSceneId}`)
      }
      push(`  ▶ 선택: ${choiceText}`)
      orchestrator.handleChoice(choice)
      assertOk(errors.length === 0, 'runtime error after choice')
      logScene(state)
      return state
    },
    finishScene() {
      const scene = chapterRegistry.getScene(state.activeChapterId, state.activeSceneId)
      orchestrator.applySceneEffects(scene?.effects)
      push(`  ▶ 조사 완료 → ${scene.returnTo ?? '다음'}`)
      return state
    },
    done(nextSceneId) {
      const scene = chapterRegistry.getScene(state.activeChapterId, state.activeSceneId)
      orchestrator.applySceneEffects(scene?.effects)
      if (scene?.end?.type === 'chapterComplete') {
        orchestrator.completeChapter(
          chapterRegistry.getChapter(state.activeChapterId),
          scene.end.nextChapterId,
        )
        logChapterClear(state.activeChapterId, state)
        return state
      }
      if (nextSceneId) orchestrator.goToScene(nextSceneId)
      if (nextSceneId) logScene(state)
      return state
    },
    enterNextChapter() {
      const next = chapterRegistry.getNextChapter(state.activeChapterId)
      if (!next) throw new Error(`no next chapter after ${state.activeChapterId}`)
      push('')
      push(`▶▶▶ ${next.label} (${next.title}) 진입`)
      orchestrator.enterChapter(next.id)
      logScene(state)
      return state
    },
    inputNickname(nextSceneId) {
      push(`  ▶ 닉네임 입력: ${NICKNAME}`)
      orchestrator.handleInput({ type: 'nickname', next: nextSceneId }, NICKNAME)
      assertOk(errors.length === 0, 'runtime error after nickname')
      logScene(state)
      return state
    },
  }
}

function runMainRoute() {
  const rt = createRuntime()

  push('# 프로젝트 그루미 — 전 챕터 메인 루트 진행 텍스트')
  push(`# 생성: ${new Date().toISOString()}`)
  push(`# 닉네임: ${NICKNAME}`)
  push(`# 챕터: ${chapters.map((c) => c.id).join(' → ')}`)
  push(`# 엔딩 목표: TRUE END (fullPlaythrough.test.js 메인 경로)`)
  push('')

  // Prologue → CH1
  rt.go('start')
  rt.go('entrance_bridge')
  rt.go('lobby_reveal')
  rt.go('groomy_intro')
  rt.go('chat_boot')
  rt.choose('네. 처음 왔어요.')
  rt.inputNickname('after_nickname')
  rt.choose('네.')
  rt.choose('주머니를 뒤진다.')
  rt.go('search_pocket')
  rt.choose('입구 문에 사원증을 태그한다.')
  rt.go('entrance_tag')
  rt.go('iseol_intro')
  rt.choose('잘 부탁드립니다.')
  rt.done()
  rt.enterNextChapter()

  // CH1
  rt.choose('알겠습니다. 안내 부탁드립니다.')
  rt.done('office7_rpg')
  rt.go('meeting_entry')
  rt.choose('안으로 들어간다.')
  rt.go('meeting_room_rpg')
  rt.go('meeting_chat')
  rt.choose('전임자 자리 기록을 남긴다.')
  rt.choose('사진을 찍어 보관한다.')
  rt.choose('3층 출입 로그를 요청한다.')
  rt.choose('그루미에게 우회 권한을 맡긴다.')
  rt.go('floor3_vn')
  rt.go('floor3_rpg')
  rt.go('exit_floor3')
  rt.go('deduction_chat')
  rt.choose(`${chapterRegistry.getChapter('chapter-01').scenes.deduction_chat.choices[0].text}`)
  rt.done()
  rt.enterNextChapter()

  // CH2
  rt.go('arrival_vn')
  rt.go('signal_vn')
  rt.go('records_vn')
  rt.choose('일단 둘러보고 결정할게요.')
  rt.go('server_panel_chat')
  rt.finishScene()
  rt.go('vault_terminal_chat')
  rt.finishScene()
  rt.go('guard_chat')
  rt.choose('그루미에게 로그 복구를 부탁한다.')
  rt.finishScene()
  rt.go('analyst_chat')
  rt.finishScene()
  rt.go('locker_chat')
  rt.finishScene()
  rt.go('mirror_clue_vn')
  rt.choose('판단을 보류하고 후퇴한다.')
  rt.go('mirror_after_withhold')
  rt.go('escalation_vn')
  rt.go('groomy_debrief')
  rt.choose('괜찮아요, 그루미. 천천히 말해도 돼요.')
  rt.go('ch2_chapter_closing')
  rt.go('chapter_end')
  rt.enterNextChapter()

  // CH3
  rt.go('ch3_morning_after')
  rt.go('desk_assignment_vn')
  rt.go('desk_drawer_rpg')
  rt.go('resignation_letter_clue')
  rt.choose('서랍 조사를 계속한다.')
  rt.go('family_photo_clue')
  rt.choose('조용히 사진을 다시 내려놓는다.')
  rt.finishScene()
  rt.go('guardian_recall_vn')
  rt.finishScene()
  rt.go('groomy_absence_chat')
  rt.choose('그루미를 안심시킨다.')
  rt.go('bathroom_glitch_vn')
  rt.finishScene()
  rt.go('floor3_decision_chat')
  rt.choose('아무것도 못 봤다고 한다.')
  rt.choose('그래도 3층에 가본다.')
  rt.go('storage_entry_vn')
  rt.go('storage_rpg')
  rt.go('storage_clue_chair')
  rt.finishScene()
  rt.go('storage_clue_idcard')
  rt.finishScene()
  rt.go('storage_clue_recorder_full')
  rt.finishScene()
  rt.go('body_discovery_vn')
  rt.choose('그루미 곁에 조용히 있어준다.')
  rt.go('recorder_playback_vn')
  rt.finishScene()
  rt.go('caretaker_first_contact_chat')
  rt.choose('CARETAKER에게 박서이의 죽음에 대해 직접 묻는다.')
  rt.go('ch3_deduction_chat')
  rt.choose('타살이다. 누군가가 박서이를 죽였다.')
  rt.go('ch3_chapter_closing')
  rt.go('chapter_end')
  rt.enterNextChapter()

  // CH4
  rt.go('ch4_accusation')
  rt.go('groomy_gate')
  rt.choose('그루미가 로그를 덮어준다.')
  rt.go('diary_full')
  rt.go('caretaker_core_descent')
  rt.go('truth_revelation')
  rt.finishScene()
  rt.go('battery_revelation')
  rt.go('groomy_realization_gate')
  rt.choose('그루미의 반응을 듣는다.')
  rt.go('groomy_realization_high')
  rt.go('ch4_end')
  rt.enterNextChapter()

  // CH5 → TRUE
  rt.go('perception_off')
  rt.go('office_truth')
  rt.go('ch5_battery_weight')
  rt.go('groomy_only_alive')
  rt.go('guardian_call')
  rt.go('final_choice_pick')
  rt.choose('그루미의 말을 듣는다.')
  rt.go('final_choice_high')
  rt.choose('안 해. 같이 나가자.')
  rt.go('ending_true')
  rt.choose('대답하지 않고 걷는다.')
  rt.go('ch5_end')

  const ending = resolveProjectGroomyEnding(rt.state)
  push('')
  push('═'.repeat(72))
  push('[플레이 완료]')
  push(`엔딩: ${ending.titleKo ?? ending.title} (${ending.id})`)
  push(ending.summaryKo ?? ending.summary)
  push('')
  push('[최종 스탯]')
  push(`  그루미 관계도: ${rt.state.scores.groomyAffinity ?? 0}`)
  push(`  의심 증거: ${rt.state.scores.mysteryEvidence ?? 0}`)
  push(`  배터리 압박: ${rt.state.scores.batteryDesperation ?? 0}`)
  push(`  회사 의심: ${rt.state.scores.corporateSuspicion ?? 0}`)
  push('')
  push(`[플래그 ${rt.state.flags.length}개] ${rt.state.flags.join(', ') || '(없음)'}`)
  push(`[인벤토리 ${rt.state.inventory.length}개] ${rt.state.inventory.join(', ') || '(없음)'}`)
  push(`[방문 씬 ${rt.state.visitedScenes?.length ?? 0}개]`)
}

async function main() {
  runMainRoute()
  await fs.mkdir(path.dirname(OUT), { recursive: true })
  const text = `${lines.join('\n')}\n`
  await fs.writeFile(OUT, text, 'utf8')
  const kb = (Buffer.byteLength(text, 'utf8') / 1024).toFixed(1)
  console.log(`[playthrough] ${OUT}`)
  console.log(`  ${lines.length} lines, ${kb} KB`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
