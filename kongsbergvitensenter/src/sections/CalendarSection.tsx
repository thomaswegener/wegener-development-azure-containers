import { useRef } from 'react'
import { CalendarStrip } from '../components/CalendarStrip'
import { useCalendarData } from '../hooks/useCalendarData'
import { useWheelToHorizontal } from '../hooks/useWheelToHorizontal'

export const CalendarSection = () => {
  const { days, isLoading, error, meta } = useCalendarData()
  const blockScrollRef = useRef<HTMLDivElement | null>(null)
  const horizontalRef = useRef<HTMLDivElement | null>(null)
  useWheelToHorizontal(blockScrollRef, horizontalRef)

  return (
    <section
      className="scroll-block scroll-block--calendar"
      data-scroll-section="calendar"
      data-gradient-start="#000000"
      data-gradient-end="#000000"
    >
      <div className="scroll-block__inner" ref={blockScrollRef}>
        <div id="kalender" className="calendar-section">
          <div className="section-heading">
            <p className="eyebrow">Kongsberg Vitensenter</p>
            <div>
              <h2>Aktivitetskalender</h2>
              <p>
                Oppdateres løpende med aktiviteter, scroll sideveis for å se mer.
              </p>
            </div>
            <div className="meta">
              {meta.nextOpenDay ? (
                <p>
                  Neste åpne dag:{' '}
                  <strong>{meta.nextOpenDay.dateLabel ?? 'Snart'}</strong>
                </p>
              ) : (
                <p></p>
              )}
              {meta.lastSynced && (
                <p>Sist synkronisert {new Date(meta.lastSynced).toLocaleString('nb-NO')}</p>
              )}
            </div>
          </div>

          {error && <p className="error">{error}</p>}

          <CalendarStrip
            days={days}
            isLoading={isLoading}
            scrollRef={horizontalRef}
          />
        </div>
      </div>
    </section>
  )
}
