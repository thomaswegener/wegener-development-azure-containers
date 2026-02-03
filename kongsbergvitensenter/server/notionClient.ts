import fetch from 'node-fetch'
import type { PageObjectResponse, PartialPageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { AboutProfile, AboutResponse, CalendarEvent, CalendarResponse } from '../shared/contentTypes'
import { sampleAboutProfiles, sampleCalendarEvents } from './sampleData.js'

type PropertyMap = Record<string, string>

const envOrDefault = (key: string, fallback: string) => {
  const value = process.env[key]
  return value && value.trim().length > 0 ? value : fallback
}

export class NotionContentService {
  private calendarDatabaseId?: string
  private aboutDatabaseId?: string
  private calendarProperties: PropertyMap
  private aboutProperties: PropertyMap
  private apiKey?: string
  private aboutNameProperty: string

  constructor() {
    this.apiKey = process.env.NOTION_API_KEY
    this.calendarDatabaseId = process.env.NOTION_CALENDAR_DATABASE_ID
    this.aboutDatabaseId = process.env.NOTION_ABOUT_DATABASE_ID

    this.calendarProperties = {
      date: envOrDefault('NOTION_CALENDAR_DATE_PROP', 'Date'),
      summary: envOrDefault('NOTION_CALENDAR_SUMMARY_PROP', 'Summary'),
      location: envOrDefault('NOTION_CALENDAR_LOCATION_PROP', 'Location'),
      audience: envOrDefault('NOTION_CALENDAR_AUDIENCE_PROP', 'Audience'),
      hosts: envOrDefault('NOTION_CALENDAR_HOSTS_PROP', 'Hosts'),
      openForPublic: envOrDefault('NOTION_CALENDAR_PUBLIC_PROP', 'OpenForPublic'),
      tags: envOrDefault('NOTION_CALENDAR_TAGS_PROP', 'Tags'),
    }

    this.aboutProperties = {
      role: envOrDefault('NOTION_ABOUT_ROLE_PROP', 'Role'),
      bio: envOrDefault('NOTION_ABOUT_BIO_PROP', 'Bio'),
      focus: envOrDefault('NOTION_ABOUT_FOCUS_PROP', 'Focus'),
      email: envOrDefault('NOTION_ABOUT_EMAIL_PROP', 'Email'),
      phone: envOrDefault('NOTION_ABOUT_PHONE_PROP', 'Phone'),
      image: envOrDefault('NOTION_ABOUT_IMAGE_PROP', 'Image'),
    }
    this.aboutNameProperty = envOrDefault('NOTION_ABOUT_NAME_PROP', 'Name')
  }

  async getCalendarResponse(): Promise<CalendarResponse> {
    if (!this.apiKey || !this.calendarDatabaseId) {
      return {
        events: sampleCalendarEvents,
        lastSynced: new Date().toISOString(),
        source: 'sample',
      }
    }

    const results = await this.queryDatabase(this.calendarDatabaseId, {
      sorts: [
        {
          timestamp: 'property',
          property: this.calendarProperties.date,
          direction: 'ascending',
        },
      ],
    })

    const events = results
      .map((page) =>
        this.isFullPage(page) ? this.toCalendarEvent(page) : null,
      )
      .filter((event): event is CalendarEvent => Boolean(event))

    return {
      events,
      lastSynced: new Date().toISOString(),
      source: 'notion',
    }
  }

  async getAboutResponse(): Promise<AboutResponse> {
    if (!this.apiKey || !this.aboutDatabaseId) {
      return {
        profiles: sampleAboutProfiles,
        lastSynced: new Date().toISOString(),
        source: 'sample',
      }
    }

    const results = await this.queryDatabase(this.aboutDatabaseId, {
      sorts: [
        {
          timestamp: 'last_edited_time',
          direction: 'descending',
        },
      ],
    })

    const profiles = results
      .map((page) => (this.isFullPage(page) ? this.toAboutProfile(page) : null))
      .filter((person): person is AboutProfile => Boolean(person))

    return {
      profiles,
      lastSynced: new Date().toISOString(),
      source: 'notion',
    }
  }

  private toCalendarEvent(page: PageObjectResponse): CalendarEvent | null {
    const name = page.properties.Name
    if (!('title' in name) || name.title.length === 0) {
      return null
    }
    const dateProperty = page.properties[this.calendarProperties.date]
    if (!dateProperty || !('date' in dateProperty) || !dateProperty.date?.start) {
      return null
    }

    const dateValue = dateProperty.date
    const startDate = dateValue.start
    const endDate = dateValue.end ?? undefined
    const startTime = getTimeFromISO(startDate)
    const endTime = endDate ? getTimeFromISO(endDate) : undefined

    const summaryProperty = page.properties[this.calendarProperties.summary]
    const locationProperty = page.properties[this.calendarProperties.location]
    const audienceProperty = page.properties[this.calendarProperties.audience]
    const hostProperty = page.properties[this.calendarProperties.hosts]
    const publicProperty = page.properties[this.calendarProperties.openForPublic]
    const tagProperty = page.properties[this.calendarProperties.tags]

    return {
      id: page.id,
      title: name.title.map((chunk) => chunk.plain_text).join(' '),
      date: startDate,
      endDate: endDate ?? startDate,
      startTime,
      endTime,
      summary: pickPlainText(summaryProperty),
      location: pickPlainText(locationProperty),
      audience: pickAudienceList(audienceProperty),
      hosts: pickPeopleOrText(hostProperty),
      openForPublic: pickCheckbox(publicProperty),
      tags: pickMultiSelect(tagProperty),
    }
  }

  private toAboutProfile(page: PageObjectResponse): AboutProfile | null {
    const nameProperty =
      page.properties[this.aboutNameProperty] ?? page.properties.Name
    if (
      !nameProperty ||
      !('title' in nameProperty) ||
      nameProperty.title.length === 0
    ) {
      return null
    }

    const roleProperty = page.properties[this.aboutProperties.role]
    const bioProperty = page.properties[this.aboutProperties.bio]
    const focusProperty = page.properties[this.aboutProperties.focus]
    const emailProperty = page.properties[this.aboutProperties.email]
    const phoneProperty = page.properties[this.aboutProperties.phone]
    const imageProperty = page.properties[this.aboutProperties.image]

    const displayName = nameProperty.title
      .map((chunk) => chunk.plain_text)
      .join(' ')

    return {
      id: page.id,
      name: displayName,
      role: pickPlainText(roleProperty),
      bio: pickPlainText(bioProperty),
      focusAreas: pickMultiSelect(focusProperty),
      email: pickPlainText(emailProperty),
      phone: pickPlainText(phoneProperty),
      image: pickPlainText(imageProperty),
    }
  }

  private isFullPage(
    page: PageObjectResponse | PartialPageObjectResponse,
  ): page is PageObjectResponse {
    return 'url' in page
  }

  private async queryDatabase(
    databaseId: string,
    body?: Record<string, unknown>,
  ) {
    if (!this.apiKey) return []

    const response = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body ?? {}),
      },
    )

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(
        `Notion request failed (${response.status}): ${errorBody}`,
      )
    }

    const data = (await response.json()) as {
      results: Array<PageObjectResponse | PartialPageObjectResponse>
    }

    return data.results
  }
}

export const notionService = () => new NotionContentService()

type RichTextChunk = {
  plain_text: string
  annotations?: {
    bold?: boolean
  }
}

const stringifyRichText = (richText: RichTextChunk[] | undefined) => {
  if (!richText || richText.length === 0) return undefined
  return richText
    .map((chunk) => {
      const text = chunk.plain_text ?? ''
      return chunk.annotations?.bold ? `**${text}**` : text
    })
    .join('')
}

const pickPlainText = (property: PageObjectResponse['properties'][string]) => {
  if (!property) return undefined
  if ('rich_text' in property && property.rich_text.length > 0) {
    return stringifyRichText(property.rich_text as RichTextChunk[])
  }
  if ('title' in property && property.title.length > 0) {
    return property.title.map((r) => r.plain_text).join('')
  }
  if ('select' in property && property.select) {
    return property.select.name
  }
  if ('people' in property && property.people.length > 0) {
    return property.people
      .map((person) => {
        const maybeWithName = person as { name?: string | null }
        return maybeWithName.name ?? 'Vertskap'
      })
      .join(', ')
  }
  if ('email' in property && property.email) {
    return property.email
  }
  if ('phone_number' in property && property.phone_number) {
    return property.phone_number
  }
  if ('url' in property && property.url) {
    return property.url
  }
  return undefined
}

const pickMultiSelect = (
  property: PageObjectResponse['properties'][string],
): string[] => {
  if (!property) return []
  if ('multi_select' in property) {
    return property.multi_select.map((item) => item.name)
  }
  if ('relation' in property) {
    return property.relation.map((rel) => rel.id)
  }
  return []
}

const pickAudienceList = (
  property: PageObjectResponse['properties'][string],
): string[] => {
  if (!property) return []
  if ('multi_select' in property) {
    return property.multi_select.map((item) => item.name)
  }
  if ('rich_text' in property && property.rich_text.length > 0) {
    return property.rich_text.map((r) => r.plain_text)
  }
  if ('title' in property && property.title.length > 0) {
    return property.title.map((r) => r.plain_text)
  }
  if ('select' in property && property.select) {
    return [property.select.name]
  }
  const fallback = pickPlainText(property)
  return fallback ? [fallback] : []
}

const pickPeopleOrText = (
  property: PageObjectResponse['properties'][string],
): string[] => {
  if (!property) return []
  if ('people' in property) {
    return property.people.map((person) => {
      const maybeWithName = person as { name?: string | null }
      return maybeWithName.name ?? 'Vertskap'
    })
  }
  if ('rich_text' in property && property.rich_text.length > 0) {
    return property.rich_text.map((r) => r.plain_text)
  }
  if ('title' in property && property.title.length > 0) {
    return property.title.map((r) => r.plain_text)
  }
  return []
}

const pickCheckbox = (
  property: PageObjectResponse['properties'][string],
): boolean => {
  if (!property) return false
  if ('checkbox' in property) {
    return property.checkbox
  }
  if ('select' in property && property.select) {
    return ['ja', 'åpen', 'true'].includes(property.select.name.toLowerCase())
  }
  return false
}

const getTimeFromISO = (value: string | undefined) => {
  if (!value) return undefined
  const time = value.split('T')[1]
  if (!time) return undefined
  return time.slice(0, 5)
}
