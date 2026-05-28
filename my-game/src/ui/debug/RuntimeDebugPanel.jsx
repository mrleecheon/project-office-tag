import { useMemo } from 'react'
import { analyzeRouteConsistency } from '../../tools/debug/routeConsistency'

function formatRecentHistory(routeHistory = []) {
  return routeHistory.slice(-6).map((entry) => `${entry.chapterId}/${entry.sceneId}`)
}

export default function RuntimeDebugPanel({ state, scene, map, timeline = [] }) {
  const recentHistory = useMemo(() => formatRecentHistory(state.routeHistory), [state.routeHistory])
  const routeWarnings = useMemo(() => analyzeRouteConsistency({ chapter: state.__activeChapter, routeHistory: state.routeHistory }), [state.__activeChapter, state.routeHistory])

  return (
    <aside className="runtimeDebugPanel" role="status" aria-live="polite">
      <strong>DEBUG</strong>
      <div>screen: {state.screen}</div>
      <div>scene: {scene?.id ?? 'none'}</div>
      <div>map: {map?.id ?? 'none'}</div>
      <div>flags: {state.flags.length}</div>
      <div>items: {state.inventory.length}</div>
      <div>visited: {state.visitedScenes.length}</div>
      <div>slots: {state.__slots?.length ?? 0}</div>
      <div className="runtimeDebugPanel__history">
        {recentHistory.map((entry) => <div key={entry}>{entry}</div>)}
      </div>
      {routeWarnings.length > 0 && (
        <div className="runtimeDebugPanel__warnings">
          {routeWarnings.map((warning) => <div key={warning}>! {warning}</div>)}
        </div>
      )}
      <div className="runtimeDebugPanel__history">
        {timeline.slice(-4).map((entry) => (
          <div key={`${entry.at}-${entry.eventName}`}>{entry.eventName}</div>
        ))}
      </div>
    </aside>
  )
}
