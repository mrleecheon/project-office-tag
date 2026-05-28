import { useCallback, useEffect, useRef, useState } from 'react'

const img1 = '/assets/intro/scene1_door.png'
const img2 = '/assets/intro/scene2_reader_closeup.png'
const img3 = '/assets/intro/scene3_card_tag.png'
const img4 = '/assets/intro/scene4_title.png'

const SCENES = [
  {
    id: 0,
    type: 'auto',
    delay: 1800,
    image: img1,
    overlay: null,
  },
  {
    id: 1,
    type: 'auto',
    delay: 1600,
    image: img2,
    overlay: null,
  },
  {
    id: 2,
    type: 'prompt',
    delay: 1200,
    image: img3,
    overlay: {
      text: '사원증을 태그하세요',
      position: 'bottom',
    },
  },
  {
    id: 3,
    type: 'welcome',
    delay: 2200,
    image: img4,
    overlay: {
      text: '환영합니다!',
      position: 'center',
    },
  },
  {
    id: 4,
    type: 'click',
    delay: null,
    image: img4,
    overlay: null,
  },
]

export default function ProjectOfficeIntro({ onComplete }) {
  const [sceneIndex, setSceneIndex] = useState(0)
  const [fadeState, setFadeState] = useState('in')
  const [textVisible, setTextVisible] = useState(false)
  const timerRef = useRef(null)

  const currentScene = SCENES[sceneIndex]

  const goNextScene = useCallback(() => {
    setFadeState('out')
    setTextVisible(false)
    setTimeout(() => {
      setSceneIndex((index) => {
        const next = index + 1
        if (next >= SCENES.length) {
          onComplete?.()
          return index
        }
        setFadeState('in')
        return next
      })
    }, 500)
  }, [onComplete])

  useEffect(() => {
    setFadeState('in')
    setTextVisible(false)

    if (currentScene.overlay) {
      const textTimer = setTimeout(() => setTextVisible(true), 600)
      return () => clearTimeout(textTimer)
    }
  }, [sceneIndex, currentScene.overlay])

  useEffect(() => {
    if (
      (currentScene.type === 'auto'
        || currentScene.type === 'prompt'
        || currentScene.type === 'welcome')
      && currentScene.delay
    ) {
      timerRef.current = setTimeout(goNextScene, currentScene.delay)
    }
    return () => clearTimeout(timerRef.current)
  }, [sceneIndex, currentScene.type, currentScene.delay, goNextScene])

  const handleClick = () => {
    if (currentScene.type === 'click') {
      goNextScene()
    }
  }

  const overlayPos = currentScene.overlay?.position
  const isTagPrompt = overlayPos === 'bottom'

  return (
    <div
      className={[
        'projectOfficeIntro',
        fadeState === 'in' ? 'is-visible' : 'is-fading',
        currentScene.type === 'click' ? 'is-clickable' : '',
      ].filter(Boolean).join(' ')}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') handleClick()
      }}
      role={currentScene.type === 'click' ? 'button' : undefined}
      tabIndex={currentScene.type === 'click' ? 0 : undefined}
    >
      <div className="projectOfficeIntroStage">
        <img
          key={sceneIndex}
          className="projectOfficeIntroImage"
          src={currentScene.image}
          alt=""
        />
      </div>

      {currentScene.overlay && (
        <div
          className={[
            'projectOfficeIntroOverlay',
            overlayPos === 'bottom' ? 'is-bottom' : '',
            overlayPos === 'center' ? 'is-center' : '',
            textVisible ? 'is-visible' : '',
          ].filter(Boolean).join(' ')}
        >
          {isTagPrompt && (
            <div className="projectOfficeIntroTagPrompt" aria-live="polite">
              <small className="projectOfficeIntroTagEyebrow">NFC READER</small>
              <p className="projectOfficeIntroTagTitle">{currentScene.overlay.text}</p>
              <span className="projectOfficeIntroTagPulse" aria-hidden="true" />
            </div>
          )}

          {overlayPos === 'center' && (
            <p className="projectOfficeIntroWelcome">{currentScene.overlay.text}</p>
          )}
        </div>
      )}
    </div>
  )
}
