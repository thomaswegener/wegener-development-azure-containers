import 'dotenv/config';
import { prisma } from '../dist/src/db.js';

const locations = [
  {
    slug: 'hammerfest',
    name: { no: 'Hammerfest', en: 'Hammerfest' },
    summary: {
      no: 'Kystbyen med arktisk storbypuls, vertskap og utsikt.',
      en: 'The coastal city with Arctic energy, hosts and views.'
    }
  },
  {
    slug: 'masoy',
    name: { no: 'Måsøy', en: 'Masoy' },
    summary: {
      no: 'Øyriket med fiskevær, stillhet og nære møter.',
      en: 'The island realm with fishing villages, calm and close encounters.'
    }
  },
  {
    slug: 'porsanger',
    name: { no: 'Porsanger', en: 'Porsanger' },
    summary: {
      no: 'Vidde, fjord og kulturmøter i et stort landskap.',
      en: 'Plateaus, fjords and cultural encounters across a vast landscape.'
    }
  }
];

const main = async () => {
  const publishedAt = new Date();

  for (const location of locations) {
    await prisma.location.upsert({
      where: { slug: location.slug },
      update: {
        name: location.name,
        summary: location.summary,
        status: 'PUBLISHED',
        showOnHome: true,
        showOnMenu: true,
        publishedAt
      },
      create: {
        slug: location.slug,
        name: location.name,
        summary: location.summary,
        status: 'PUBLISHED',
        showOnHome: true,
        showOnMenu: true,
        publishedAt
      }
    });
  }

  console.log(`Seeded ${locations.length} locations.`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
