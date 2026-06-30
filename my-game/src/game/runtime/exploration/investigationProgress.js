import { resolveChoiceAvailability } from '../../transitions/transitionPolicy.js'

function hasStoryFlag(state, flag) {
  return (state.flags ?? []).includes(flag)
}

export function resolveMapInvestigationProgress(map, state) {
  const investigation = map?.investigation
  if (!investigation?.spots?.length) return null

  const spots = investigation.spots.map((spot) => ({
    ...spot,
    done: hasStoryFlag(state, spot.flag),
  }))

  return {
    label: investigation.progressLabel ?? '조사 진행',
    total: spots.length,
    visited: spots.filter((spot) => spot.done).length,
    spots,
    exitScene: investigation.exitScene ?? null,
    canExitEarly: Boolean(investigation.exitScene)
      && (
        !(investigation.exitRequirements ?? []).length
        || resolveChoiceAvailability({
          state,
          choices: [{ requirements: investigation.exitRequirements }],
        }).length > 0
      ),
    visitedTileKeys: new Set(
      spots.filter((spot) => spot.done && spot.tileKey).map((spot) => spot.tileKey),
    ),
  }
}

export function resolveInvestigationTrigger(map, state, trigger) {
  const progress = resolveMapInvestigationProgress(map, state)
  if (!progress || !trigger) return trigger
  const spot = progress.spots.find((entry) => entry.trigger === trigger)
  if (spot?.done && spot.revisitScene) return spot.revisitScene
  return trigger
}
