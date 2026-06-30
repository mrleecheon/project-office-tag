# groomyAffinity 라우팅 — CH4 abandon vs CH5 badB

`groomyAffinity`는 프롤로그~CH3 선택지로만 변하며, CH4 hint 경로·CH5 low 분기까지 **추가 변화 없음**(CH4 shield의 `groomyClose` 제외).

## 게이트 임계값

| 구간 | 분기 | 조건 |
|------|------|------|
| CH4 `groomy_gate` | abandon (침묵) | affinity **≤ 0** → `ch4_end_bad`, CH5 미진입 |
| CH4 `groomy_gate` | hint | affinity **1~4** |
| CH4 `groomy_gate` | shield | affinity **≥ 5** |
| CH5 `final_choice_pick` | low → **badB** | affinity **≤ 1** |
| CH5 `final_choice_pick` | mid → normal | affinity **2~4** |
| CH5 `final_choice_pick` | high → true/badA | affinity **≥ 5** |

`GROOMY_AFFINITY_CH4_ABANDON_MAX = 0`은 CH4 abandon과 CH5 badB(≤1)가 겹치지 않도록 **hint 최솟값 1**을 보장하기 위한 값이다.

## 검증 결과 (2026-06-22)

`groomyAffinityAudit.mjs` 실행 기준:

| 항목 | 값 |
|------|-----|
| 프롤로그~CH3 양수 효과 | +1 (36회), +2 (5회) |
| 음수 효과 | -1 (21회), -2 (2회, CH3만) |
| R04/R08 CH4 직전 | **affinity = 1** (유기 badB) |
| R06 / original-cold CH4 직전 | **affinity = -4** → `ch4_end_bad` |
| aff=1 도달 | `runPrologueNeutralLowAff` + `runCh1BadBOrganic` + **CH2 expose(`briefingNeutral`)** + CH3 추궁(-2) |
| aff≤0 도달 | 프롤로그 `예?`×2 + CH1 cold + CH2 expose + CH3 withheld·추궁 |

`runCh5BadBOrganic`은 **제거됨**. CH5 badB는 `runCh5BadB`만 사용하며 affinity 보정 코드 없음.

**오해 방지:** R06(cold)은 badB가 아니라 CH4 조기 종료. badB는 R04/R08만 해당.

**타이틀 주의:** `ch4_end_bad` END 씬과 badA 엔딩 `titleKo`가 둘 다 「잘 가, 신입」이나, 전자는 진실 미공개 조기 종료·후자는 전지 해체이다.

## 두 단계 BAD 설계 (의도 확인 필요)

플레이어가 그루미와 **멀어질수록** 결과가 두 층으로 나뉜다:

1. **아주 차가움 (affinity ≤ 0, CH4 직전)**  
   - 예: 프롤로그 `예?`×2, CH1 회의 우선·직접 카드·배터리 의심, CH3 추론 보류·연속 추궁  
   - 시뮬 **R06** / 원래 cold 정의: CH4 `groomy_gate` **abandon** → `ch4_end_bad` (~31분, CH5 없음)

2. **어느 정도 차가움 (affinity = 1, CH4 직전)**  
   - CH1은 hint까지 갈 만큼 warm(우회 위임 등), CH2 expose 조사는 하되 **briefing에서「일단 둘러보고」**(호감 무증가), CH3에서 **한 번** 강하게 밀어내기(`groomy_absence_chat` 추궁 -2)  
   - CH4 **hint** 통과 → CH5 **low** → **badB** (회전문 엔딩)  
   - 시뮬 **R04** / **R08**: `runCh5BadB` 유기 도달 (보정 없음)

**badB는 CH5까지 가는 「거리 1」 전용 엔딩**이며, **CH4 abandon은 그보다 더 cold한 플레이어를 위한 조기 BAD**다.  
「유기 경로로 badB 통과」라고만 적으면 R06 cold 루트가 badB로 이어진다고 오해하기 쉽다.

## CH3 밸런스 (2025-06 패치)

`groomy_absence_chat` 「그루미한테 … 더 캐묻는다」: `relationship.distant`(-1) → `relationship.far`(-2).

- R04/R08 시뮬: CH4 직전 affinity **2 → 1** (유기 badB 가능)
- R06 cold: CH4 직전 **-3 → -4** (여전히 abandon)

## 검증 도구

```bash
node src/tools/debug/groomyAffinityAudit.mjs
node src/tools/debug/multiRoutePlaythroughReport.mjs
```
