// Shared groomyAffinity gates — keep in sync across UI, CH4 shield, and TRUE ending.

// gates: groomy_shield (log overwrite, CH4)
// gates: UI label "가까움" (shield only; TRUE is 6+)
export const GROOMY_AFFINITY_SHIELD_MIN = 5

// gates: TRUE ending + UI label "친한 사이"
export const GROOMY_AFFINITY_TRUE_END_MIN = 6

/** Mid tier: hint-only (groomy_hint, groomy_realization_mid, final_choice_mid). */
export const GROOMY_AFFINITY_WARM_MIN = 2
export const GROOMY_AFFINITY_WARM_MAX = 4

/** CH4 groomy_gate abandon only — separate from WARM_MIN so affinity 1 can hint→CH5 badB. */
// WARM_MIN(2) as abandon ceiling makes badB structurally unreachable (CH4 abandon vs CH5 low both ≤1).
export const GROOMY_AFFINITY_CH4_ABANDON_MAX = 0

/** NORMAL epilogue variant: truthExposed + not dismantled + affinity 3–5 (ending-normal-truth-mid). */
export const GROOMY_AFFINITY_TRUTH_MID_NORMAL_MIN = 3
export const GROOMY_AFFINITY_TRUTH_MID_NORMAL_MAX = GROOMY_AFFINITY_SHIELD_MIN
