import 'dotenv/config';
import { prisma } from '../dist/src/db.js';

const hasText = (value) => typeof value === 'string' && value.trim().length > 0;

const fillLocalized = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { value, changed: false };
  }

  const hasEn = hasText(value.en);
  const hasNo = hasText(value.no);

  if (!hasEn && hasNo) {
    return {
      value: { ...value, en: value.no ?? '' },
      changed: true
    };
  }

  return { value, changed: false };
};

const updateLocalizedFields = async (items, buildUpdate, applyUpdate) => {
  let updated = 0;
  for (const item of items) {
    const data = buildUpdate(item);
    if (data && Object.keys(data).length > 0) {
      // eslint-disable-next-line no-await-in-loop
      await applyUpdate(item.id, data);
      updated += 1;
    }
  }
  return updated;
};

const main = async () => {
  console.log('Publishing legacy media links…');

  const legacyMediaIds = await prisma.mediaAsset.findMany({
    where: {
      storagePath: {
        startsWith: 'legacy/'
      }
    },
    select: { id: true }
  });

  const legacyIds = legacyMediaIds.map((media) => media.id);
  const publishResult = await prisma.mediaLink.updateMany({
    where: {
      mediaId: { in: legacyIds },
      isPublished: false
    },
    data: { isPublished: true }
  });

  console.log(`Published ${publishResult.count} legacy media links.`);

  console.log('Filling missing English translations…');

  let totalUpdates = 0;

  const partners = await prisma.partner.findMany();
  totalUpdates += await updateLocalizedFields(
    partners,
    (partner) => {
      const updates = {};
      const name = fillLocalized(partner.name);
      if (name.changed) updates.name = name.value;
      const short = fillLocalized(partner.short);
      if (short.changed) updates.short = short.value;
      const description = fillLocalized(partner.description);
      if (description.changed) updates.description = description.value;
      const buttonLabel = fillLocalized(partner.buttonLabel);
      if (buttonLabel.changed) updates.buttonLabel = buttonLabel.value;
      return Object.keys(updates).length > 0 ? updates : null;
    },
    (id, data) => prisma.partner.update({ where: { id }, data })
  );

  const activities = await prisma.activity.findMany();
  totalUpdates += await updateLocalizedFields(
    activities,
    (activity) => {
      const updates = {};
      const name = fillLocalized(activity.name);
      if (name.changed) updates.name = name.value;
      const short = fillLocalized(activity.short);
      if (short.changed) updates.short = short.value;
      const description = fillLocalized(activity.description);
      if (description.changed) updates.description = description.value;
      return Object.keys(updates).length > 0 ? updates : null;
    },
    (id, data) => prisma.activity.update({ where: { id }, data })
  );

  const stores = await prisma.store.findMany();
  totalUpdates += await updateLocalizedFields(
    stores,
    (store) => {
      const updates = {};
      const name = fillLocalized(store.name);
      if (name.changed) updates.name = name.value;
      const short = fillLocalized(store.short);
      if (short.changed) updates.short = short.value;
      const description = fillLocalized(store.description);
      if (description.changed) updates.description = description.value;
      const buttonLabel = fillLocalized(store.buttonLabel);
      if (buttonLabel.changed) updates.buttonLabel = buttonLabel.value;
      return Object.keys(updates).length > 0 ? updates : null;
    },
    (id, data) => prisma.store.update({ where: { id }, data })
  );

  const articles = await prisma.article.findMany();
  totalUpdates += await updateLocalizedFields(
    articles,
    (article) => {
      const updates = {};
      const title = fillLocalized(article.title);
      if (title.changed) updates.title = title.value;
      const summary = fillLocalized(article.summary);
      if (summary.changed) updates.summary = summary.value;
      const body = fillLocalized(article.body);
      if (body.changed) updates.body = body.value;
      const buttonLabel = fillLocalized(article.buttonLabel);
      if (buttonLabel.changed) updates.buttonLabel = buttonLabel.value;
      return Object.keys(updates).length > 0 ? updates : null;
    },
    (id, data) => prisma.article.update({ where: { id }, data })
  );

  const siteInfos = await prisma.siteInfo.findMany();
  totalUpdates += await updateLocalizedFields(
    siteInfos,
    (info) => {
      const updates = {};
      const name = fillLocalized(info.name);
      if (name.changed) updates.name = name.value;
      const short = fillLocalized(info.short);
      if (short.changed) updates.short = short.value;
      const description = fillLocalized(info.description);
      if (description.changed) updates.description = description.value;
      const buttonLabel = fillLocalized(info.buttonLabel);
      if (buttonLabel.changed) updates.buttonLabel = buttonLabel.value;
      return Object.keys(updates).length > 0 ? updates : null;
    },
    (id, data) => prisma.siteInfo.update({ where: { id }, data })
  );

  const faqs = await prisma.faq.findMany();
  totalUpdates += await updateLocalizedFields(
    faqs,
    (faq) => {
      const updates = {};
      const question = fillLocalized(faq.question);
      if (question.changed) updates.question = question.value;
      const answer = fillLocalized(faq.answer);
      if (answer.changed) updates.answer = answer.value;
      return Object.keys(updates).length > 0 ? updates : null;
    },
    (id, data) => prisma.faq.update({ where: { id }, data })
  );

  console.log(`Updated ${totalUpdates} records with EN fallbacks.`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
