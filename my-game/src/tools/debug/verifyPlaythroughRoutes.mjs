/**
 * Post-rewrite multi-route test play (no legacy simulator paths).
 * Run: node src/tools/debug/verifyPlaythroughRoutes.mjs
 */
import { chapterRegistry } from '../../engine/progression/chapterRegistry.js'
import { resolveProjectGroomyEnding } from '../../engine/progression/endings.js'
import { gameReducer } from '../../engine/state/gameReducer.js'
import { initialGameState } from '../../engine/state/initialState.js'
import { applyEffects } from '../../engine/state/actions.js'
import { createSceneOrchestrator } from '../../game/runtime/orchestration/sceneOrchestrator.js'
import { resolveChoiceAvailability } from '../../game/transitions/transitionPolicy.js'

const NICK = '테스터'

function createRunner(label) {
  let state = { ...initialGameState, screen: 'playing', nickname: NICK }
  const errors = []
  const steps = []
  const dispatch = (action) => { state = gameReducer(state, action) }
  const orch = createSceneOrchestrator({
    dispatch,
    getState: () => state,
    setClearCopy: () => {},
    setNextChapterId: () => {},
    setRuntimeError: (e) => errors.push(e),
  })

  const fail = (msg) => {
    throw new Error(`[${label}] ${msg}${errors.length ? ` errors=${JSON.stringify(errors)}` : ''}`)
  }

  return {
    get state() { return state },
    get errors() { return errors },
    get steps() { return steps },
    log(msg) { steps.push(msg) },
    go(id) {
      steps.push(`go ${state.activeChapterId}.${id}`)
      if (!orch.goToScene(id)) fail(`blocked go ${id}`)
      if (errors.length) fail(`runtime at ${id}`)
    },
    choose(text) {
      const scene = chapterRegistry.getScene(state.activeChapterId, state.activeSceneId)
      const c = resolveChoiceAvailability({ state, choices: scene.choices ?? [] }).find((x) => x.text === text)
      if (!c) {
        const avail = resolveChoiceAvailability({ state, choices: scene.choices ?? [] }).map((x) => x.text)
        fail(`choice missing "${text}" at ${state.activeChapterId}.${state.activeSceneId} avail=${JSON.stringify(avail)}`)
      }
      steps.push(`choose ${JSON.stringify(text)}`)
      orch.handleChoice(c)
      if (errors.length) fail(`after choice "${text}"`)
    },
    finishScene() {
      const scene = chapterRegistry.getScene(state.activeChapterId, state.activeSceneId)
      orch.applySceneEffects(scene?.effects)
      if (errors.length) fail('finishScene')
    },
    done() {
      const scene = chapterRegistry.getScene(state.activeChapterId, state.activeSceneId)
      orch.applySceneEffects(scene?.effects)
      if (scene?.end?.type === 'chapterComplete') {
        orch.completeChapter(chapterRegistry.getChapter(state.activeChapterId), scene.end.nextChapterId)
      }
      if (errors.length) fail('done')
    },
    nextCh() {
      const next = chapterRegistry.getNextChapter(state.activeChapterId)
      if (!next) fail('no next chapter')
      orch.enterChapter(next.id)
      steps.push(`enter ${next.id}`)
      if (errors.length) fail('enterChapter')
    },
    nickname() {
      orch.handleInput({ type: 'nickname', next: 'after_nickname' }, NICK)
    },
    apply(effects) {
      dispatch(applyEffects(effects))
    },
  }
}

function runPrologueWarm(rt) {
  rt.go('start'); rt.go('entrance_bridge'); rt.go('lobby_reveal'); rt.go('groomy_intro'); rt.go('chat_boot')
  rt.choose('네. 처음 왔어요.'); rt.nickname(); rt.choose('네.')
  rt.go('card_key_goal'); rt.choose('주머니를 뒤진다.'); rt.go('search_pocket')
  rt.choose('입구 문에 사원증을 태그한다.'); rt.go('entrance_tag'); rt.go('iseol_intro')
  rt.choose('잘 부탁드립니다.'); rt.done(); rt.nextCh()
}

function runPrologueCold(rt) {
  rt.go('start'); rt.go('entrance_bridge'); rt.go('lobby_reveal'); rt.go('groomy_intro'); rt.go('chat_boot')
  rt.choose('예?'); rt.nickname(); rt.choose('예?')
  rt.go('card_key_goal'); rt.choose('주머니를 뒤진다.'); rt.go('search_pocket')
  rt.choose('입구 문에 사원증을 태그한다.'); rt.go('entrance_tag'); rt.go('iseol_intro')
  rt.choose('잘 부탁드립니다.'); rt.done(); rt.nextCh()
}

function runCh1BadBOrganic(rt) {
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
  rt.go('floor3_vn'); rt.go('floor3_rpg'); rt.go('exit_floor3'); rt.go('deduction_chat')
  rt.choose(chapterRegistry.getChapter('chapter-01').scenes.deduction_chat.choices[0].text)
  rt.done(); rt.nextCh()
}

function runCh1Warm(rt) {
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
  rt.go('floor3_vn'); rt.go('floor3_rpg'); rt.go('exit_floor3'); rt.go('deduction_chat')
  rt.choose(chapterRegistry.getChapter('chapter-01').scenes.deduction_chat.choices[0].text)
  rt.done(); rt.nextCh()
}

function runCh1Cold(rt) {
  rt.choose('회의부터 잡아 주세요.')
  rt.choose('안으로 들어간다.')
  rt.go('meeting_room_rpg')
  rt.go('meeting_chat')
  rt.choose('전임자 자리 기록을 남긴다.')
  rt.choose('사진을 찍어 보관한다.')
  rt.choose('3층 출입 로그를 요청한다.')
  rt.choose('내 카드로 직접 인증한다.')
  rt.go('direct_card_auth')
  rt.go('floor3_vn'); rt.go('floor3_rpg'); rt.go('exit_floor3'); rt.go('deduction_chat')
  rt.choose('그루미의 배터리가 사건의 핵심이다.')
  rt.done(); rt.nextCh()
}

function runPrologueNeutralLow(rt) {
  rt.go('start'); rt.go('entrance_bridge'); rt.go('lobby_reveal'); rt.go('groomy_intro'); rt.go('chat_boot')
  rt.choose('예?'); rt.nickname(); rt.choose('아뇨.')
  rt.go('card_key_goal'); rt.choose('바닥부터 살핀다.'); rt.go('search_floor')
  rt.choose('다음 위치를 확인한다.'); rt.go('search_pocket')
  rt.choose('입구 문에 사원증을 태그한다.'); rt.go('entrance_tag'); rt.go('iseol_intro')
  rt.choose('잘 부탁드립니다.'); rt.done(); rt.nextCh()
}

function runCh2Warm(rt) {
  rt.go('arrival_vn')
  rt.choose('전임자 접속 로그부터 확인한다.')
  rt.go('briefing_chat')
  rt.choose('일단 둘러보고 결정할게요.')
  rt.go('server_panel_chat'); rt.choose('명령 로그를 캡처한다.')
  rt.go('vault_terminal_chat'); rt.choose('원장 전체를 보낸다.')
  rt.go('guard_chat'); rt.choose('그루미에게 로그 복구를 부탁한다.')
  rt.go('guard_log_recovered'); rt.finishScene()
  rt.go('analyst_chat'); rt.choose('원본 센서 로그를 내려받는다.')
  rt.go('locker_chat'); rt.choose('규격표를 조용히 챙긴다.')
  rt.go('mirror_clue_vn'); rt.choose('판단을 보류하고 후퇴한다.')
  rt.go('mirror_after_withhold'); rt.go('aftermath_chat'); rt.go('groomy_debrief')
  rt.choose('괜찮아요, 그루미. 천천히 말해도 돼요.')
  rt.go('ch2_chapter_closing'); rt.go('chapter_end'); rt.nextCh()
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
  rt.go('ch2_chapter_closing'); rt.go('chapter_end'); rt.nextCh()
}

function runCh3WarmHomicide(rt, { pressedAbsence = false, reportBodyToCaretaker = false, askPhotoHand = false } = {}) {
  rt.go('ch3_morning_after'); rt.go('desk_assignment_vn'); rt.go('desk_drawer_rpg'); rt.go('resignation_letter_clue')
  rt.choose('서랍 조사를 계속한다.'); rt.go('family_photo_clue')
  rt.choose(askPhotoHand ? '이 손이 누구 건지 물어본다.' : '조용히 사진을 다시 내려놓는다.')
  if (askPhotoHand) { rt.go('family_photo_followup'); rt.finishScene() } else { rt.finishScene() }
  rt.go('guardian_recall_vn'); rt.finishScene(); rt.go('groomy_absence_chat')
  if (pressedAbsence) {
    rt.choose('그루미한테 무슨 일 있었는지 더 캐묻는다.')
    rt.go('groomy_pressed_absence'); rt.finishScene()
  } else {
    rt.choose('그루미를 안심시킨다.')
  }
  rt.go('bathroom_glitch_vn'); rt.finishScene(); rt.go('floor3_decision_chat')
  rt.choose('아무것도 못 봤다고 한다.'); rt.choose('그래도 3층에 가본다.')
  rt.go('storage_entry_vn'); rt.go('storage_rpg')
  rt.go('storage_clue_chair'); rt.finishScene()
  rt.go('storage_clue_idcard'); rt.finishScene()
  rt.go('storage_clue_diary'); rt.finishScene()
  rt.go('storage_clue_recorder_full'); rt.finishScene()
  rt.go('body_discovery_vn')
  if (reportBodyToCaretaker) {
    rt.choose('CARETAKER에 신고부터 한다.'); rt.go('caretaker_first_contact_chat')
  } else {
    rt.choose('그루미 곁에 조용히 있어준다.')
    rt.go('recorder_playback_vn'); rt.finishScene()
    rt.go('caretaker_first_contact_chat')
  }
  rt.choose('CARETAKER에게 박서이의 죽음에 대해 직접 묻는다.'); rt.go('ch3_deduction_chat')
  rt.choose('타살이다. 누군가가 박서이를 죽였다.'); rt.go('ch3_deduction_after_homicide')
  rt.go('ch3_chapter_closing'); rt.go('chapter_end'); rt.nextCh()
}

function runCh3Withheld(rt) {
  rt.go('ch3_morning_after'); rt.go('desk_assignment_vn'); rt.go('desk_drawer_rpg'); rt.go('resignation_letter_clue')
  rt.choose('서랍 조사를 계속한다.'); rt.go('family_photo_clue')
  rt.choose('조용히 사진을 다시 내려놓는다.'); rt.finishScene()
  rt.go('guardian_recall_vn'); rt.finishScene(); rt.go('groomy_absence_chat')
  rt.choose('그루미한테 무슨 일 있었는지 더 캐묻는다.')
  rt.go('groomy_pressed_absence'); rt.finishScene()
  rt.go('bathroom_glitch_vn'); rt.finishScene(); rt.go('floor3_decision_chat')
  rt.choose('아무것도 못 봤다고 한다.'); rt.choose('그래도 3층에 가본다.')
  rt.go('storage_entry_vn'); rt.go('storage_rpg')
  rt.go('storage_clue_chair'); rt.finishScene()
  rt.go('storage_clue_idcard'); rt.finishScene()
  rt.go('storage_clue_diary'); rt.finishScene()
  rt.go('storage_clue_recorder_full'); rt.finishScene()
  rt.go('body_discovery_vn')
  rt.choose('그루미를 다그쳐서 더 캐묻는다.')
  rt.go('groomy_pressed_at_body'); rt.finishScene()
  rt.go('caretaker_first_contact_chat')
  rt.choose('그루미를 따라 자리를 피한다.'); rt.go('caretaker_avoided'); rt.finishScene()
  rt.go('ch3_deduction_chat')
  rt.choose('아직 결론낼 수 없다. 더 알아봐야 한다.')
  rt.go('ch3_deduction_after_withheld')
  rt.go('ch3_chapter_closing'); rt.go('chapter_end'); rt.nextCh()
}

function runCh4Shield(rt, { isolatedHour = false } = {}) {
  rt.go('ch4_accusation'); rt.go('groomy_gate')
  rt.choose('그루미가 로그를 덮어준다.')
  rt.go('diary_full'); rt.go('caretaker_core_descent'); rt.go('guardian_ara_interlude')
  rt.go('truth_revelation'); rt.finishScene(); rt.go('truth_revelation_after')
  if (isolatedHour) {
    rt.choose('격리된 1시간 백업을 재생한다.')
    rt.go('isolated_hour_playback')
  } else {
    rt.choose('넘어간다.')
  }
  rt.go('battery_revelation'); rt.go('groomy_realization_gate')
  rt.choose('그루미의 반응을 듣는다.')
  rt.go('groomy_realization_high'); rt.go('ch4_closing'); rt.go('ch4_end'); rt.nextCh()
}

function runCh4Archive(rt) {
  rt.go('archive_room_infiltration')
  rt.choose('화면을 위로 더 확인한다.')
  rt.go('archive_room_prior_logs')
  rt.go('archive_room_caught')
}

function runCh4Hint(rt, { enterCh5 = true } = {}) {
  runCh4Archive(rt)
  rt.go('ch4_accusation'); rt.go('groomy_gate')
  rt.choose('그루미가 단서 위치만 알려준다.')
  rt.go('groomy_hint')
  rt.go('diary_full'); rt.go('caretaker_core_descent'); rt.go('guardian_ara_interlude')
  rt.go('truth_revelation'); rt.finishScene(); rt.go('truth_revelation_after')
  rt.choose('넘어간다.')
  rt.go('battery_revelation'); rt.go('groomy_realization_gate')
  rt.choose('그루미의 반응을 듣는다.')
  {
    const aff = rt.state.scores.groomyAffinity ?? 0
    const realization = aff <= 1 ? 'groomy_realization_low' : aff <= 4 ? 'groomy_realization_mid' : 'groomy_realization_high'
    rt.go(realization)
  }
  rt.go('ch4_closing'); rt.go('ch4_end')
  if (enterCh5) rt.nextCh()
}

function runCh4Abandon(rt) {
  rt.go('ch4_accusation'); rt.go('groomy_gate')
  rt.choose('그루미가 침묵한다.')
  rt.finishScene()
  rt.go('ch4_bad_closing'); rt.go('ch4_end_bad')
}

function runCh5True(rt) {
  rt.go('perception_off'); rt.go('office_truth'); rt.go('ch5_battery_weight')
  rt.go('groomy_only_alive'); rt.go('guardian_call'); rt.go('final_choice_pick')
  rt.choose('그루미의 말을 듣는다.'); rt.go('final_choice_high')
  rt.choose('안 해. 같이 나가자.'); rt.go('ending_true')
  rt.choose('대답하지 않고 걷는다.'); rt.go('ending_true_silent_walk')
  rt.go('ch5_closing'); rt.go('ch5_end')
}

function runCh5BadB(rt) {
  rt.go('perception_off'); rt.go('office_truth'); rt.go('ch5_battery_weight')
  rt.go('groomy_only_alive'); rt.go('guardian_call'); rt.go('final_choice_pick')
  rt.choose('그루미를 바라본다.'); rt.go('final_choice_low')
  rt.go('ending_badB'); rt.go('ch5_closing'); rt.go('ch5_end')
}

function runCh5BadA(rt) {
  rt.go('perception_off'); rt.go('office_truth'); rt.go('ch5_battery_weight')
  rt.go('groomy_only_alive'); rt.go('guardian_call'); rt.go('final_choice_pick')
  rt.choose('그루미의 말을 듣는다.'); rt.go('final_choice_high')
  rt.choose('미안해. 부품을 꺼낼게.'); rt.go('ending_badA')
  rt.go('ch5_closing'); rt.go('ch5_end')
}

const routes = [
  {
    id: 'TRUE-warm',
    run: (rt) => {
      runPrologueWarm(rt); runCh1Warm(rt); runCh2Warm(rt)
      runCh3WarmHomicide(rt); runCh4Shield(rt, { isolatedHour: true })
      runCh5True(rt)
    },
    expectEnding: 'true',
  },
  {
    id: 'badB-organic',
    run: (rt) => {
      runPrologueNeutralLow(rt)
      runCh1BadBOrganic(rt)
      runCh2Expose(rt, { briefingNeutral: true })
      runCh3WarmHomicide(rt, {
        pressedAbsence: true,
        reportBodyToCaretaker: true,
        askPhotoHand: true,
      })
      const affCh4 = rt.state.scores.groomyAffinity ?? 0
      if (affCh4 !== 1) throw new Error(`CH4 entry aff expected 1 got ${affCh4}`)
      runCh4Hint(rt)
      runCh5BadB(rt)
    },
    expectEnding: 'badB',
  },
  {
    id: 'CH4-abandon-cold',
    run: (rt) => {
      runPrologueCold(rt); runCh1Cold(rt); runCh2Expose(rt)
      runCh3Withheld(rt); runCh4Abandon(rt)
    },
    expectScene: 'ch4_end_bad',
  },
  {
    id: 'badA-warm',
    run: (rt) => {
      runPrologueWarm(rt); runCh1Warm(rt); runCh2Warm(rt)
      runCh3WarmHomicide(rt); runCh4Shield(rt)
      runCh5BadA(rt)
    },
    expectEnding: 'badA',
  },
  {
    id: 'CH1-office-tour-7F',
    run: (rt) => {
      runPrologueWarm(rt)
      rt.choose('알겠습니다. 안내 부탁드립니다.')
      rt.choose('7층을 직접 걸으며 단서를 찾는다.')
      rt.go('floor7_rpg')
      rt.go('flavor_board')
      rt.choose('포스터 날짜를 사진으로 남긴다.')
      rt.go('floor7_rpg')
      rt.choose('← 안내 구역으로 돌아간다')
      rt.go('ch1_floor7_leave')
      rt.choose('회의실 쪽을 확인한다.')
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
      rt.choose(chapterRegistry.getChapter('chapter-01').scenes.deduction_chat.choices[0].text)
      rt.done()
    },
    expectChapter: 'chapter-01',
    expectScene: 'chapter_end',
  },
]

const results = []
let failed = 0

for (const route of routes) {
  const rt = createRunner(route.id)
  try {
    route.run(rt)
    const ending = resolveProjectGroomyEnding(rt.state).id
    const aff = rt.state.scores.groomyAffinity ?? 0
    if (route.expectEnding && ending !== route.expectEnding) {
      throw new Error(`ending expected ${route.expectEnding} got ${ending}`)
    }
    if (route.expectScene && rt.state.activeSceneId !== route.expectScene) {
      throw new Error(`scene expected ${route.expectScene} got ${rt.state.activeSceneId}`)
    }
    if (route.expectAffMax != null && aff > route.expectAffMax) {
      throw new Error(`affinity ${aff} > max ${route.expectAffMax}`)
    }
    if (route.expectChapter && rt.state.activeChapterId !== route.expectChapter) {
      throw new Error(`chapter expected ${route.expectChapter} got ${rt.state.activeChapterId}`)
    }
    results.push({
      id: route.id,
      ok: true,
      steps: rt.steps.length,
      ending: route.expectEnding ?? '-',
      aff,
      scene: rt.state.activeSceneId,
    })
  } catch (e) {
    failed += 1
    results.push({
      id: route.id,
      ok: false,
      error: e.message,
      lastSteps: rt.steps.slice(-8),
    })
  }
}

console.log('=== verifyPlaythroughRoutes (post-rewrite) ===\n')
for (const r of results) {
  if (r.ok) {
    console.log(`OK  ${r.id}  steps=${r.steps}  ending=${r.ending}  aff=${r.aff}  scene=${r.scene}`)
  } else {
    console.log(`FAIL ${r.id}`)
    console.log(`     ${r.error}`)
    console.log(`     last: ${r.lastSteps.join(' | ')}`)
  }
}
console.log(`\n${results.length - failed}/${results.length} routes OK`)
process.exit(failed > 0 ? 1 : 0)
