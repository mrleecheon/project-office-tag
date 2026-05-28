// content/world/company.js
// 변경: 회사명 CARETAKER SYSTEMS, 전임자 박서이, SF 설정 상수 추가

export const COMPANY = {
  // 법인 정보 (현실)
  legal: 'CARETAKER SYSTEMS',
  product: 'TalkLine',
  intranet: 'TalkLine INTERNAL',
  // 보정 레이어가 만들어내는 환영 명칭 (게임 안에서 직원들이 부르는 이름)
  perceived: 'GROOMY OFFICE',
}

export const PREDECESSOR_NAME = '박서이 선임'
export const PREDECESSOR_GIVEN = '박서이'
export const PREDECESSOR_ID = 'EMP-2019-0173'
export const SESSION_EMP_ID = 'EMP-2024-0041'

// SF 설정: 사원증 신경 인터페이스가 만들어내는 지각 보정 레이어
// 사원증을 태그하면 직원의 시각/청각/후각이 회사 메인 서버 CARETAKER와 동기화되어
// "살아있을 때의 회사 모습"이 현재 폐건물 위에 덮어씌워진다.
export const PERCEPTION_LAYER = Object.freeze({
  ON: 'PATCH_ACTIVE',      // 보정 활성 — GROOMY OFFICE로 보임
  OFF: 'PATCH_OFFLINE',    // 보정 해제 — 폐건물의 진짜 모습
  GLITCH: 'PATCH_DESYNC',  // 글리치 — 두 레이어가 겹쳐 보임
})

// 보호자 안드로이드 (집에서 배터리가 다 되어가는 주인공의 가족)
export const GUARDIAN_NAME = '아라'
// 그루미와 같은 라인의 자매기 — 결말 복선
export const GUARDIAN_MODEL = 'GROOMY-LINE / GEN-2'
