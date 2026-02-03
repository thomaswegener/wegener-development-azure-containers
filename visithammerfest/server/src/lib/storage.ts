import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { env } from '../env.js';

export type StorageProvider = 'LOCAL' | 'AZURE_BLOB';

export type StorageResult = {
  provider: StorageProvider;
  storagePath: string;
  originalName: string;
};

const safeName = (name: string) => name.replace(/[^A-Za-z0-9._-]+/g, '_');

export const writeLocalFile = async (buffer: Buffer, originalName: string, targetType: string, targetId: string) => {
  const ext = path.extname(originalName);
  const base = crypto.randomUUID();
  const fileName = `${base}${ext}`;
  const safeFile = safeName(fileName);
  const relativeDir = path.join(targetType, targetId);
  const relativePath = path.join(relativeDir, safeFile);
  const fullDir = path.join(env.uploadDir, relativeDir);
  const fullPath = path.join(env.uploadDir, relativePath);

  await fs.mkdir(fullDir, { recursive: true });
  await fs.writeFile(fullPath, buffer);

  return { provider: 'LOCAL', storagePath: relativePath, originalName } as StorageResult;
};

const azureBaseUrl = () => {
  if (!env.azureStorageAccount || !env.azureStorageContainer) return '';
  return `https://${env.azureStorageAccount}.blob.core.windows.net/${env.azureStorageContainer}`;
};

export const publicUrlFor = (storagePath: string, provider: StorageProvider = 'LOCAL') => {
  if (provider === 'AZURE_BLOB') {
    const base = azureBaseUrl();
    return base ? `${base}/${storagePath}` : storagePath;
  }
  return `${env.publicBaseUrl}/uploads/${storagePath}`;
};
