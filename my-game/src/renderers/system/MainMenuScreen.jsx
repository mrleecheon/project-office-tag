import { useMemo, useState } from 'react'
import { emitAudioCue } from '../../engine/audio/audioBus'
import ScreenTransition from '../../ui/layout/ScreenTransition'
import { clearHoverAudioState, playHoverAudioOnce } from '../../ui/interaction/hoverAudio.js'

export default function MainMenuScreen({ onStart }) {
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const particles = useMemo(
    () => Array.from({ length: 18 }, (_, index) => ({
      id: `particle-${index}`,
      left: `${(index * 13) % 100}%`,
      delay: `${(index % 9) * 0.7}s`,
      duration: `${7 + (index % 5) * 1.2}s`,
    })),
    [],
  )

  const handleClick = () => {
    emitAudioCue('ui:confirm')
    onStart()
  }
  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    setParallax({ x, y })
  }

  return (
    <ScreenTransition className="screen mainMenuScreen" variant="cinematic">
      <div className="mainMenuWideFrame">
        <div className="mainMenuStage" aria-hidden="true">
          <div className="menuLayer bg" style={{ transform: `translate3d(${parallax.x * -6}px, ${parallax.y * -4}px, 0) scale(1.04)` }} />
          <div className="menuLayer volumetricLight" style={{ transform: `translate3d(${parallax.x * 8}px, ${parallax.y * 5}px, 0)` }} />
          <div className="menuLayer fog" style={{ transform: `translate3d(${parallax.x * -10}px, ${parallax.y * -6}px, 0)` }} />
          <div className="menuLayer noise" />
          <div className="menuLayer vignette" />
          <div className="menuLayer glitch" />
          <div className="menuParticles">
            {particles.map((particle) => (
              <span
                key={particle.id}
                style={{
                  left: particle.left,
                  animationDelay: particle.delay,
                  animationDuration: particle.duration,
                }}
              />
            ))}
          </div>
        </div>

        <div className="mainMenuHud vnTonePanel" onMouseMove={handlePointerMove}>
          <div className="mainMenuTitleBlock">
            <small>ver. 0.9.8 / ALT-LINE BUILD</small>
            <h1>GROOMY OFFICE</h1>
            <p>Research Facility Incident Archive</p>
          </div>
          <nav className="mainMenuButtons" aria-label="Main menu">
            <button
              type="button"
              onMouseEnter={(event) => playHoverAudioOnce(event)}
              onMouseLeave={(event) => clearHoverAudioState(event)}
              onFocus={(event) => playHoverAudioOnce(event)}
              onClick={handleClick}
            >
              NEW SESSION
            </button>
            <button
              type="button"
              onMouseEnter={(event) => playHoverAudioOnce(event)}
              onMouseLeave={(event) => clearHoverAudioState(event)}
              onFocus={(event) => playHoverAudioOnce(event)}
              onClick={handleClick}
            >
              CONTINUE
            </button>
            <button
              type="button"
              onMouseEnter={(event) => playHoverAudioOnce(event)}
              onMouseLeave={(event) => clearHoverAudioState(event)}
              onFocus={(event) => playHoverAudioOnce(event)}
              onClick={handleClick}
            >
              RECORDS / SETTINGS
            </button>
          </nav>
          <div className="mainMenuUtility">
            <button type="button" onMouseEnter={(event) => playHoverAudioOnce(event)} onMouseLeave={(event) => clearHoverAudioState(event)} onFocus={(event) => playHoverAudioOnce(event)} onClick={() => emitAudioCue('ui:open')}>LANG</button>
            <button type="button" onMouseEnter={(event) => playHoverAudioOnce(event)} onMouseLeave={(event) => clearHoverAudioState(event)} onFocus={(event) => playHoverAudioOnce(event)} onClick={() => emitAudioCue('ui:open')}>EXTRAS</button>
          </div>
        </div>
      </div>
    </ScreenTransition>
  )
}
