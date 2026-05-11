import { characters } from '../../content/world/characters'

export default function PortraitStage({ line }) {
  const char = characters[line?.char] ?? characters.unknown
  const hidden = line?.isNarration || line?.char === 'system'

  return (
    <div className="portraitStage">
      <div className="stageGrid" />
      <div className={hidden ? 'stageSilhouette muted' : 'stageSilhouette'} style={{ '--accent': char.accent }}>
        <span>{hidden ? '' : char.initial}</span>
        <small>{hidden ? 'NARRATION' : char.name}</small>
      </div>
    </div>
  )
}
