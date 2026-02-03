import { useEffect, useRef } from 'react'

export const useDragScroll = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let isPointerDown = false
    let startX = 0
    let scrollLeft = 0

    const handlePointerDown = (event: PointerEvent) => {
      isPointerDown = true
      startX = event.pageX - element.offsetLeft
      scrollLeft = element.scrollLeft
      element.classList.add('is-dragging')
      element.setPointerCapture(event.pointerId)
    }

    const handlePointerLeave = () => {
      isPointerDown = false
      element.classList.remove('is-dragging')
    }

    const handlePointerUp = () => {
      isPointerDown = false
      element.classList.remove('is-dragging')
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!isPointerDown) return
      event.preventDefault()
      const x = event.pageX - element.offsetLeft
      const walk = (x - startX) * 1.2
      element.scrollLeft = scrollLeft - walk
    }

    element.addEventListener('pointerdown', handlePointerDown)
    element.addEventListener('pointerleave', handlePointerLeave)
    element.addEventListener('pointerup', handlePointerUp)
    element.addEventListener('pointercancel', handlePointerUp)
    element.addEventListener('pointermove', handlePointerMove)

    return () => {
      element.removeEventListener('pointerdown', handlePointerDown)
      element.removeEventListener('pointerleave', handlePointerLeave)
      element.removeEventListener('pointerup', handlePointerUp)
      element.removeEventListener('pointercancel', handlePointerUp)
      element.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])

  return ref
}
