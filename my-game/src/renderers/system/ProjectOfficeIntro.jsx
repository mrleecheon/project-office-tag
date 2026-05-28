import { useCallback, useEffect, useRef, useState } from 'react'
import { emitAudioCue } from '../../engine/audio/audioBus'

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
    type: 'tag',
    image: img3,
    overlay: {
      text: '사원증을 태그하세요',
      position: 'bottom',
    },
  },
  {
    id: 3,
    type: 'click',
    delay: null,
    image: img4,
    overlay: null,
  },
]

export default function ProjectOfficeIntro({ onComplete, exiting = false }) {
  const [sceneIndex, setSceneIndex] = useState(0)
  const [fadeState, setFadeState] = useState('in')
  const [textVisible, setTextVisible] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [tagging, setTagging] = useState(false)
  const timerRef = useRef(null)

  const currentScene = SCENES[sceneIndex]

  const goNextScene = useCallback(() => {
    setFadeState('out')
    setTextVisible(false)
    setShaking(false)
    setTagging(false)
    setTimeout(() => {
      if (sceneIndex >= SCENES.length - 1) {
        onComplete?.()
        return
      }
      setSceneIndex(sceneIndex + 1)
      setFadeState('in')
    }, 500)
  }, [onComplete, sceneIndex])

  useEffect(() => {
    if (currentScene.overlay) {
      const textTimer = setTimeout(() => setTextVisible(true), currentScene.textOnly ? 120 : 600)
      return () => clearTimeout(textTimer)
    }
    return undefined
  }, [sceneIndex, currentScene.overlay, currentScene.textOnly])

  useEffect(() => {
    if (currentScene.type === 'auto' && currentScene.delay) {
      timerRef.current = setTimeout(goNextScene, currentScene.delay)
    }
    if (currentScene.type === 'welcome' && currentScene.delay) {
      timerRef.current = setTimeout(goNextScene, currentScene.delay)
    }
    return () => clearTimeout(timerRef.current)
  }, [sceneIndex, currentScene.type, currentScene.delay, goNextScene])

  const handleTag = useCallback(() => {
    if (currentScene.type !== 'tag' || tagging) return
    setTagging(true)
    setShaking(true)
    emitAudioCue('nfc:scan')
    try {
      navigator.vibrate?.(32)
    } catch {
      // Optional browser API.
    }
    timerRef.current = setTimeout(goNextScene, 580)
  }, [currentScene.type, goNextScene, tagging])

  const handleClick = () => {
    if (currentScene.type === 'tag') {
      handleTag()
      return
    }
    if (currentScene.type === 'click') {
      goNextScene()
    }
  }

  const overlayPos = currentScene.overlay?.position
  const isTagPrompt = overlayPos === 'bottom'
  const showImage = !currentScene.textOnly

  return (
    <div
      className={[
        'projectOfficeIntro',
        fadeState === 'in' ? 'is-visible' : 'is-fading',
        exiting ? 'is-exiting' : '',
        currentScene.type === 'click' || currentScene.type === 'tag' ? 'is-clickable' : '',
        currentScene.textOnly ? 'is-text-only' : '',
        shaking ? 'is-shaking' : '',
      ].filter(Boolean).join(' ')}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') handleClick()
      }}
      role={currentScene.type === 'click' || currentScene.type === 'tag' ? 'button' : undefined}
      tabIndex={currentScene.type === 'click' || currentScene.type === 'tag' ? 0 : undefined}
    >
      {showImage && (
        <div className="projectOfficeIntroStage">
          <img
            key={sceneIndex}
            className={[
              'projectOfficeIntroImage',
              currentScene.type === 'tag' ? 'is-tag-scene' : '',
            ].filter(Boolean).join(' ')}
            src={currentScene.image}
            alt=""
          />
        </div>
      )}

      {currentScene.overlay && (
        <div
          className={[
            'projectOfficeIntroOverlay',
            overlayPos === 'bottom' ? 'is-bottom' : '',
            overlayPos === 'center' && !currentScene.textOnly ? 'is-center' : '',
            textVisible ? 'is-visible' : '',
            currentScene.textOnly ? 'is-text-only' : '',
          ].filter(Boolean).join(' ')}
        >
          {isTagPrompt && (
            <div className="projectOfficeIntroTagPrompt" aria-live="polite">
              <small className="projectOfficeIntroTagEyebrow">NFC READER</small>
              <p className="projectOfficeIntroTagTitle">{currentScene.overlay.text}</p>
              <span className="projectOfficeIntroTagPulse" aria-hidden="true" />
              <span className="projectOfficeIntroTagHint">탭하여 태그</span>
            </div>
          )}

          {overlayPos === 'center' && (
            <div className="projectOfficeIntroWelcomeBubble" aria-live="polite">
              <p className="projectOfficeIntroWelcome">{currentScene.overlay.text}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
