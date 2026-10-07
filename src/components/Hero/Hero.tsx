import { useEffect, useRef, useState } from 'react'
import Icon from '../common/Icon'

import video1 from '../../assets/hero/Video1-web.mp4'
import video2 from '../../assets/hero/Video2-web.mp4'
import video3 from '../../assets/hero/Video3-web.mp4'

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

  /*
   * IMPORTANT:
   * Only ONE <video> element is used.
   *
   * This prevents Android Chrome from treating
   * multiple video elements as separate media
   * playback instances.
   */
  const videoRef =
    useRef<HTMLVideoElement | null>(null)

  const transitioning =
    useRef(false)


  /*
   * =========================================================
   * START ACTIVE VIDEO
   * =========================================================
   */

  useEffect(() => {

    const video =
      videoRef.current

    if (!video) return

    /*
     * Make sure the video starts
     * from the beginning.
     */
    video.currentTime = 0

    /*
     * Make sure it remains inline.
     */
    video.muted = true
    video.playsInline = true

    /*
     * Play the active video.
     */
    const playPromise =
      video.play()

    if (
      playPromise !== undefined
    ) {
      playPromise.catch(() => {
        /*
         * Autoplay may be blocked by
         * the browser in some situations.
         */
      })
    }

    transitioning.current = false

  }, [activeVideo])


  /*
   * =========================================================
   * GO TO NEXT VIDEO
   * =========================================================
   */

  const goToNextVideo = () => {

    /*
     * Prevent multiple transitions
     * from happening at the same time.
     */
    if (transitioning.current) {
      return
    }

    transitioning.current = true

    const video =
      videoRef.current

    /*
     * Pause current video before
     * changing its source.
     */
    if (video) {
      video.pause()
    }

    /*
     * Change to the next video.
     *
     * Video 1 → Video 2
     * Video 2 → Video 3
     * Video 3 → Video 1
     */
    setActiveVideo(
      current =>
        (current + 1) %
        videos.length
    )

  }


  /*
   * =========================================================
   * VIDEO TIME UPDATE
   * =========================================================
   */

  const handleTimeUpdate = () => {

    const video =
      videoRef.current

    if (!video) return

    if (transitioning.current) {
      return
    }

    /*
     * Ignore invalid duration values.
     */
    if (
      !Number.isFinite(
        video.duration
      ) ||
      video.duration <= 0
    ) {
      return
    }

    const remaining =
      video.duration -
      video.currentTime

    /*
     * Switch slightly before the
     * video reaches the end.
     *
     * This preserves the existing
     * behavior of your hero.
     */
    if (remaining <= 1.1) {

      goToNextVideo()

    }

  }


  /*
   * =========================================================
   * VIDEO ENDED
   *
   * Fallback in case timeupdate does
   * not catch the final moment.
   * =========================================================
   */

  const handleEnded = () => {

    goToNextVideo()

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


        {/* ==================================================
            VIDEO BACKGROUND
            ================================================== */}

        <div className="hero-video-layer">

          <video
            ref={videoRef}

            className="hero-video hero-video--active"

            src={videos[activeVideo]}

            /*
             * =================================================
             * ANDROID / MOBILE VIDEO SETTINGS
             * =================================================
             */

            muted

            playsInline

            /*
             * Prevent Picture-in-Picture.
             */
            disablePictureInPicture

            /*
             * Prevent remote playback/casting.
             */
            disableRemotePlayback

            /*
             * Never show native video controls.
             */
            controls={false}

            /*
             * Prevent native playback options.
             */
            controlsList="nodownload noplaybackrate noremoteplayback"

            /*
             * Keep autoplay enabled.
             */
            autoPlay

            /*
             * Only this one video exists.
             */
            preload="auto"

            /*
             * Existing video transition.
             */
            onTimeUpdate={
              handleTimeUpdate
            }

            /*
             * Fallback when video ends.
             */
            onEnded={
              handleEnded
            }

            /*
             * Keep Android inline playback.
             */
            onLoadedMetadata={() => {

              const video =
                videoRef.current

              if (!video) return

              video.muted = true

              video.playsInline = true

            }}

            /*
             * Prevent long-press/context menu
             * on the video.
             */
            onContextMenu={(event) => {
              event.preventDefault()
            }}

          />

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

              <span>
                structural detail.
              </span>
            </h1>


            <p>
              Structural steel detailing,
              BIM coordination and
              fabrication-ready
              documentation built around
              accuracy, clarity and
              performance.
            </p>
            <p className="hero-seo-description">
  Bharaat Structurals is a Bengaluru-based structural steel detailing
  company specializing in Tekla Structures 3D modelling, BIM coordination,
  connection detailing and fabrication-ready drawings.
</p>

            <div className="hero-actions">

              <button
                type="button"
                className="hero-button hero-button--primary"
                onClick={() =>
                  onNavigate('services')
                }
              >

                <span>
                  Explore Services
                </span>

                <Icon
                  name="ArrowRight"
                  size={14}
                />

              </button>


              <button
                type="button"
                className="hero-button hero-button--secondary"
                onClick={() =>
                  onNavigate('services')
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


            {/* ==================================================
                VIDEO INDICATOR
                ================================================== */}

            <div className="hero-video-indicator">

              {videos.map(
                (_, index) => (

                  <span
                    key={index}

                    className={
                      activeVideo === index
                        ? 'is-active'
                        : ''
                    }
                  />

                )
              )}

            </div>


            <button
              type="button"
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