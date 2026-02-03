import type { CalendarEvent } from '@shared/contentTypes'
import type { MutableRefObject } from 'react'
import { useCallback, useState } from 'react'
import type { CalendarDay } from '../hooks/useCalendarData'
import { useDragScroll } from '../hooks/useDragScroll'
import { renderRichText } from '../utils/richText'

interface Props {
  days: CalendarDay[]
  isLoading: boolean
  scrollRef?: MutableRefObject<HTMLDivElement | null>
}

export const CalendarStrip = ({ days, isLoading, scrollRef }: Props) => {
  const dragRef = useDragScroll<HTMLDivElement>()
  const [activeId, setActiveId] = useState<string | null>(null)
  const mergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      dragRef.current = node
      if (scrollRef) {
        scrollRef.current = node
      }
    },
    [dragRef, scrollRef],
  )

  if (isLoading) {
    return (
      <div className="calendar-strip loading">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="calendar-day shimmer" />
        ))}
      </div>
    )
  }

  return (
    <div className="calendar-strip" ref={mergedRef}>
      {days.map((day) => (
        <div key={day.isoDate} className="calendar-day">
          <div className="calendar-day-header">
            <span className="weekday">{capitalize(day.weekdayLabel)}</span>
            <span className="date-label">{day.dateLabel}</span>
            {day.openForPublic && <span className="chip">Åpent hus</span>}
          </div>
          <div className="calendar-events">
            {day.events.length === 0 ? (
              <p className="empty-state">Ingen aktiviteter</p>
            ) : (
              day.events.map((event) => (
                <ActivityCard
                  key={event.id}
                  event={event}
                  isActive={activeId === event.id}
                  onActivate={setActiveId}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

interface ActivityProps {
  event: CalendarEvent
  isActive: boolean
  onActivate: (id: string | null) => void
}

const ActivityCard = ({ event, isActive, onActivate }: ActivityProps) => {
  const handlePointer = () => onActivate(event.id)
  const handleLeave = () => onActivate(null)

  return (
    <div
      role="button"
      tabIndex={0}
      className={`activity-card ${isActive ? 'active' : ''}`}
      onMouseEnter={handlePointer}
      onMouseLeave={handleLeave}
      onFocus={handlePointer}
      onBlur={handleLeave}
      onClick={() => onActivate(isActive ? null : event.id)}
    >
      <div className="activity-timeslot">
        <span>{event.startTime ?? 'Hele dagen'}</span>
        {event.endTime && <span className="end-time"> – {event.endTime}</span>}
      </div>
      <h4>{event.title}</h4>
      {event.tags && event.tags.length > 0 && (
        <div className="tag-row">
          {event.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}
      <p className="audience">{event.audience.join(' · ')}</p>
      {isActive && (
        <div className="activity-details">
          {event.summary && (
            <div className="summary">{renderRichText(event.summary)}</div>
          )}
          <dl>
            {event.location && (
              <>
                <dt>Hvor</dt>
                <dd>{event.location}</dd>
              </>
            )}
            <dt>Åpent for</dt>
            <dd>{event.audience.length > 0 ? event.audience.join(', ') : 'Internt'}</dd>
          </dl>
        </div>
      )}
    </div>
  )
}

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1)
