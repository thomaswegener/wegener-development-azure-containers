import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { notionService } from './notionClient.js';
dotenv.config();
const app = express();
const notion = notionService();
app.use(cors());
app.use(express.json());
app.get('/api/calendar', async (_req, res) => {
    try {
        const response = await notion.getCalendarResponse();
        res.json(response);
    }
    catch (error) {
        console.error('Calendar endpoint failed', error);
        const message = process.env.NODE_ENV === 'production'
            ? 'Kunne ikke hente aktiviteter fra Notion akkurat nå.'
            : error instanceof Error
                ? error.message
                : 'Kunne ikke hente aktiviteter fra Notion akkurat nå.';
        res.status(500).json({ message });
    }
});
app.get('/api/about', async (_req, res) => {
    try {
        const response = await notion.getAboutResponse();
        res.json(response);
    }
    catch (error) {
        console.error('About endpoint failed', error);
        const message = process.env.NODE_ENV === 'production'
            ? 'Kunne ikke hente Om oss innhold akkurat nå.'
            : error instanceof Error
                ? error.message
                : 'Kunne ikke hente Om oss innhold akkurat nå.';
        res.status(500).json({ message });
    }
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
if (fs.existsSync(distDir)) {
    app.use(express.static(distDir));
    app.get(/.*/, (_req, res) => {
        res.sendFile(path.join(distDir, 'index.html'));
    });
}
const port = Number(process.env.PORT ?? process.env.SERVER_PORT ?? 4000);
app.listen(port, () => {
    console.log(`Server ready on port ${port}`);
});
