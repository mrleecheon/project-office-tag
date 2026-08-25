export default function VnEventLayer({ eventId }) {
  if (!eventId) return null
  if (eventId !== 'badgeTag') return null

  return (
    <div className="vnEventLayer" data-event="badgeTag" data-sfx-slot="badge-tag">
      <div className="vnEventBadgeWrap">
        <div className="vnEventBadgeArt" data-slot="badge-art" aria-hidden="true" />
        <div className="vnEventTagMotion" data-slot="tag-motion" aria-hidden="true" />
        <p className="vnEventCue">TAG</p>
      </div>
    </div>
  )
}
