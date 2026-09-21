import { useEffect } from 'react'

export function useSmoothScroll() {
  useEffect(() => {
    let raf = 0
    let current = window.scrollY
    let target = window.scrollY
    let active = false
    const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const step = () => {
      current += (target - current) * 0.09
      window.scrollTo(0, current)
      if (Math.abs(target - current) > 0.5) raf = requestAnimationFrame(step)
      else active = false
    }

    const onWheel = (event: WheelEvent) => {
      if (reduced() || Math.abs(event.deltaY) < 2) return
      target = Math.max(0, Math.min(document.documentElement.scrollHeight - window.innerHeight, target + event.deltaY * 0.78))
      if (!active) { active = true; raf = requestAnimationFrame(step) }
    }
    const onScroll = () => { if (!active) { current = window.scrollY; target = window.scrollY } }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
}
