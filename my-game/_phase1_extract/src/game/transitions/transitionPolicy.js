import { meetsRequirements } from '../../engine/progression/requirements.js'

export function canEnterScene({ state, targetScene }) {
  if (!targetScene) {
    return { ok: false, reason: 'missing-scene' }
  }
  const requirements = targetScene.requirements ?? []
  if (!requirements.length) {
    return { ok: true }
  }
  if (meetsRequirements(state, requirements)) {
    return { ok: true }
  }
  return { ok: false, reason: 'requirements-failed', requirements }
}

export function resolveChoiceAvailability({ state, choices = [] }) {
  return choices.filter((choice) => {
    const requirements = choice.requirements ?? []
    return requirements.length === 0 || meetsRequirements(state, requirements)
  })
}
