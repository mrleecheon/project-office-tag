/**
 * Audit groomyAffinity effects (prologue–chapter-03) and simulate path totals at CH4.
 * Run: node src/tools/debug/groomyAffinityAudit.mjs
 */
import { chapterRegistry } from '../../engine/progression/chapterRegistry.js'
import { gameReducer } from '../../engine/state/gameReducer.js'
import { initialGameState } from '../../engine/state/initialState.js'
import { createSceneOrchestrator } from '../../game/runtime/orchestration/sceneOrchestrator.js'
import { resolveChoiceAvailability } from '../../game/transitions/transitionPolicy.js'
import { applyEffects } from '../../engine/state/actions.js'
import { EffectTypes } from '../../engine/contracts.js'

const NICKNAME = '테스터'
const CHAPTER_IDS = ['prologue', 'chapter-01', 'chapter-02', 'chapter-03']

function createRunner(seedState = initialGameState) {
  let state = { ...seedState, screen: 'playing', nickname: seedState.nickname ?? NICKNAME }
  const errors = []
  const dispatch = (action) => { state = gameReducer(state, action) }
  const orchestrator = createSceneOrchestrator({
    dispatch,
    getState: () => state,
    setClearCopy: () => {},
    setNextChapterId: () => {},
    setRuntimeError: (e) => errors.push(e),
  })
  const assertOk = (cond, msg) => { if (!cond) throw new Error(msg) }

  return {
    get state() { return state },
    go(sceneId) {
      assertOk(orchestrator.goToScene(sceneId), `blocked go ${sceneId}`)
      assertOk(errors.length === 0, `error at ${sceneId}`)
    },
    choose(text) {
      const scene = chapterRegistry.getScene(state.activeChapterId, state.activeSceneId)
      const available = resolveChoiceAvailability({ state, choices: scene.choices ?? [] })
      const choice = available.find((c) => c.text === text)
      assertOk(choice, `choice missing "${text}" at ${state.activeChapterId}.${state.activeSceneId}`)
      orchestrator.handleChoice(choice)
      assertOk(errors.length === 0, 'error after choice')
    },
    finishScene() {
      const scene = chapterRegistry.getScene(state.activeChapterId, state.activeSceneId)
      orchestrator.applySceneEffects(scene?.effects)
    },
    done() {
      const scene = chapterRegistry.getScene(state.activeChapterId, state.activeSceneId)
      orchestrator.applySceneEffects(scene?.effects)
      if (scene?.end?.type === 'chapterComplete') {
        orchestrator.completeChapter(chapterRegistry.getChapter(state.activeChapterId), scene.end.nextChapterId)
      }
    },
    enterNextChapter() {
      const next = chapterRegistry.getNextChapter(state.activeChapterId)
      assertOk(next, 'no next chapter')
      orchestrator.enterChapter(next.id)
    },
    inputNickname(next) {
      orchestrator.handleInput({ type: 'nickname', next }, NICKNAME)
    },
    apply(effects) {
      dispatch(applyEffects(effects))
    },
    aff() {
      return state.scores.groomyAffinity ?? 0
    },
  }
}

function collectEffects() {
  const entries = []
  for (const chapterId of CHAPTER_IDS) {
    const chapter = chapterRegistry.getChapter(chapterId)
    for (const [localId, scene] of Object.entries(chapter.scenes)) {
      for (const choice of scene.choices ?? []) {
        for (const effect of choice.effects ?? []) {
          if (effect.type === EffectTypes.ADD_SCORE && effect.score === 'groomyAffinity') {
            entries.push({ chapterId, scene: localId, choice: choice.text, amount: effect.amount })
          }
        }
      }
    }
  }
  return entries
}

function runPrologueCold(rt) {
  rt.go('start'); rt.go('entrance_bridge'); rt.go('lobby_reveal'); rt.go('groomy_intro'); rt.go('chat_boot')
  rt.choose('예?'); rt.inputNickname('after_nickname'); rt.choose('예?'); rt.go('card_key_goal')
  rt.choose('주머니를 뒤진다.'); rt.go('search_pocket')
  rt.choose('입구 문에 사원증을 태그한다.'); rt.go('entrance_tag'); rt.go('iseol_intro')
  rt.choose('잘 부탁드립니다.'); rt.done(); rt.enterNextChapter()
}

function runPrologueNeutralLowAff(rt) {
  rt.go('start'); rt.go('entrance_bridge'); rt.go('lobby_reveal'); rt.go('groomy_intro'); rt.go('chat_boot')
  rt.choose('예?'); rt.inputNickname('after_nickname'); rt.choose('아뇨.'); rt.go('card_key_goal')
  rt.choose('바닥부터 살핀다.'); rt.go('search_floor'); rt.choose('다음 위치를 확인한다.'); rt.go('search_pocket')
  rt.choose('입구 문에 사원증을 태그한다.'); rt.go('entrance_tag'); rt.go('iseol_intro')
  rt.choose('잘 부탁드립니다.'); rt.done(); rt.enterNextChapter()
}

function runCh1Cold(rt) {
  rt.choose('회의부터 잡아 주세요.'); rt.choose('안으로 들어간다.'); rt.go('meeting_room_rpg')
  rt.go('meeting_chat'); rt.choose('전임자 자리 기록을 남긴다.'); rt.choose('사진을 찍어 보관한다.')
  rt.choose('3층 출입 로그를 요청한다.'); rt.choose('내 카드로 직접 인증한다.'); rt.go('direct_card_auth')
  rt.choose('비상계단 화면으로 전환한다.'); rt.go('floor3_vn'); rt.go('floor3_rpg'); rt.go('exit_floor3'); rt.go('deduction_chat')
  rt.choose('그루미의 배터리가 사건의 핵심이다.')
  rt.done(); rt.enterNextChapter()
}

function runCh1BadBOrganic(rt) {
  rt.choose('알겠습니다. 안내 부탁드립니다.'); rt.choose('회의실부터 간다.'); rt.go('meeting_entry')
  rt.choose('안으로 들어간다.'); rt.go('meeting_room_rpg'); rt.go('meeting_chat')
  rt.choose('전임자 자리 기록을 남긴다.'); rt.choose('사진을 찍어 보관한다.'); rt.choose('3층 출입 로그를 요청한다.')
  rt.choose('그루미에게 우회 권한을 맡긴다.'); rt.go('floor3_vn'); rt.go('floor3_rpg'); rt.go('exit_floor3'); rt.go('deduction_chat')
  rt.choose(chapterRegistry.getChapter('chapter-01').scenes.deduction_chat.choices[0].text)
  rt.done(); rt.enterNextChapter()
}

function runCh2Expose(rt, { briefingNeutral = false } = {}) {
  rt.go('arrival_vn')
  rt.choose('3층 출입기록부터 확보한다.')
  rt.go('briefing_chat')
  rt.choose(
    briefingNeutral ? '일단 둘러보고 결정할게요.' : '박서이 흔적을 우선하겠다고 답한다.',
  )
  rt.go('server_panel_chat'); rt.choose('명령 로그를 캡처한다.')
  rt.go('vault_terminal_chat'); rt.choose('원장 전체를 보낸다.')
  rt.go('guard_chat'); rt.choose('누구랑 채팅했는지 직접 물어본다.')
  rt.go('guard_pressed'); rt.finishScene()
  rt.go('analyst_chat'); rt.choose('원본 센서 로그를 내려받는다.')
  rt.go('locker_chat'); rt.choose('규격표를 조용히 챙긴다.')
  rt.go('mirror_clue_vn'); rt.choose('사번 조작을 확정한다.')
  rt.go('mirror_after_spoof'); rt.go('aftermath_chat'); rt.go('groomy_debrief')
  rt.choose('어떻게 아는지 끝까지 알아낼 거예요.')
  rt.go('ch2_chapter_closing'); rt.go('chapter_end'); rt.enterNextChapter()
}

function runCh3Withheld(rt, { askPhotoHand = false } = {}) {
  rt.go('ch3_morning_after'); rt.go('desk_assignment_vn'); rt.go('desk_drawer_rpg'); rt.go('resignation_letter_clue')
  rt.choose('서랍 조사를 계속한다.'); rt.go('family_photo_clue')
  rt.choose(askPhotoHand ? '이 손이 누구 건지 물어본다.' : '조용히 사진을 다시 내려놓는다.')
  if (askPhotoHand) { rt.go('family_photo_followup'); rt.finishScene() } else rt.finishScene()
  rt.go('guardian_recall_vn'); rt.finishScene(); rt.go('groomy_absence_chat')
  rt.choose('그루미한테 무슨 일 있었는지 더 캐묻는다.'); rt.go('groomy_pressed_absence'); rt.finishScene()
  rt.go('bathroom_glitch_vn'); rt.finishScene(); rt.go('floor3_decision_chat')
  rt.choose('아무것도 못 봤다고 한다.'); rt.choose('그래도 3층에 가본다.')
  rt.go('storage_entry_vn'); rt.go('storage_rpg'); rt.go('storage_clue_chair'); rt.finishScene()
  rt.go('storage_clue_idcard'); rt.finishScene(); rt.go('storage_clue_diary'); rt.finishScene()
  rt.go('storage_clue_recorder_full'); rt.finishScene(); rt.go('body_discovery_vn')
  rt.choose('그루미를 다그쳐서 더 캐묻는다.'); rt.go('groomy_pressed_at_body'); rt.finishScene()
  rt.go('caretaker_first_contact_chat'); rt.choose('그루미를 따라 자리를 피한다.'); rt.go('caretaker_avoided'); rt.finishScene()
  rt.go('ch3_deduction_chat'); rt.choose('아직 결론낼 수 없다. 더 알아봐야 한다.')
  rt.go('ch3_deduction_after_withheld'); rt.go('ch3_chapter_closing'); rt.go('chapter_end'); rt.enterNextChapter()
}

function runCh3WarmHomicideR04(rt, opts = {}) {
  const { pressedAbsence = false, reportBodyToCaretaker = false, askPhotoHand = false } = opts
  rt.go('ch3_morning_after'); rt.go('desk_assignment_vn'); rt.go('desk_drawer_rpg'); rt.go('resignation_letter_clue')
  rt.choose('서랍 조사를 계속한다.'); rt.go('family_photo_clue')
  rt.choose(askPhotoHand ? '이 손이 누구 건지 물어본다.' : '조용히 사진을 다시 내려놓는다.')
  if (askPhotoHand) { rt.go('family_photo_followup'); rt.finishScene() } else rt.finishScene()
  rt.go('guardian_recall_vn'); rt.finishScene(); rt.go('groomy_absence_chat')
  if (pressedAbsence) {
    rt.choose('그루미한테 무슨 일 있었는지 더 캐묻는다.'); rt.go('groomy_pressed_absence'); rt.finishScene()
  } else rt.choose('그루미를 안심시킨다.')
  rt.go('bathroom_glitch_vn'); rt.finishScene(); rt.go('floor3_decision_chat')
  rt.choose('아무것도 못 봤다고 한다.'); rt.choose('그래도 3층에 가본다.')
  rt.go('storage_entry_vn'); rt.go('storage_rpg'); rt.go('storage_clue_chair'); rt.finishScene()
  rt.go('storage_clue_idcard'); rt.finishScene(); rt.go('storage_clue_diary'); rt.finishScene()
  rt.go('storage_clue_recorder_full'); rt.finishScene(); rt.go('body_discovery_vn')
  if (reportBodyToCaretaker) {
    rt.choose('CARETAKER에 신고부터 한다.'); rt.go('caretaker_first_contact_chat')
  } else {
    rt.choose('그루미 곁에 조용히 있어준다.'); rt.go('recorder_playback_vn'); rt.finishScene(); rt.go('caretaker_first_contact_chat')
  }
  rt.choose('CARETAKER에게 박서이의 죽음에 대해 직접 묻는다.'); rt.go('ch3_deduction_chat')
  rt.choose('타살이다. 누군가가 박서이를 죽였다.'); rt.go('ch3_deduction_after_homicide')
  rt.go('ch3_chapter_closing'); rt.go('chapter_end'); rt.enterNextChapter()
}

function simulate(name, fn) {
  const rt = createRunner()
  fn(rt)
  return { name, affinity: rt.aff() }
}

console.log('=== All groomyAffinity choice effects (prologue–CH3) ===\n')
for (const e of collectEffects()) {
  console.log(`${e.chapterId.padEnd(12)} ${e.scene.padEnd(28)} ${String(e.amount).padStart(3)}  ${e.choice.slice(0, 55)}`)
}

const pos = collectEffects().filter((e) => e.amount > 0)
const neg = collectEffects().filter((e) => e.amount < 0)
console.log('\n=== Effect inventory ===')
console.log('Positive:', [...new Set(pos.map((e) => e.amount))].sort((a, b) => a - b).map((v) => `${v}(×${pos.filter((e) => e.amount === v).length})`).join(', '))
console.log('Negative:', [...new Set(neg.map((e) => e.amount))].sort((a, b) => a - b).map((v) => `${v}(×${neg.filter((e) => e.amount === v).length})`).join(', '))

console.log('\n=== Path affinity at CH4 entry (before any CH4 effects) ===\n')
const paths = [
  ['original-cold (예?×2·CH1 cold·CH2 expose·CH3 withheld)', (rt) => {
    runPrologueCold(rt); runCh1Cold(rt); runCh2Expose(rt, { briefingNeutral: true }); runCh3Withheld(rt)
  }],
  ['R04-current sim', (rt) => {
    runPrologueNeutralLowAff(rt); runCh1BadBOrganic(rt); runCh2Expose(rt, { briefingNeutral: true })
    runCh3WarmHomicideR04(rt, { pressedAbsence: true, reportBodyToCaretaker: true, askPhotoHand: true })
  }],
  ['R08-current sim', (rt) => {
    runPrologueNeutralLowAff(rt); runCh1BadBOrganic(rt); runCh2Expose(rt, { briefingNeutral: true })
    runCh3Withheld(rt, { askPhotoHand: true })
  }],
  ['R06 sim', (rt) => {
    runPrologueCold(rt); runCh1Cold(rt); runCh2Expose(rt, { briefingNeutral: true }); runCh3Withheld(rt)
  }],
]

for (const [name, fn] of paths) {
  const r = simulate(name, fn)
  console.log(`${r.name}: affinity = ${r.affinity}`)
}
