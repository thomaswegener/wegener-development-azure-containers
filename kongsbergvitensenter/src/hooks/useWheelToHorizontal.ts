import { MutableRefObject, useEffect } from 'react'

export const useWheelToHorizontal = (
  regionRef: MutableRefObject<HTMLElement | null>,
  scrollRef: MutableRefObject<HTMLElement | null>,
) => {
  useEffect(() => {
    let cleanup: (() => void) | null = null
    let frame: number | null = null

    const setup = () => {
      const region = regionRef.current
      const scrollContainer = scrollRef.current

      if (!region || !scrollContainer) {
        frame = requestAnimationFrame(setup)
        return
      }

      const handleWheel = (event: WheelEvent) => {
        const target = scrollContainer
        const rect = target.getBoundingClientRect()
        const topAligned = Math.abs(rect.top) < 1
        const bottomAligned = Math.abs(rect.bottom - window.innerHeight) < 1
        if (!(topAligned && bottomAligned)) {
          return
        }

        const { deltaY } = event
        if (Math.abs(deltaY) < Math.abs(event.deltaX)) {
          return
        }

        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth
        if (maxScroll <= 0) {
          return
        }

        const atStart = scrollContainer.scrollLeft <= 0
        const atEnd = scrollContainer.scrollLeft >= maxScroll - 1

        if ((deltaY < 0 && atStart) || (deltaY > 0 && atEnd)) {
          return
        }

        event.preventDefault()
        scrollContainer.scrollLeft += deltaY
      }

      region.addEventListener('wheel', handleWheel, { passive: false })
      cleanup = () => region.removeEventListener('wheel', handleWheel)
    }

    setup()

    return () => {
      if (cleanup) cleanup()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [regionRef, scrollRef])
}
