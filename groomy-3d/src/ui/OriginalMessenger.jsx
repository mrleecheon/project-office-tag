import ErrorBoundary from '@groomy/game/app/ErrorBoundary.jsx'
import AppProviders from '@groomy/game/app/AppProviders.jsx'
import GameRouter from '@groomy/game/app/routing/GameRouter.jsx'
import PhoneFrame from '@groomy/game/ui/layout/PhoneFrame.jsx'
import '@groomy/game/styles/globals.css'

export default function OriginalMessenger({
  afterOfficeIntro = true,
  skipLoad = true,
  startSceneId = null,
  startChapterId = null,
  nickname = null,
  onInterceptScene,
  overlay = false,
  ...rest
}) {
  const resolvedSkipLoad = rest.skipLoad ?? skipLoad
  const resolvedSceneId = rest.startSceneId ?? startSceneId
  const resolvedChapterId = rest.startChapterId ?? startChapterId
  const router = (
    <GameRouter
      afterOfficeIntro={afterOfficeIntro}
      skipLoad={resolvedSkipLoad}
      startSceneId={resolvedSceneId}
      startChapterId={resolvedChapterId}
      nickname={nickname}
      onInterceptScene={onInterceptScene}
    />
  )

  return (
    <ErrorBoundary>
      <AppProviders>
        {overlay ? (
          <div className="vnOverlay3d">{router}</div>
        ) : (
          <div className="appRoot">
            <PhoneFrame>
              {router}
            </PhoneFrame>
          </div>
        )}
      </AppProviders>
    </ErrorBoundary>
  )
}
