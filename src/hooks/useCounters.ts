import { useEffect, useRef, useState } from 'react'

export function useCounters(endValues: number[]) {
  const [values, setValues] = useState(endValues.map(() => 0))
  const started = useRef(false)

  useEffect(() => {
    const section = document.querySelector('[data-metrics]')
    if (!section) return
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || started.current) return
      started.current = true
      const start = performance.now()
      const duration = 1600
      const tick = (time: number) => {
        const progress = Math.min(1, (time - start) / duration)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValues(endValues.map(value => Math.round(value * eased)))
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
      observer.disconnect()
    }, { threshold: 0.35 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [endValues])

  return values
}
