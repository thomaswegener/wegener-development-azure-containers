import { useEffect } from 'react'

const parseGradient = (value?: string | null) => value?.trim() || null

const mixColors = (start: string | null, end: string | null, progress: number) => {
  if (!start || !end) return null
  const startRgb = hexToRgb(start)
  const endRgb = hexToRgb(end)
  if (!startRgb || !endRgb) return end
  const mix = startRgb.map(
    (component, index) => component + (endRgb[index] - component) * progress,
  )
  return `rgb(${mix.map((c) => Math.round(c)).join(', ')})`
}

const hexToRgb = (hex: string) => {
  const normalized = hex.replace('#', '')
  if (![3, 6].includes(normalized.length)) return null
  const chunkSize = normalized.length === 3 ? 1 : 2
  const values = normalized.match(new RegExp(`.{${chunkSize}}`, 'g'))
  if (!values) return null
  return values.map((chunk) =>
    chunkSize === 1 ? parseInt(chunk + chunk, 16) : parseInt(chunk, 16),
  )
}

export const useScrollClass = () => {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-scroll-section]'),
    )

    const updateScrollState = () => {
      if (window.scrollY > 80) {
        document.body.classList.add('is-scrolling')
      } else {
        document.body.classList.remove('is-scrolling')
      }

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        const height = Math.max(rect.height, 1)
        const distance = Math.min(Math.max(-rect.top, 0), height)
        const progress = distance / height
        section.style.setProperty(
          '--section-progress',
          progress.toFixed(3).toString(),
        )
        const startColor = parseGradient(section.dataset.gradientStart)
        const endColor = parseGradient(section.dataset.gradientEnd)
        const interpolated = mixColors(startColor, endColor, progress)
        if (interpolated) {
          section.style.setProperty('--section-bg', interpolated)
        }

      })

      document.documentElement.style.setProperty('--page-background', '#000000')
    }

    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      window.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [])
}
