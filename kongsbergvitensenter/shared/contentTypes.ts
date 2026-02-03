export type ApiSource = 'notion' | 'sample'

export interface CalendarEvent {
  id: string
  title: string
  date: string // ISO string, start of the activity date
  endDate?: string // ISO string, inclusive end date
  startTime?: string // 24h HH:mm
  endTime?: string // 24h HH:mm
  location?: string
  summary?: string
  hosts: string[]
  audience: string[]
  openForPublic: boolean
  tags?: string[]
}

export interface CalendarResponse {
  events: CalendarEvent[]
  lastSynced: string
  source: ApiSource
}

export interface AboutProfile {
  id: string
  name: string
  role?: string
  focusAreas: string[]
  bio?: string
  email?: string
  phone?: string
  image?: string
}

export interface AboutResponse {
  profiles: AboutProfile[]
  lastSynced: string
  source: ApiSource
}
