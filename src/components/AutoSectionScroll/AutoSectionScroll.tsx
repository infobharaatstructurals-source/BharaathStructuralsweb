import { useEffect, useRef } from 'react'

/*
|--------------------------------------------------------------------------
| AUTO SECTION SCROLL
|--------------------------------------------------------------------------
|
| HOME
|   ↓ 5 sec
| ABOUT
|   ↓ 5 sec
| EXPERTISE
|   ↓ 5 sec
| SERVICES
|   ↓ 5 sec
| PARTNERS
|   ↓ 5 sec
| CONTACT
|   ↓ 5 sec
| FOOTER
|   ↓ 10 sec
| HOME
|
|--------------------------------------------------------------------------
*/

const SECTION_IDS = [
  'home',
  'about',
  'expertise',
  'services',
  'partners',
  'contact',
  'footer',
] as const

const NORMAL_IDLE_TIME = 5000

const FOOTER_IDLE_TIME = 10000

export default function AutoSectionScroll() {
  const timerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null)

  const isAutoScrollingRef =
    useRef(false)

  const lastInteractionRef =
    useRef(Date.now())

  /*
  |--------------------------------------------------------------------------
  | CLEAR TIMER
  |--------------------------------------------------------------------------
  */

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)

      timerRef.current = null
    }
  }

  /*
  |--------------------------------------------------------------------------
  | FIND CURRENT SECTION
  |--------------------------------------------------------------------------
  */

  const getCurrentSectionIndex = () => {
    const existingSections =
      SECTION_IDS
        .map((id) => ({
          id,
          element:
            document.getElementById(id),
        }))
        .filter(
          (
            item
          ): item is {
            id: (typeof SECTION_IDS)[number]
            element: HTMLElement
          } =>
            item.element !== null
        )

    if (
      existingSections.length === 0
    ) {
      return 0
    }

    /*
     * Use a point slightly below the
     * top of the viewport.
     *
     * This works better with a fixed navbar.
     */

    const viewportPoint =
      window.innerHeight * 0.35

    let closestIndex = 0

    let smallestDistance =
      Infinity

    existingSections.forEach(
      (item, index) => {
        const rect =
          item.element.getBoundingClientRect()

        /*
         * Distance between the section's
         * top and our viewport reference.
         */

        const distance =
          Math.abs(
            rect.top -
              viewportPoint
          )

        /*
         * If the section is currently
         * occupying the viewport, prefer it.
         */

        const isVisible =
          rect.top <=
            viewportPoint &&
          rect.bottom >
            viewportPoint

        if (isVisible) {
          closestIndex = index

          smallestDistance = 0

          return
        }

        if (
          smallestDistance !== 0 &&
          distance <
            smallestDistance
        ) {
          smallestDistance =
            distance

          closestIndex = index
        }
      }
    )

    return closestIndex
  }

  /*
  |--------------------------------------------------------------------------
  | GET EXISTING SECTIONS
  |--------------------------------------------------------------------------
  */

  const getExistingSections = () => {
    return SECTION_IDS
      .map((id) => ({
        id,
        element:
          document.getElementById(id),
      }))
      .filter(
        (
          item
        ): item is {
          id: (typeof SECTION_IDS)[number]
          element: HTMLElement
        } =>
          item.element !== null
      )
  }

  /*
  |--------------------------------------------------------------------------
  | MOVE TO NEXT SECTION
  |--------------------------------------------------------------------------
  */

  const moveToNextSection = () => {
    /*
     * Don't move if the user has interacted
     * very recently.
     */

    const timeSinceInteraction =
      Date.now() -
      lastInteractionRef.current

    if (
      timeSinceInteraction <
      NORMAL_IDLE_TIME
    ) {
      scheduleNext()

      return
    }

    const sections =
      getExistingSections()

    if (
      sections.length === 0
    ) {
      scheduleNext()

      return
    }

    const currentIndex =
      getCurrentSectionIndex()

    /*
     * ---------------------------------------------------------
     * LAST SECTION → HOME
     * ---------------------------------------------------------
     */

    if (
      currentIndex >=
      sections.length - 1
    ) {
      const home =
        document.getElementById(
          'home'
        )

      if (home) {
        isAutoScrollingRef.current =
          true

        home.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })

        /*
         * Give the smooth scroll time
         * to finish before allowing the
         * next timer.
         */

        window.setTimeout(() => {
          isAutoScrollingRef.current =
            false

          lastInteractionRef.current =
            Date.now()

          scheduleNext()
        }, 1000)

        return
      }
    }

    /*
     * ---------------------------------------------------------
     * NEXT SECTION
     * ---------------------------------------------------------
     */

    const nextIndex =
      currentIndex + 1

    const nextSection =
      sections[nextIndex]

    if (!nextSection) {
      scheduleNext()

      return
    }

    isAutoScrollingRef.current =
      true

    nextSection.element.scrollIntoView(
      {
        behavior: 'smooth',
        block: 'start',
      }
    )

    /*
     * Reset the idle clock after the
     * automatic movement.
     */

    window.setTimeout(() => {
      isAutoScrollingRef.current =
        false

      lastInteractionRef.current =
        Date.now()

      scheduleNext()
    }, 1000)
  }

  /*
  |--------------------------------------------------------------------------
  | SCHEDULE NEXT AUTO SCROLL
  |--------------------------------------------------------------------------
  */

  const scheduleNext = () => {
    clearTimer()

    const sections =
      getExistingSections()

    if (
      sections.length === 0
    ) {
      return
    }

    const currentIndex =
      getCurrentSectionIndex()

    /*
     * Footer gets 10 seconds.
     *
     * Every other section gets 5 seconds.
     */

    const currentSection =
      sections[currentIndex]

    const delay =
      currentSection?.id === 'footer'
        ? FOOTER_IDLE_TIME
        : NORMAL_IDLE_TIME

    timerRef.current =
      setTimeout(() => {
        moveToNextSection()
      }, delay)
  }

  /*
  |--------------------------------------------------------------------------
  | USER INTERACTION
  |--------------------------------------------------------------------------
  */

  const handleUserInteraction = () => {
    /*
     * Ignore events generated while our
     * own smooth scrolling is happening.
     */

    if (
      isAutoScrollingRef.current
    ) {
      return
    }

    lastInteractionRef.current =
      Date.now()

    clearTimer()

    /*
     * Start a fresh 5-second countdown.
     */

    scheduleNext()
  }

  /*
  |--------------------------------------------------------------------------
  | MOUSE MOVEMENT
  |--------------------------------------------------------------------------
  */

  const handleMouseMove = () => {
    handleUserInteraction()
  }

  /*
  |--------------------------------------------------------------------------
  | WHEEL
  |--------------------------------------------------------------------------
  */

  const handleWheel = () => {
    handleUserInteraction()
  }

  /*
  |--------------------------------------------------------------------------
  | TOUCH
  |--------------------------------------------------------------------------
  */

  const handleTouchStart = () => {
    handleUserInteraction()
  }

  const handleTouchMove = () => {
    handleUserInteraction()
  }

  const handleTouchEnd = () => {
    handleUserInteraction()
  }

  /*
  |--------------------------------------------------------------------------
  | CLICK
  |--------------------------------------------------------------------------
  */

  const handleClick = () => {
    handleUserInteraction()
  }

  /*
  |--------------------------------------------------------------------------
  | KEYBOARD
  |--------------------------------------------------------------------------
  */

  const handleKeyDown = () => {
    handleUserInteraction()
  }

  /*
  |--------------------------------------------------------------------------
  | POINTER DOWN
  |--------------------------------------------------------------------------
  */

  const handlePointerDown = () => {
    handleUserInteraction()
  }

  /*
  |--------------------------------------------------------------------------
  | FOCUS
  |--------------------------------------------------------------------------
  */

  const handleFocusIn = () => {
    handleUserInteraction()
  }

  /*
  |--------------------------------------------------------------------------
  | FORM INPUT
  |--------------------------------------------------------------------------
  */

  const handleInput = () => {
    handleUserInteraction()
  }

  /*
  |--------------------------------------------------------------------------
  | MOUNT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    /*
     * Only run this feature on the
     * main home page.
     */

    if (
      window.location.pathname !== '/'
    ) {
      return
    }

    /*
     * Wait until the Home DOM is
     * completely mounted.
     */

    const initialTimer =
      window.setTimeout(() => {
        lastInteractionRef.current =
          Date.now()

        scheduleNext()
      }, 1200)

    /*
     * ---------------------------------------------------------
     * USER EVENTS
     * ---------------------------------------------------------
     */

    window.addEventListener(
      'mousemove',
      handleMouseMove,
      {
        passive: true,
      }
    )

    window.addEventListener(
      'wheel',
      handleWheel,
      {
        passive: true,
      }
    )

    window.addEventListener(
      'touchstart',
      handleTouchStart,
      {
        passive: true,
      }
    )

    window.addEventListener(
      'touchmove',
      handleTouchMove,
      {
        passive: true,
      }
    )

    window.addEventListener(
      'touchend',
      handleTouchEnd,
      {
        passive: true,
      }
    )

    window.addEventListener(
      'click',
      handleClick
    )

    window.addEventListener(
      'keydown',
      handleKeyDown
    )

    window.addEventListener(
      'pointerdown',
      handlePointerDown,
      {
        passive: true,
      }
    )

    document.addEventListener(
      'focusin',
      handleFocusIn
    )

    document.addEventListener(
      'input',
      handleInput
    )

    /*
     * ---------------------------------------------------------
     * CLEANUP
     * ---------------------------------------------------------
     */

    return () => {
      clearTimeout(initialTimer)

      clearTimer()

      window.removeEventListener(
        'mousemove',
        handleMouseMove
      )

      window.removeEventListener(
        'wheel',
        handleWheel
      )

      window.removeEventListener(
        'touchstart',
        handleTouchStart
      )

      window.removeEventListener(
        'touchmove',
        handleTouchMove
      )

      window.removeEventListener(
        'touchend',
        handleTouchEnd
      )

      window.removeEventListener(
        'click',
        handleClick
      )

      window.removeEventListener(
        'keydown',
        handleKeyDown
      )

      window.removeEventListener(
        'pointerdown',
        handlePointerDown
      )

      document.removeEventListener(
        'focusin',
        handleFocusIn
      )

      document.removeEventListener(
        'input',
        handleInput
      )
    }

    /*
     * The functions intentionally have
     * stable behavior for this mounted
     * component.
     */

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}