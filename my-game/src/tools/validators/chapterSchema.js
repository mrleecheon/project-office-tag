import { EffectTypes, SceneModes } from '../../engine/contracts.js'
import { assetManifest } from '../../content/manifests/assets.js'

const validRequirementTypes = new Set(['flag', 'unlessFlag', 'item', 'score'])
const validEffectTypes = new Set(Object.values(EffectTypes))
const validScoreKeys = new Set([
  'trust',
  'suspicion',
  'risk',
  'groomyAffinity',
  'mysteryEvidence',
  'batteryDesperation',
  'corporateSuspicion',
])

function validateRequirement(requirement, scenePath, errors) {
  if (!requirement || typeof requirement !== 'object') {
    errors.push(`${scenePath}: requirement must be an object`)
    return
  }
  if (!validRequirementTypes.has(requirement.type)) {
    errors.push(`${scenePath}: invalid requirement type ${requirement.type}`)
    return
  }
  if ((requirement.type === 'flag' || requirement.type === 'unlessFlag') && typeof requirement.flag !== 'string') {
    errors.push(`${scenePath}: flag requirement needs string flag`)
  }
  if (requirement.type === 'item' && typeof requirement.item !== 'string') {
    errors.push(`${scenePath}: item requirement needs string item`)
  }
  if (requirement.type === 'score') {
    if (typeof requirement.score !== 'string') errors.push(`${scenePath}: score requirement needs score key`)
    else if (!validScoreKeys.has(requirement.score)) errors.push(`${scenePath}: unknown score key ${requirement.score}`)
    if (typeof requirement.min !== 'number') errors.push(`${scenePath}: score requirement needs numeric min`)
  }
}

function validateEffects(effects, scenePath, errors) {
  if (!Array.isArray(effects)) {
    errors.push(`${scenePath}: effects must be an array`)
    return
  }
  for (const [index, effect] of effects.entries()) {
    const effectPath = `${scenePath}.effects[${index}]`
    if (!effect || typeof effect !== 'object') {
      errors.push(`${effectPath}: effect must be object`)
      continue
    }
    if (!validEffectTypes.has(effect.type)) {
      errors.push(`${effectPath}: invalid effect type ${effect.type}`)
    }
    if (effect.type === EffectTypes.ADD_SCORE) {
      if (typeof effect.score !== 'string') errors.push(`${effectPath}: addScore needs score key`)
      else if (!validScoreKeys.has(effect.score)) errors.push(`${effectPath}: unknown score key ${effect.score}`)
      if (typeof effect.amount !== 'number') errors.push(`${effectPath}: addScore needs numeric amount`)
    }
    if (effect.type === EffectTypes.ADD_FLAG && typeof effect.flag !== 'string') {
      errors.push(`${effectPath}: addFlag needs string flag`)
    }
    if (effect.type === EffectTypes.ADD_ITEM && typeof effect.item !== 'string') {
      errors.push(`${effectPath}: addItem needs string item`)
    }
  }
}

function validateLines(lines, scenePath, errors) {
  if (!Array.isArray(lines) || lines.length === 0) {
    errors.push(`${scenePath}: lines must be a non-empty array`)
    return
  }
  for (const [index, line] of lines.entries()) {
    const linePath = `${scenePath}.lines[${index}]`
    if (!line || typeof line !== 'object') {
      errors.push(`${linePath}: line must be an object`)
      continue
    }
    if (typeof line.char !== 'string') errors.push(`${linePath}: missing char`)
    if (!(typeof line.text === 'string' || typeof line.text === 'function' || typeof line.textKey === 'string')) {
      errors.push(`${linePath}: text must be string/function or textKey must be string`)
    }
    if (line.delayMs != null && typeof line.delayMs !== 'number') {
      errors.push(`${linePath}: delayMs must be a number`)
    }
  }
}

function validateAssetRef(assetId, refPath, errors) {
  if (!assetId) return
  if (!assetManifest.images[assetId] && !assetManifest.audio[assetId]) {
    errors.push(`${refPath}: unknown asset id (${assetId})`)
  }
}

function validateChoices(choices, scenePath, errors) {
  if (!Array.isArray(choices)) {
    errors.push(`${scenePath}: choices must be an array`)
    return
  }
  for (const [index, choice] of choices.entries()) {
    const choicePath = `${scenePath}.choices[${index}]`
    if (!choice || typeof choice !== 'object') {
      errors.push(`${choicePath}: choice must be object`)
      continue
    }
    if (typeof choice.text !== 'string') errors.push(`${choicePath}: text must be string`)
    if (typeof choice.next !== 'string') errors.push(`${choicePath}: next must be string`)
    if (choice.effects) validateEffects(choice.effects, choicePath, errors)
    for (const requirement of choice.requirements ?? []) validateRequirement(requirement, choicePath, errors)
  }
}

function validateTrigger(trigger, triggerPath, sceneIds, errors) {
  if (typeof trigger !== 'string') {
    errors.push(`${triggerPath}: trigger must be string`)
    return
  }
  if (!sceneIds.has(trigger)) errors.push(`${triggerPath}: trigger points to missing scene (${trigger})`)
}

function validateMap(map, mapPath, sceneIds, errors) {
  if (!Number.isInteger(map.rows) || !Number.isInteger(map.cols)) {
    errors.push(`${mapPath}: rows/cols must be integers`)
    return
  }
  if (!Array.isArray(map.grid) || map.grid.length !== map.rows) {
    errors.push(`${mapPath}: grid height mismatch`)
  } else {
    map.grid.forEach((row, index) => {
      if (!Array.isArray(row) || row.length !== map.cols) {
        errors.push(`${mapPath}: grid row ${index} width mismatch`)
      }
    })
  }
  if (!map.playerStart || typeof map.playerStart.row !== 'number' || typeof map.playerStart.col !== 'number') {
    errors.push(`${mapPath}: invalid playerStart`)
  } else if (map.grid[map.playerStart.row]?.[map.playerStart.col] === 1) {
    errors.push(`${mapPath}: playerStart is blocked`)
  }
  const occupiedNpcKeys = new Set()
  validateAssetRef(map.backgroundAssetId, `${mapPath}.backgroundAssetId`, errors)
  validateAssetRef(map.tilesetAssetId, `${mapPath}.tilesetAssetId`, errors)
  validateAssetRef(map.playerSpriteAssetId, `${mapPath}.playerSpriteAssetId`, errors)
  validateAssetRef(map.parallaxAssetId, `${mapPath}.parallaxAssetId`, errors)
  validateAssetRef(map.minimapAssetId, `${mapPath}.minimapAssetId`, errors)
  for (const [index, flag] of (map.ambientFlags ?? []).entries()) {
    if (typeof flag?.id !== 'string') errors.push(`${mapPath}.ambientFlags[${index}]: id must be string`)
    validateAssetRef(flag?.overlayAssetId, `${mapPath}.ambientFlags[${index}].overlayAssetId`, errors)
  }
  for (const [index, npc] of (map.npcs ?? []).entries()) {
    if (typeof npc?.id !== 'string') errors.push(`${mapPath}.npcs[${index}]: id must be string`)
    const row = npc?.position?.row ?? npc?.row
    const col = npc?.position?.col ?? npc?.col
    if (typeof row !== 'number' || typeof col !== 'number') {
      errors.push(`${mapPath}.npcs[${index}]: position must include row/col`)
    } else {
      const key = `${row}-${col}`
      if (occupiedNpcKeys.has(key)) errors.push(`${mapPath}.npcs[${index}]: duplicate npc position ${key}`)
      occupiedNpcKeys.add(key)
      if (map.grid[row]?.[col] === 1) errors.push(`${mapPath}.npcs[${index}]: npc is placed on blocked tile ${key}`)
      if (map.playerStart?.row === row && map.playerStart?.col === col) {
        errors.push(`${mapPath}.npcs[${index}]: npc overlaps playerStart at ${key}`)
      }
    }
    validateTrigger(npc?.trigger, `${mapPath}.npcs[${index}]`, sceneIds, errors)
    validateAssetRef(npc?.spriteAssetId, `${mapPath}.npcs[${index}].spriteAssetId`, errors)
  }
  for (const [index, eventTile] of (map.eventTiles ?? []).entries()) {
    if (typeof eventTile?.key !== 'string') {
      errors.push(`${mapPath}.eventTiles[${index}]: key must be string`)
    } else {
      const [row, col] = eventTile.key.split('-').map(Number)
      if (!Number.isInteger(row) || !Number.isInteger(col) || row < 0 || row >= map.rows || col < 0 || col >= map.cols) {
        errors.push(`${mapPath}.eventTiles[${index}]: key is outside map (${eventTile.key})`)
      }
    }
    validateTrigger(eventTile?.trigger, `${mapPath}.eventTiles[${index}]`, sceneIds, errors)
  }
  for (const [key, trigger] of Object.entries(map.triggers ?? {})) {
    validateTrigger(trigger, `${mapPath}.triggers.${key}`, sceneIds, errors)
  }
}

export function validateChapterSchema(chapter) {
  const errors = []
  if (!chapter || typeof chapter !== 'object') return ['chapter: value must be object']
  if (typeof chapter.id !== 'string') errors.push('chapter: id must be string')
  if (typeof chapter.startSceneId !== 'string') errors.push(`${chapter.id}: startSceneId must be string`)
  if (!chapter.scenes || typeof chapter.scenes !== 'object') errors.push(`${chapter.id}: scenes must exist`)

  const sceneIds = new Set(Object.keys(chapter.scenes ?? {}))
  for (const [sceneId, scene] of Object.entries(chapter.scenes ?? {})) {
    const scenePath = `${chapter.id}.${sceneId}`
    if (scene.localId !== sceneId) errors.push(`${scenePath}: localId mismatch`)
    if (!Object.values(SceneModes).includes(scene.mode)) errors.push(`${scenePath}: invalid mode ${scene.mode}`)
    if (scene.mode === SceneModes.RPG && typeof scene.mapId !== 'string') errors.push(`${scenePath}: RPG scene needs mapId`)
    if (scene.mode === SceneModes.VN && scene.choices && typeof scene.next === 'string') {
      errors.push(`${scenePath}: VN scene should not mix choices with auto next`)
    }
    if (scene.lines) validateLines(scene.lines, scenePath, errors)
    if (scene.choices) validateChoices(scene.choices, scenePath, errors)
    if (scene.effects) validateEffects(scene.effects, scenePath, errors)
    validateAssetRef(scene.backgroundAssetId, `${scenePath}.backgroundAssetId`, errors)
    validateAssetRef(scene.overlayAssetId, `${scenePath}.overlayAssetId`, errors)
    validateAssetRef(scene.portraitAssetId, `${scenePath}.portraitAssetId`, errors)
    validateAssetRef(scene.chatTheme?.wallpaperAssetId, `${scenePath}.chatTheme.wallpaperAssetId`, errors)
    validateAssetRef(scene.vnStage?.bgId, `${scenePath}.vnStage.bgId`, errors)
    validateAssetRef(scene.vnStage?.overlayId, `${scenePath}.vnStage.overlayId`, errors)
    for (const [lineIndex, line] of (scene.lines ?? []).entries()) {
      validateAssetRef(line?.portraitAssetId, `${scenePath}.lines[${lineIndex}].portraitAssetId`, errors)
      validateAssetRef(line?.sfxAssetId, `${scenePath}.lines[${lineIndex}].sfxAssetId`, errors)
    }
    for (const [charIndex, character] of (scene.vnStage?.characters ?? []).entries()) {
      validateAssetRef(character?.baseId, `${scenePath}.vnStage.characters[${charIndex}].baseId`, errors)
      validateAssetRef(character?.exprId, `${scenePath}.vnStage.characters[${charIndex}].exprId`, errors)
    }
    for (const requirement of scene.requirements ?? []) validateRequirement(requirement, scenePath, errors)
  }

  if (typeof chapter.startSceneId === 'string' && !sceneIds.has(chapter.startSceneId)) {
    errors.push(`${chapter.id}: startSceneId does not exist in scenes (${chapter.startSceneId})`)
  }

  for (const [sceneId, scene] of Object.entries(chapter.scenes ?? {})) {
    const scenePath = `${chapter.id}.${sceneId}`
    if (typeof scene.next === 'string' && !sceneIds.has(scene.next)) {
      errors.push(`${scenePath}: next points to missing scene (${scene.next})`)
    }
    if (typeof scene.returnTo === 'string' && !sceneIds.has(scene.returnTo)) {
      errors.push(`${scenePath}: returnTo points to missing scene (${scene.returnTo})`)
    }
    if (scene.input?.next && !sceneIds.has(scene.input.next)) {
      errors.push(`${scenePath}.input: next points to missing scene (${scene.input.next})`)
    }
    for (const [index, choice] of (scene.choices ?? []).entries()) {
      if (typeof choice?.next === 'string' && !sceneIds.has(choice.next)) {
        errors.push(`${scenePath}.choices[${index}]: next points to missing scene (${choice.next})`)
      }
    }
  }

  for (const [mapId, map] of Object.entries(chapter.maps ?? {})) {
    validateMap(map, `${chapter.id}.maps.${mapId}`, sceneIds, errors)
  }
  return errors
}

export function validateAllChapterSchemas(chapters) {
  return chapters.flatMap(validateChapterSchema)
}
