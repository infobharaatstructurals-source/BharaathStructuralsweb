import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import './ScrollToTop.css'

const ScrollToTop = () => {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const expertiseSection = document.getElementById('expertise')

      if (!expertiseSection) {
        setShowButton(false)
        return
      }

      const sectionTop =
        expertiseSection.getBoundingClientRect().top + window.scrollY

      /*
       * Button appears when the user reaches
       * approximately the Expertise section.
       */
      const triggerPoint = sectionTop - window.innerHeight * 0.25

      if (window.scrollY >= triggerPoint) {
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (!showButton) {
    return null
  }

  return (
    <button
      type="button"
      className="scroll-to-top"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      <ArrowUp
        size={20}
        strokeWidth={1.8}
      />
    </button>
  )
}

export default ScrollToTop