export function meetsRequirements(state, requirements = []) {
  return requirements.every((requirement) => {
    if (requirement.type === 'flag') return state.flags.includes(requirement.flag)
    if (requirement.type === 'unlessFlag') return !state.flags.includes(requirement.flag)
    if (requirement.type === 'item') return state.inventory.includes(requirement.item)
    if (requirement.type === 'score') {
      const value = state.scores[requirement.score] ?? 0
      if (requirement.min != null && value < requirement.min) return false
      if (requirement.max != null && value > requirement.max) return false
      return true
    }
    return true
  })
}
