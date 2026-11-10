import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { fetchEgyptLiveOracleFromApis } from './app/api/egypt-live-oracle/route.js';
import { buildIndexNowPayload } from './app/api/indexnow/route.js';
import {
  handleGetStealthConfig,
  handlePostStealthConfig,
} from './app/api/stealth-config/route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '5mb' }));

  // 1. Real-Time 60-Second Egypt Live Oracle Server Proxy (`/api/egypt-live-oracle` & `/api/egypt-rates`)
  const handleEgyptOracle = async (req: express.Request, res: express.Response) => {
    try {
      const workmanship = Number(req.query.workmanship) || 120;
      const payload = await fetchEgyptLiveOracleFromApis(workmanship);
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
      res.status(200).json(payload);
    } catch (_err) {
      res.status(500).json({ ok: false, error: 'Oracle sync failed' });
    }
  };

  app.get('/api/egypt-live-oracle', handleEgyptOracle);
  app.get('/api/egypt-rates', handleEgyptOracle);

  // 2. IndexNow SEO Instant Indexing Endpoint (`/api/indexnow`)
  app.get('/api/indexnow', (_req, res) => {
    const payload = buildIndexNowPayload();
    res.status(200).json({ ok: true, payload });
  });

  // 3. Stealth Master Admin Cloud Config & PIN Verification Endpoint (`/api/stealth-config`)
  app.get('/api/stealth-config', (_req, res) => {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).json(handleGetStealthConfig());
  });

  app.post('/api/stealth-config', (req, res) => {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    const pinHashHeader = String(req.headers['x-stealth-pin-hash'] || req.body?.pinHash || '');
    const result = handlePostStealthConfig(req.body || {}, pinHashHeader);
    res.status(result.status).json(result.payload);
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dix Tools Server & 60s Live Oracle listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
