import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';
import { prisma } from '../src/db.js';
import { slugFromLocalized, slugify } from '../src/lib/slug.js';

const legacyUploadDir =
  process.env.LEGACY_UPLOAD_DIR ??
  '/home/wegener/containers/lampstack/apache/www/visithammerfest.no/assets/images/uploads';
const legacyMysqlHost = process.env.LEGACY_MYSQL_HOST ?? 'lamp-mysql';
const legacyMysqlUser = process.env.LEGACY_MYSQL_USER ?? 'visithammerfest';
const legacyMysqlPassword = process.env.LEGACY_MYSQL_PASSWORD ?? 'Pa6jgVzHFjdXKbTq';
const legacyMysqlDatabase = process.env.LEGACY_MYSQL_DATABASE ?? 'visithammerfest';

const uploadDir = process.env.UPLOAD_DIR ?? path.resolve('server/uploads');
const legacyTargetDir = path.join(uploadDir, 'legacy');

const parseSerializedArray = (value: string | null) => {
  if (!value || value === 'N;') return [] as string[];
  const matches = [...value.matchAll(/s:\d+:"(.*?)"/g)];
  return matches.map((match) => match[1]);
};

const normalizeText = (value: string | null) => (value ? value : null);

const resolveFilename = (value: string | null) => {
  if (!value) return null;
  try {
    const cleaned = value.split('?')[0];
    const parts = cleaned.split('/');
    return parts[parts.length - 1] || null;
  } catch {
    return null;
  }
};

const mimeFromFile = (filename: string) => {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  return 'application/octet-stream';
};

const copyLegacyFile = async (filename: string) => {
  const sourcePath = path.join(legacyUploadDir, filename);
  const targetPath = path.join(legacyTargetDir, filename);

  try {
    await fs.mkdir(legacyTargetDir, { recursive: true });
    await fs.copyFile(sourcePath, targetPath);
    return path.join('legacy', filename);
  } catch {
    return null;
  }
};

const importMediaFromValue = async (value: string | null) => {
  const filename = resolveFilename(value);
  if (!filename) return null;

  const copiedPath = await copyLegacyFile(filename);
  if (!copiedPath) return null;

  const stats = await fs.stat(path.join(legacyTargetDir, filename));
  const asset = await prisma.mediaAsset.create({
    data: {
      provider: 'LOCAL',
      storagePath: copiedPath,
      originalName: filename,
      contentType: mimeFromFile(filename),
      fileSize: stats.size,
      sourceUrl: value ?? null
    }
  });

  return asset.id;
};

const publishedAtFor = (status: 'PUBLISHED' | 'DRAFT', dateValue?: string | null) => {
  if (status !== 'PUBLISHED') return null;
  if (dateValue) {
    const parsed = new Date(dateValue);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
};

const uniqueSlug = (base: string, used: Set<string>) => {
  if (!base) return null;
  let candidate = base;
  let index = 2;
  while (used.has(candidate)) {
    candidate = `${base}-${index}`;
    index += 1;
  }
  used.add(candidate);
  return candidate;
};

const main = async () => {
  const mysqlConn = await mysql.createConnection({
    host: legacyMysqlHost,
    user: legacyMysqlUser,
    password: legacyMysqlPassword,
    database: legacyMysqlDatabase
  });

  const [partners] = await mysqlConn.query<any[]>('SELECT * FROM partner');
  const partnerIdMap = new Map<number, string>();
  const partnerSlugs = new Set<string>();

  for (const partner of partners) {
    const status = partner.active === 1 ? 'PUBLISHED' : 'DRAFT';
    const name = { en: partner.name ?? '', no: partner.name ?? '' };
    const slug = uniqueSlug(slugFromLocalized(name), partnerSlugs);
    const created = await prisma.partner.create({
      data: {
        legacyId: partner.id,
        status,
        publishedAt: publishedAtFor(status),
        name,
        short: { en: partner.short ?? '', no: partner.nshort ?? '' },
        description: { en: partner.description ?? '', no: partner.ndescription ?? '' },
        buttonLabel: { en: partner.button ?? '', no: partner.nbutton ?? '' },
        facebook: normalizeText(partner.facebook),
        twitter: normalizeText(partner.twitter),
        instagram: normalizeText(partner.instagram),
        youtube: normalizeText(partner.youtube),
        address: normalizeText(partner.adress),
        email: normalizeText(partner.email),
        phone: normalizeText(partner.phone),
        website: normalizeText(partner.website),
        category: parseSerializedArray(partner.category),
        location: parseSerializedArray(partner.location),
        target: parseSerializedArray(partner.target),
        mapEmbed: normalizeText(partner.map),
        slug: slug ?? undefined
      }
    });

    const heroMediaId = await importMediaFromValue(partner.image);
    const logoMediaId = await importMediaFromValue(partner.logo_png);
    if (heroMediaId || logoMediaId) {
      await prisma.partner.update({
        where: { id: created.id },
        data: {
          heroMediaId: heroMediaId ?? undefined,
          logoMediaId: logoMediaId ?? undefined
        }
      });
    }

    partnerIdMap.set(partner.id, created.id);
  }

  const [activities] = await mysqlConn.query<any[]>('SELECT * FROM activity');
  const activityIdMap = new Map<number, string>();
  const activitySlugs = new Set<string>();

  for (const activity of activities) {
    const partnerId = activity.pid ? partnerIdMap.get(activity.pid) : null;
    const status = activity.active === 1 ? 'PUBLISHED' : 'DRAFT';
    const name = { en: activity.name ?? '', no: activity.nname ?? '' };
    const slug = uniqueSlug(slugFromLocalized(name), activitySlugs);
    const created = await prisma.activity.create({
      data: {
        legacyId: activity.id,
        partnerId: partnerId ?? null,
        status,
        publishedAt: publishedAtFor(status),
        name,
        short: { en: activity.short ?? '', no: activity.nshort ?? '' },
        description: { en: activity.body ?? '', no: activity.nbody ?? '' },
        category: parseSerializedArray(activity.type),
        season: parseSerializedArray(activity.season),
        location: parseSerializedArray(activity.location),
        mapEmbed: normalizeText(activity.map),
        capacity: normalizeText(activity.capacity),
        slug: slug ?? undefined
      }
    });

    const heroMediaId = await importMediaFromValue(activity.link);
    if (heroMediaId) {
      await prisma.activity.update({
        where: { id: created.id },
        data: { heroMediaId }
      });
    }

    activityIdMap.set(activity.id, created.id);
  }

  const [stores] = await mysqlConn.query<any[]>('SELECT * FROM store');
  const storeIdMap = new Map<number, string>();
  const storeSlugs = new Set<string>();

  for (const store of stores) {
    const status = store.active === 1 ? 'PUBLISHED' : 'DRAFT';
    const name = { en: store.name ?? '', no: store.nname ?? store.name ?? '' };
    const slug = uniqueSlug(slugFromLocalized(name), storeSlugs);
    const created = await prisma.store.create({
      data: {
        legacyId: store.id,
        status,
        publishedAt: publishedAtFor(status),
        name,
        short: { en: store.short ?? '', no: store.nshort ?? '' },
        description: { en: store.description ?? '', no: store.ndescription ?? '' },
        buttonLabel: { en: store.button ?? '', no: store.nbutton ?? '' },
        facebook: normalizeText(store.facebook),
        twitter: normalizeText(store.twitter),
        instagram: normalizeText(store.instagram),
        youtube: normalizeText(store.youtube),
        address: normalizeText(store.adress),
        email: normalizeText(store.email),
        phone: normalizeText(store.phone),
        website: normalizeText(store.website),
        category: parseSerializedArray(store.category),
        location: parseSerializedArray(store.location),
        target: parseSerializedArray(store.target),
        mapEmbed: normalizeText(store.map),
        slug: slug ?? undefined
      }
    });

    const heroMediaId = await importMediaFromValue(store.image);
    const logoMediaId = await importMediaFromValue(store.logo_png);
    if (heroMediaId || logoMediaId) {
      await prisma.store.update({
        where: { id: created.id },
        data: {
          heroMediaId: heroMediaId ?? undefined,
          logoMediaId: logoMediaId ?? undefined
        }
      });
    }

    storeIdMap.set(store.id, created.id);
  }

  const [articles] = await mysqlConn.query<any[]>('SELECT * FROM article');
  const articleIdMap = new Map<number, string>();
  const articleSlugs = new Set<string>();

  for (const article of articles) {
    const status = article.active === 1 ? 'PUBLISHED' : 'DRAFT';
    const title = { en: article.name ?? '', no: article.nname ?? '' };
    const slugBase = slugFromLocalized(title) || slugify(article.name ?? '');
    const slug = uniqueSlug(slugBase, articleSlugs);
    const type = article.type ? String(article.type).trim().toLowerCase() : null;
    const created = await prisma.article.create({
      data: {
        legacyId: article.id,
        status,
        publishedAt: publishedAtFor(status, article.date),
        title,
        summary: { en: article.short ?? '', no: article.nshort ?? '' },
        body: { en: article.body ?? '', no: article.nbody ?? '' },
        author: normalizeText(article.author),
        priority: article.priority ?? null,
        buttonLabel: { en: article.button ?? '', no: article.nbutton ?? '' },
        buttonLink: normalizeText(article.button_link),
        slug: slug ?? undefined,
        type
      }
    });

    const heroMediaId = await importMediaFromValue(article.image);
    if (heroMediaId) {
      await prisma.article.update({
        where: { id: created.id },
        data: { heroMediaId }
      });
    }

    articleIdMap.set(article.id, created.id);
  }

  const [infoRows] = await mysqlConn.query<any[]>('SELECT * FROM information LIMIT 1');
  const info = infoRows[0];
  if (info) {
    const status = 'PUBLISHED';
    const createdInfo = await prisma.siteInfo.create({
      data: {
        status,
        publishedAt: publishedAtFor(status),
        name: { en: info.name ?? '', no: info.name ?? '' },
        short: { en: info.short ?? '', no: info.nshort ?? '' },
        description: { en: info.description ?? '', no: info.ndescription ?? '' },
        buttonLabel: { en: info.button ?? '', no: info.nbutton ?? '' },
        buttonLink: normalizeText(info.button_link),
        facebook: normalizeText(info.facebook),
        twitter: normalizeText(info.twitter),
        instagram: normalizeText(info.instagram),
        youtube: normalizeText(info.youtube),
        address: normalizeText(info.adress),
        email: normalizeText(info.email),
        website: normalizeText(info.website),
        mapEmbed: normalizeText(info.map)
      }
    });

    const heroMediaId = await importMediaFromValue(info.image);
    const logoMediaId = await importMediaFromValue(info.logo_png);
    if (heroMediaId || logoMediaId) {
      await prisma.siteInfo.update({
        where: { id: createdInfo.id },
        data: {
          heroMediaId: heroMediaId ?? undefined,
          logoMediaId: logoMediaId ?? undefined
        }
      });
    }
  }

  const [faqs] = await mysqlConn.query<any[]>('SELECT * FROM faq');
  for (const faq of faqs) {
    const status = 'PUBLISHED';
    await prisma.faq.create({
      data: {
        legacyId: faq.id,
        status,
        publishedAt: publishedAtFor(status),
        category: normalizeText(faq.category),
        question: { en: faq.question ?? '', no: faq.nquestion ?? '' },
        answer: { en: faq.answer ?? '', no: faq.nanswer ?? '' }
      }
    });
  }

  const [files] = await mysqlConn.query<any[]>('SELECT * FROM files');
  for (const file of files) {
    const filename = file.filename as string;
    const copiedPath = await copyLegacyFile(filename);
    if (!copiedPath) continue;

    const stats = await fs.stat(path.join(legacyTargetDir, filename));
    const asset = await prisma.mediaAsset.create({
      data: {
        provider: 'LOCAL',
        storagePath: copiedPath,
        originalName: filename,
        contentType: mimeFromFile(filename),
        fileSize: stats.size,
        sourceUrl: null
      }
    });

    let targetId: string | undefined;
    let targetType: 'PARTNER' | 'ACTIVITY' | 'STORE' | 'ARTICLE' | undefined;

    if (file.page === 'partner') {
      targetId = partnerIdMap.get(file.pageid);
      targetType = 'PARTNER';
    } else if (file.page === 'activity') {
      targetId = activityIdMap.get(file.pageid);
      targetType = 'ACTIVITY';
    } else if (file.page === 'store') {
      targetId = storeIdMap.get(file.pageid);
      targetType = 'STORE';
    } else if (file.page === 'article') {
      targetId = articleIdMap.get(file.pageid);
      targetType = 'ARTICLE';
    }

    if (targetId && targetType) {
      await prisma.mediaLink.create({
        data: {
          mediaId: asset.id,
          targetType,
          targetId,
          label: file.photographer ?? null
        }
      });
    }
  }

  await mysqlConn.end();
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
