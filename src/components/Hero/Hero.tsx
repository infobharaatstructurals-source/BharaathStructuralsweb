import { useEffect, useRef, useState } from 'react'
import Icon from '../common/Icon'
import video1 from '../../assets/hero/Video1.mp4'
import video2 from '../../assets/hero/Video2.mp4'
import video3 from '../../assets/hero/Video3.mp4'
import './Hero.css'

type HeroProps = {
  onNavigate: (id: string) => void
}

const videos = [
  video1,
  video2,
  video3,
]

export default function Hero({
  onNavigate,
}: HeroProps) {
  const [activeVideo, setActiveVideo] = useState(0)

  const videoRefs = useRef<
    Array<HTMLVideoElement | null>
  >([])

  const transitioning = useRef(false)

  /*
   * Start the currently active video.
   */
  useEffect(() => {
    const active =
      videoRefs.current[activeVideo]

    if (!active) return

    active.currentTime = 0

    const playPromise = active.play()

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Browser may block autoplay in rare cases.
      })
    }

    videoRefs.current.forEach(
      (video, index) => {
        if (
          video &&
          index !== activeVideo
        ) {
          video.pause()
        }
      }
    )

    transitioning.current = false
  }, [activeVideo])

  /*
   * Begin the next video slightly before
   * the current video finishes.
   *
   * This creates the cinematic crossfade.
   */
  const handleTimeUpdate = (
    index: number
  ) => {
    const video =
      videoRefs.current[index]

    if (!video) return

    if (
      index !== activeVideo ||
      transitioning.current
    ) {
      return
    }

    if (!video.duration) return

    const remaining =
      video.duration - video.currentTime

    if (remaining <= 1.1) {
      transitioning.current = true

      setActiveVideo(
        (current) =>
          (current + 1) % videos.length
      )
    }
  }

  return (
    <section
      id="home"
      className="hero"
    >

      {/* ==================================================
          OUTER BACKGROUND
          ================================================== */}

      <div className="hero-ambient" />

      {/* ==================================================
          MAIN HERO PANEL
          ================================================== */}

      <div className="hero-panel">

        {/* VIDEO BACKGROUND */}
        <div className="hero-video-layer">

          {videos.map((video, index) => (
            <video
              key={video}
              ref={(element) => {
                videoRefs.current[index] =
                  element
              }}
              className={`hero-video ${
                activeVideo === index
                  ? 'hero-video--active'
                  : ''
              }`}
              src={video}
              muted
              playsInline
              preload={
                index === 0
                  ? 'auto'
                  : 'metadata'
              }
              onTimeUpdate={() =>
                handleTimeUpdate(index)
              }
            />
          ))}

        </div>


        {/* ==================================================
            DARK GRADIENT
            ================================================== */}

        <div className="hero-overlay" />

        <div className="hero-vignette" />


        {/* ==================================================
            HERO CONTENT
            ================================================== */}

        <div className="hero-content">

          <div className="hero-copy">

            <div className="hero-eyebrow">
              <span className="hero-eyebrow-line" />
              <span>
                STEEL · BIM · ENGINEERING
              </span>
            </div>


            <h1>
              Precision in
              <br />
              <span>structural detail.</span>
            </h1>


            <p>
              Structural steel detailing,
              BIM coordination and
              fabrication-ready
              documentation built around
              accuracy, clarity and
              performance.
            </p>


            <div className="hero-actions">

              <button
                className="hero-button hero-button--primary"
                onClick={() =>
                  onNavigate('services')
                }
              >
                <span>
                  Explore Services
                </span>

                <Icon
                  name="ArrowUpRight"
                  size={15}
                />
              </button>


              <button
                className="hero-button hero-button--secondary"
                onClick={() =>
                  onNavigate('projects')
                }
              >
                <span>
                  View Projects
                </span>

                <Icon
                  name="ArrowRight"
                  size={14}
                />
              </button>

            </div>

          </div>


          {/* ==================================================
              RIGHT SIDE INFORMATION
              ================================================== */}

          <div className="hero-side">

            <div className="hero-side-label">
              STRUCTURAL
              <br />
              ENGINEERING
            </div>

            <div className="hero-side-line" />

            <span>
              DETAIL · COORDINATE · DELIVER
            </span>

          </div>


          {/* ==================================================
              BOTTOM
              ================================================== */}

          <div className="hero-bottom">

            <div className="hero-description">
              

              <p>
                Engineering precision
                that carries from model
                to fabrication.
              </p>
            </div>


            {/* VIDEO INDICATOR */}

            <div className="hero-video-indicator">

              {videos.map((_, index) => (
                <span
                  key={index}
                  className={
                    activeVideo === index
                      ? 'is-active'
                      : ''
                  }
                />
              ))}

            </div>


            <button
              className="hero-scroll"
              onClick={() =>
                onNavigate('about')
              }
            >
              <span>
                Scroll Down
              </span>

              <Icon
                name="ArrowDown"
                size={13}
              />
            </button>

          </div>

        </div>

      </div>

    </section>
  )
}