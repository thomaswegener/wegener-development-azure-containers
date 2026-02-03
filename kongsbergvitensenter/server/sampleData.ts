import type { AboutProfile, CalendarEvent } from '../shared/contentTypes'

export const sampleCalendarEvents: CalendarEvent[] = [
  {
    id: 'sample-astronaut',
    title: 'Familiedag: Bli en romutforsker',
    date: new Date().toISOString(),
    endDate: new Date().toISOString(),
    startTime: '10:00',
    endTime: '14:00',
    location: 'Planetariet',
    summary:
      'Prøv VR-utstyr, bygg din egen rakett og lær hvordan vi planlegger fremtidens ferder til månen.',
    hosts: ['Team Utforsker'],
    audience: ['Familier', 'Barn 6-12'],
    openForPublic: true,
    tags: ['Praktisk', 'Utforsk'],
  },
  {
    id: 'sample-maker',
    title: 'Åpent verksted: Maker Monday',
    date: new Date(Date.now() + 86400000).toISOString(),
    endDate: new Date(Date.now() + 86400000).toISOString(),
    startTime: '17:30',
    endTime: '21:00',
    location: 'Skaperverkstedet',
    summary:
      'Ta med deg et prosjekt eller få hjelp av våre mentorer til å bli kjent med 3D-printere, laserskjærere og loddebolter.',
    hosts: ['Olav', 'Emily'],
    audience: ['Ungdom 13+', 'Voksne'],
    openForPublic: true,
    tags: ['Skaperverksted'],
  },
  {
    id: 'sample-school',
    title: 'Skolebesøk: Energilaben',
    date: new Date(Date.now() + 2 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    startTime: '09:00',
    endTime: '13:00',
    location: 'Energilaben',
    summary:
      'Videregående skoleklasser testes i fornybar energi, turbiner og ekte data fra industrien.',
    hosts: ['Energiteamet'],
    audience: ['Skoleklasser'],
    openForPublic: false,
    tags: ['Energilaben'],
  },
  {
    id: 'sample-evening',
    title: 'Kongsberg after dark',
    date: new Date(Date.now() + 4 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 4 * 86400000).toISOString(),
    startTime: '18:00',
    endTime: '22:00',
    location: 'Hovedsalen',
    summary:
      'Kveld for nysgjerrige voksne med miniforedrag, smarte demoer og taffelmusikk i loungen.',
    hosts: ['Gjesteforelesere'],
    audience: ['Voksne'],
    openForPublic: true,
    tags: ['Kveld'],
  },
]

export const sampleAboutProfiles: AboutProfile[] = [
  {
    id: 'about-lise',
    name: 'Lise Abrahamsen',
    role: 'Daglig leder',
    focusAreas: ['Strategi', 'Partnerskap', 'Vitensformidling'],
    bio: 'Bringer teknologimiljøet i Kongsberg tettere på barn og unge, og sørger for at vitensenteret alltid føles levende.',
    email: 'lise@kongsbergvitensenter.no',
  },
  {
    id: 'about-joakim',
    name: 'Joakim Øverli',
    role: 'Programansvarlig',
    focusAreas: ['Aktiviteter', 'Skoleopplegg', 'Fagdager'],
    bio: 'Designer opplevelser i laboratoriene og sørger for at både lærere og elever får wow-følelsen.',
    email: 'joakim@kongsbergvitensenter.no',
  },
  {
    id: 'about-tuva',
    name: 'Tuva Heggelund',
    role: 'Skaperverksted',
    focusAreas: ['Maker-utstyr', 'Ungdomsklubber', 'Inkludering'],
    bio: 'Leder åpne verksteder og lærer bort alt fra 3D-design til håndverk i tre og tekstil.',
    email: 'tuva@kongsbergvitensenter.no',
  },
]
