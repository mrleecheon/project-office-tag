export function meetsRequirements(state, requirements = []) {
  return requirements.every((requirement) => {
    if (requirement.type === 'flag') return state.flags.includes(requirement.flag)
    if (requirement.type === 'item') return state.inventory.includes(requirement.item)
    if (requirement.type === 'score') return (state.scores[requirement.score] ?? 0) >= requirement.min
    return true
  })
}
