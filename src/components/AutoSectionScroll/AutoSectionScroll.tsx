import { useEffect, useRef } from 'react'


/*
|--------------------------------------------------------------------------
| AUTO SECTION SCROLL
|--------------------------------------------------------------------------
|
| HOME
|   ↓ 10 sec
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


/*
|--------------------------------------------------------------------------
| SECTION IDS
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


/*
|--------------------------------------------------------------------------
| TIMING
|--------------------------------------------------------------------------
*/

const HOME_IDLE_TIME = 10000

const NORMAL_IDLE_TIME = 5000

const FOOTER_IDLE_TIME = 10000


/*
|--------------------------------------------------------------------------
| SMOOTH SCROLL DURATION
|--------------------------------------------------------------------------
*/

const AUTO_SCROLL_DURATION = 1000


export default function AutoSectionScroll() {

  const timerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null)


  const scrollFinishTimerRef =
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
  | CLEAR SCROLL FINISH TIMER
  |--------------------------------------------------------------------------
  */

  const clearScrollFinishTimer = () => {

    if (
      scrollFinishTimerRef.current !== null
    ) {

      clearTimeout(
        scrollFinishTimerRef.current
      )

      scrollFinishTimerRef.current = null
    }
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
  | FIND CURRENT SECTION
  |--------------------------------------------------------------------------
  */

  const getCurrentSectionIndex = () => {

    const existingSections =
      getExistingSections()


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
  | GET IDLE TIME FOR CURRENT SECTION
  |--------------------------------------------------------------------------
  */

  const getIdleTime = (
    sectionId:
      (typeof SECTION_IDS)[number]
  ) => {

    /*
     * HOME gets 10 seconds.
     */

    if (
      sectionId === 'home'
    ) {

      return HOME_IDLE_TIME
    }


    /*
     * FOOTER gets 10 seconds.
     */

    if (
      sectionId === 'footer'
    ) {

      return FOOTER_IDLE_TIME
    }


    /*
     * All normal sections get 5 seconds.
     */

    return NORMAL_IDLE_TIME
  }


  /*
  |--------------------------------------------------------------------------
  | SCHEDULE NEXT AUTO SCROLL
  |--------------------------------------------------------------------------
  */

  const scheduleNext = () => {

    clearTimer()


    /*
     * Do not schedule while the user is
     * on another route.
     */

    if (
      window.location.pathname !== '/'
    ) {

      return
    }


    const sections =
      getExistingSections()


    if (
      sections.length === 0
    ) {

      /*
       * DOM may not be ready yet.
       * Try again after a short delay.
       */

      timerRef.current =
        setTimeout(() => {

          scheduleNext()

        }, 500)

      return
    }


    const currentIndex =
      getCurrentSectionIndex()


    const currentSection =
      sections[currentIndex]


    if (!currentSection) {

      return
    }


    /*
     * Get the correct timeout:
     *
     * HOME    = 10 sec
     * NORMAL  = 5 sec
     * FOOTER  = 10 sec
     */

    const delay =
      getIdleTime(
        currentSection.id
      )


    timerRef.current =
      setTimeout(() => {

        moveToNextSection()

      }, delay)
  }


  /*
  |--------------------------------------------------------------------------
  | MOVE TO NEXT SECTION
  |--------------------------------------------------------------------------
  */

  const moveToNextSection = () => {

    /*
     * Do nothing if we are no longer
     * on the Home page.
     */

    if (
      window.location.pathname !== '/'
    ) {

      clearTimer()

      return
    }


    /*
     * Make sure the user has actually
     * remained inactive for the required
     * amount of time.
     */

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


    const currentSection =
      sections[currentIndex]


    if (!currentSection) {

      scheduleNext()

      return
    }


    const requiredIdleTime =
      getIdleTime(
        currentSection.id
      )


    const timeSinceInteraction =
      Date.now() -
      lastInteractionRef.current


    /*
     * If the user interacted recently,
     * do NOT auto-scroll.
     *
     * Start a fresh timer instead.
     */

    if (
      timeSinceInteraction <
      requiredIdleTime
    ) {

      scheduleNext()

      return
    }


    /*
     |--------------------------------------------------------------------------
     | LAST SECTION → HOME
     |--------------------------------------------------------------------------
     */

    if (
      currentIndex >=
      sections.length - 1
    ) {

      const home =
        document.getElementById(
          'home'
        )


      if (!home) {

        scheduleNext()

        return
      }


      isAutoScrollingRef.current =
        true


      clearScrollFinishTimer()


      home.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })


      /*
       * Wait for smooth scrolling to finish.
       */

      scrollFinishTimerRef.current =
        window.setTimeout(() => {

          isAutoScrollingRef.current =
            false


          /*
           * The automatic movement itself
           * should not count as user activity.
           *
           * Start the HOME 10-second timer.
           */

          lastInteractionRef.current =
            Date.now()


          scheduleNext()

        }, AUTO_SCROLL_DURATION)


      return
    }


    /*
     |--------------------------------------------------------------------------
     | NEXT SECTION
     |--------------------------------------------------------------------------
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


    clearScrollFinishTimer()


    nextSection.element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })


    /*
     * Wait for smooth scrolling to finish.
     */

    scrollFinishTimerRef.current =
      window.setTimeout(() => {

        isAutoScrollingRef.current =
          false


        /*
         * Reset the idle clock after
         * automatic movement.
         *
         * The next section now gets
         * its own correct timeout.
         */

        lastInteractionRef.current =
          Date.now()


        scheduleNext()

      }, AUTO_SCROLL_DURATION)
  }


  /*
  |--------------------------------------------------------------------------
  | USER INTERACTION
  |--------------------------------------------------------------------------
  */

  const handleUserInteraction = () => {

    /*
     * IMPORTANT:
     *
     * User interaction must ALWAYS
     * reset the inactivity timer.
     *
     * Even if automatic scrolling is
     * currently happening, user activity
     * should take priority.
     */

    lastInteractionRef.current =
      Date.now()


    clearTimer()


    /*
     * If automatic scrolling is currently
     * happening, stop treating it as an
     * automatic cycle.
     */

    if (
      isAutoScrollingRef.current
    ) {

      isAutoScrollingRef.current =
        false


      clearScrollFinishTimer()
    }


    /*
     * Start a fresh countdown.
     *
     * The function automatically chooses:
     *
     * HOME    → 10 sec
     * NORMAL  → 5 sec
     * FOOTER  → 10 sec
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
     * main Home page.
     */

    if (
      window.location.pathname !== '/'
    ) {

      return
    }


    /*
     * Give React time to render
     * all Home sections.
     */

    const initialTimer =
      window.setTimeout(() => {

        lastInteractionRef.current =
          Date.now()


        scheduleNext()

      }, 1200)


    /*
     |--------------------------------------------------------------------------
     | USER EVENTS
     |--------------------------------------------------------------------------
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
     |--------------------------------------------------------------------------
     | CLEANUP
     |--------------------------------------------------------------------------
     */

    return () => {

      clearTimeout(
        initialTimer
      )


      clearTimer()


      clearScrollFinishTimer()


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
     * The functions intentionally keep
     * their stable behavior for this
     * mounted component.
     */

    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [])


  return null
}