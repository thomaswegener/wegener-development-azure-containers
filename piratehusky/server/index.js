/* eslint-env node */
/* global process */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile, writeFile, mkdir } from 'fs/promises';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, 'data', 'dogs.json');
const DIST_PATH = path.join(__dirname, '../dist');

const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 4173 : 4000);
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'pirate-lulu';
const JWT_SECRET = process.env.JWT_SECRET || 'piratehusky-secret';
const LANGUAGES = ['en', 'no', 'de', 'fr', 'es'];

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const host = (req.headers.host || '').replace(/:\d+$/, '');
  if (host === 'sledespesialisten.no' || host === 'www.sledespesialisten.no') {
    return res.redirect(301, 'https://piratehusky.no/sledespesialisten');
  }
  next();
});

const slugify = (value = '') =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();

const ensureDescriptions = (descriptions = {}) =>
  LANGUAGES.reduce((acc, lang) => {
    acc[lang] = descriptions[lang] ?? '';
    return acc;
  }, {});

async function readDogs() {
  try {
    const raw = await readFile(DATA_PATH, 'utf-8');
    const data = JSON.parse(raw);
    return data.dogs ?? [];
  } catch (err) {
    if (err.code === 'ENOENT') {
      await mkdir(path.dirname(DATA_PATH), { recursive: true });
      await writeDogs([]);
      return [];
    }
    throw err;
  }
}

async function writeDogs(dogs) {
  await mkdir(path.dirname(DATA_PATH), { recursive: true });
  await writeFile(DATA_PATH, JSON.stringify({ dogs }, null, 2), 'utf-8');
}

function requireAuth(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = authorization.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    console.error('JWT verification failed', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token, username });
});

app.get('/api/dogs', async (_req, res) => {
  const dogs = await readDogs();
  res.json({ dogs });
});

app.get('/api/dogs/:id', async (req, res) => {
  const dogs = await readDogs();
  const dog = dogs.find((item) => item.id === req.params.id);
  if (!dog) {
    return res.status(404).json({ message: 'Dog not found' });
  }
  res.json(dog);
});

app.post('/api/dogs', requireAuth, async (req, res) => {
  const { name, birth = '', image = '', descriptions = {} } = req.body || {};
  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }
  const dogs = await readDogs();
  const baseId = slugify(name) || `dog-${Date.now()}`;
  let finalId = baseId;
  if (dogs.some((dog) => dog.id === finalId)) {
    finalId = `${baseId}-${Date.now()}`;
  }
  const dog = {
    id: finalId,
    name,
    birth,
    image: image || slugify(name),
    descriptions: ensureDescriptions(descriptions)
  };
  dogs.push(dog);
  await writeDogs(dogs);
  res.status(201).json(dog);
});

app.put('/api/dogs/:id', requireAuth, async (req, res) => {
  const dogs = await readDogs();
  const index = dogs.findIndex((dog) => dog.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Dog not found' });
  }
  const current = dogs[index];
  const { name, birth, image, descriptions } = req.body || {};
  const updatedDog = {
    ...current,
    name: name ?? current.name,
    birth: birth ?? current.birth,
    image: image ? image.trim() : current.image,
    descriptions: descriptions ? ensureDescriptions(descriptions) : current.descriptions
  };
  dogs[index] = updatedDog;
  await writeDogs(dogs);
  res.json(updatedDog);
});

app.delete('/api/dogs/:id', requireAuth, async (req, res) => {
  const dogs = await readDogs();
  const index = dogs.findIndex((dog) => dog.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Dog not found' });
  }
  dogs.splice(index, 1);
  await writeDogs(dogs);
  res.status(204).end();
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(DIST_PATH));
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_PATH, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Pirate Husky API listening on port ${PORT}`);
});
