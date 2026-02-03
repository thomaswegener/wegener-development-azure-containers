import 'dotenv/config';
import { prisma } from '../dist/src/db.js';

const concepts = [
  {
    slug: 'soft-adventures',
    title: { no: 'Soft Adventures', en: 'Soft Adventures' },
    summary: {
      no: 'Rolige turer, vandring og små ekspedisjoner med lokale guider.',
      en: 'Gentle hikes, day trips and small expeditions with local guides.'
    },
    body: {
      no: '<p>Opplev nordlys, kyststier og fjellturer som passer for alle nivåer.</p><p>Lokale verter tilpasser tempoet og sørger for trygge opplevelser året rundt.</p>',
      en: '<p>Chase northern lights, coastal trails and mountain walks suited for all levels.</p><p>Local hosts set the pace and keep the experience safe year-round.</p>'
    },
    tag: { no: 'Natur', en: 'Nature' }
  },
  {
    slug: 'culture-and-local-living',
    title: { no: 'Culture and local living', en: 'Culture and local living' },
    summary: {
      no: 'Bli med inn i hverdagen, kulturarv og lokale møteplasser.',
      en: 'Step into everyday life, heritage and local meeting places.'
    },
    body: {
      no: '<p>Møt vertskapet, historiene og den (sjø)samiske kulturen gjennom besøk og fortellinger.</p><p>Perfekt for deg som vil forstå stedet du besøker.</p>',
      en: '<p>Meet hosts, stories and Sea Sami culture through visits and storytelling.</p><p>Ideal for travelers who want to understand the place they visit.</p>'
    },
    tag: { no: 'Kultur', en: 'Culture' }
  },
  {
    slug: 'fishing-paradise',
    title: { no: 'Fishing Paradise', en: 'Fishing Paradise' },
    summary: {
      no: 'Guidet fiske, kystliv og havopplevelser i sesong.',
      en: 'Guided fishing, coastal life and sea experiences in season.'
    },
    body: {
      no: '<p>Opplev fiskevær, hav og natur slik lokale fiskere gjør det.</p><p>Her får du både action og ro ved vannet.</p>',
      en: '<p>Experience fishing communities, sea and nature the way local fishers do.</p><p>Here you get both action and calm by the water.</p>'
    },
    tag: { no: 'Hav', en: 'Sea' }
  },
  {
    slug: 'the-culinary-arctic',
    title: { no: 'The Culinary Arctic', en: 'The Culinary Arctic' },
    summary: {
      no: 'Matopplevelser basert på Barentshavet og nordlige råvarer.',
      en: 'Food experiences shaped by the Barents Sea and northern ingredients.'
    },
    body: {
      no: '<p>Smak deg gjennom arktiske råvarer, lokale menyer og historiene bak maten.</p><p>Perfekt for gourmeter og nysgjerrige matelskere.</p>',
      en: '<p>Taste Arctic ingredients, local menus and the stories behind the food.</p><p>Perfect for gourmets and curious food lovers.</p>'
    },
    tag: { no: 'Smaker', en: 'Flavors' }
  }
];

const main = async () => {
  const publishedAt = new Date();

  for (const concept of concepts) {
    await prisma.concept.upsert({
      where: { slug: concept.slug },
      update: {
        title: concept.title,
        summary: concept.summary,
        body: concept.body,
        tag: concept.tag,
        status: 'PUBLISHED',
        showOnHome: true,
        publishedAt
      },
      create: {
        slug: concept.slug,
        title: concept.title,
        summary: concept.summary,
        body: concept.body,
        tag: concept.tag,
        status: 'PUBLISHED',
        showOnHome: true,
        publishedAt
      }
    });
  }

  console.log(`Seeded ${concepts.length} concepts.`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
