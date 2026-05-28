export default function Hud({ chapter, nickname }) {
  return (
    <div className="chapterHud">
      <span>{chapter?.label ?? 'SESSION'} · {chapter?.title ?? 'TalkLine'}</span>
      <span>{nickname}</span>
    </div>
  )
}
