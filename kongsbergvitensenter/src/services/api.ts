import type { AboutResponse, CalendarResponse } from '@shared/contentTypes'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const fromApi = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`)
  if (!response.ok) {
    const message = await response.text()
    throw new Error(
      message || `Klarte ikke å laste ${path.replace('/api/', '')}`,
    )
  }
  return response.json()
}

export const fetchCalendar = () => fromApi<CalendarResponse>('/api/calendar')

export const fetchAbout = () => fromApi<AboutResponse>('/api/about')
