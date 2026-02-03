import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const decodeHtml = (value) =>
  value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");

const cleanPlainText = (value) =>
  decodeHtml(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const cleanRichText = (value) => {
  if (!value) return '';
  let cleaned = decodeHtml(value);
  cleaned = cleaned
    .replace(/<\s*\/?\s*ql-[^>]*>/gi, '')
    .replace(/<\s*span[^>]*>/gi, '')
    .replace(/<\/\s*span\s*>/gi, '')
    .replace(/<\s*font[^>]*>/gi, '')
    .replace(/<\/\s*font\s*>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/<p>\s*<\/p>/gi, '')
    .replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, '')
    .replace(/<p>\s*(<p>)+/gi, '<p>')
    .replace(/<\/p>\s*(<\/p>)+/gi, '</p>')
    .replace(/\s{2,}/g, ' ');
  return cleaned.trim();
};

const cleanLocalized = (value, cleaner) => {
  if (!value || typeof value !== 'object') return value;
  const next = {
    no: value.no ? cleaner(String(value.no)) : '',
    en: value.en ? cleaner(String(value.en)) : ''
  };
  return next;
};

const updateModel = async (model, fields) => {
  const records = await prisma[model].findMany();
  let updated = 0;

  for (const record of records) {
    const data = {};
    let changed = false;
    for (const [field, cleaner] of fields) {
      const cleaned = cleanLocalized(record[field], cleaner);
      if (cleaned && JSON.stringify(cleaned) !== JSON.stringify(record[field] ?? {})) {
        data[field] = cleaned;
        changed = true;
      }
    }
    if (changed) {
      await prisma[model].update({ where: { id: record.id }, data });
      updated += 1;
    }
  }

  return { total: records.length, updated };
};

const run = async () => {
  const results = [];
  results.push(
    await updateModel('siteInfo', [
      ['name', cleanPlainText],
      ['short', cleanRichText],
      ['description', cleanRichText],
      ['buttonLabel', cleanPlainText]
    ])
  );
  results.push(
    await updateModel('location', [
      ['name', cleanPlainText],
      ['summary', cleanRichText]
    ])
  );
  results.push(
    await updateModel('activity', [
      ['name', cleanPlainText],
      ['short', cleanRichText],
      ['description', cleanRichText]
    ])
  );
  results.push(
    await updateModel('partner', [
      ['name', cleanPlainText],
      ['short', cleanRichText],
      ['description', cleanRichText],
      ['buttonLabel', cleanPlainText]
    ])
  );
  results.push(
    await updateModel('store', [
      ['name', cleanPlainText],
      ['short', cleanRichText],
      ['description', cleanRichText],
      ['buttonLabel', cleanPlainText]
    ])
  );
  results.push(
    await updateModel('concept', [
      ['title', cleanPlainText],
      ['summary', cleanRichText],
      ['body', cleanRichText],
      ['tag', cleanPlainText]
    ])
  );
  results.push(
    await updateModel('article', [
      ['title', cleanPlainText],
      ['summary', cleanRichText],
      ['body', cleanRichText],
      ['buttonLabel', cleanPlainText]
    ])
  );
  results.push(
    await updateModel('faq', [
      ['question', cleanRichText],
      ['answer', cleanRichText]
    ])
  );

  results.forEach((result, index) => {
    const labels = ['siteInfo', 'location', 'activity', 'partner', 'store', 'concept', 'article', 'faq'];
    const label = labels[index] || `model-${index}`;
    console.log(`${label}: ${result.updated} updated of ${result.total}`);
  });
};

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
