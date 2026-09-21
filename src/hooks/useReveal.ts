import { useEffect } from 'react'

export function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    nodes.forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [])
}
