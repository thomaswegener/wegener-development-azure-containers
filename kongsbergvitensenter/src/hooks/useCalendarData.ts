import {
  addDays,
  format,
  parseISO,
  startOfDay,
  startOfToday,
} from 'date-fns'
import { nb } from 'date-fns/locale'
import { useEffect, useMemo, useState } from 'react'
import type { ApiSource, CalendarEvent } from '@shared/contentTypes'
import { fetchCalendar } from '../services/api'

export interface CalendarDay {
  isoDate: string
  weekdayLabel: string
  dateLabel: string
  events: CalendarEvent[]
  openForPublic: boolean
}

const DAYS_TO_SHOW = 30

export const useCalendarData = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<ApiSource>('sample')
  const [lastSynced, setLastSynced] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setIsLoading(true)
      try {
        const data = await fetchCalendar()
        if (!mounted) return
        setEvents(data.events)
        setSource(data.source)
        setLastSynced(data.lastSynced)
        setError(null)
      } catch (err) {
        if (!mounted) return
        setError(
          err instanceof Error
            ? err.message
            : 'Noe gikk galt ved henting av kalenderen.',
        )
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    void load()
    const interval = setInterval(load, 1000 * 60 * 5)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  const days = useMemo(() => buildCalendarDays(events), [events])

  return {
    days,
    isLoading,
    error,
    meta: {
      source,
      lastSynced,
      totalActivities: events.length,
      nextOpenDay: days.find((day) => day.openForPublic),
    },
  }
}

const buildCalendarDays = (events: CalendarEvent[]): CalendarDay[] => {
  const today = startOfToday()

  return Array.from({ length: DAYS_TO_SHOW }).map((_, index) => {
    const current = startOfDay(addDays(today, index))
    const isoDate = current.toISOString()
    const dayEvents = events.filter((event) => {
      const eventStart = startOfDay(parseISO(event.date))
      const eventEnd = startOfDay(parseISO(event.endDate ?? event.date))
      return eventStart <= current && eventEnd >= current
    })

    const weekdayLabel = format(current, 'EEEE', { locale: nb })
    const dateLabel = format(current, 'd. MMM', { locale: nb })

    return {
      isoDate,
      weekdayLabel,
      dateLabel,
      events: dayEvents,
      openForPublic: dayEvents.some((event) => event.openForPublic),
    }
  })
}
