export type VideoItem = {
  id: string
  title: string
  description: string
}

export type VideoCollection = {
  id: string
  label: string
  items: VideoItem[]
}

export type PdfPackage = {
  slug: string
  title: string
  description?: string
  pdfFile?: string
}

export type ContactTopic = {
  id: string
  label: string
}

const assetHost = (import.meta.env.VITE_ASSET_HOST ?? '').replace(/\/$/, '')

export const withAssetHost = (path: string) =>
  `${assetHost}${path.startsWith('/') ? path : `/${path}`}`

export const videoCollections: VideoCollection[] = [
  {
    id: 'urban-finnmark',
    label: 'Urban Finnmark',
    items: [
      {
        id: '1a',
        title: 'Urbane Finnmark',
        description: 'City life in the world’s northernmost town.',
      },
      {
        id: '1b',
        title: 'Go North',
        description: 'Company presentation and highlights from Hammerfest.',
      },
      {
        id: '1c',
        title: 'The Northernmost City',
        description: 'Stories from the top of Europe.',
      },
    ],
  },
  {
    id: 'historical-coast',
    label: 'Finnmark Coast',
    items: [
      {
        id: '2a',
        title: 'The Historical Finnmark Coast',
        description: 'A journey along dramatic coastlines and heritage.',
      },
      {
        id: '2b',
        title: 'Akkarfjord (Sørøya)',
        description: 'Local life on the green island outside Hammerfest.',
      },
      {
        id: '2c',
        title: 'Seiland',
        description: 'National park experiences between fjords and glaciers.',
      },
    ],
  },
]

export const videosById = Object.fromEntries(
  videoCollections.flatMap((collection) =>
    collection.items.map((item) => [
      item.id,
      {
        ...item,
        src: withAssetHost(`/assets/video/${item.id}.mp4`),
      },
    ]),
  ),
) as Record<string, VideoItem & { src: string }>

export const defaultVideoId = '1b'

export const pdfPackages: PdfPackage[] = [
  { slug: 'inspiration', title: 'Inspiration brochure' },
  { slug: 'a_taste_of_arctic_winter', title: 'A taste of Arctic winter' },
  { slug: 'arctic_ski_expedition', title: 'Arctic ski expedition' },
  { slug: 'be_a_dog_sledding_polar_hero', title: 'Be a dog sledding polar hero' },
  {
    slug: 'coolcation_nature_and_culture_in_arctic_norway',
    title: 'Coolcation: nature and culture in Arctic Norway',
  },
  { slug: 'dogsledding_overnight_tour', title: 'Dogsledding overnight tour' },
  { slug: 'family_dogsledding_adventure', title: 'Family dogsledding adventure' },
  { slug: 'family_hiking_expedition', title: 'Family hiking expedition' },
  { slug: 'hiking_expedition', title: 'Hiking expedition' },
  { slug: 'kayaking_adventure', title: 'Kayaking adventure' },
  { slug: 'meet_the_locals_multi_day', title: 'Meet the locals multi-day' },
  { slug: 'northern_lights_glamping_tour', title: 'Northern lights glamping tour' },
  { slug: 'reindeer_herder_package', title: 'Reindeer herder package' },
  {
    slug: 'sami_reindeer_adventure_culture_and_connection',
    title: 'Sami reindeer adventure, culture & connection',
  },
  { slug: 'seiland_package', title: 'Seiland package' },
  { slug: 'soroya_package', title: 'Sørøya package' },
  { slug: 'urban_finnmark_hammerfest', title: 'Urban Finnmark Hammerfest' },
]

export const defaultPdfSlug = 'inspiration'

const defaultPdfFile = 'catalog.pdf'

export const packagePdfUrl = (pkg: PdfPackage) =>
  withAssetHost(`/products/${pkg.slug}/${pkg.pdfFile ?? defaultPdfFile}`)

export const contactTopics: ContactTopic[] = [
  { id: 'meetings', label: 'Meetings & Conferences' },
  { id: 'leisure', label: 'Leisure & Incentives' },
  { id: 'events', label: 'Events' },
  { id: 'area', label: 'General information about the area' },
]

export type SocialLink = { id: string; label: string; url: string }

export const socialLinks: SocialLink[] = [
  { id: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/' },
  { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/' },
]
