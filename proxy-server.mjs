/**
 * Simple Proxy Server for StormTracker
 *
 * This server proxies requests from the browser to various APIs,
 * avoiding CORS issues while keeping your API key secure.
 *
 * USAGE:
 * 1. Install dependencies: npm install express cors
 * 2. Run: npm run proxy
 * 3. Set in .env: VITE_PROXY_URL=http://localhost:3001
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Translation proxy endpoint using LibreTranslate
app.get('/api/translate', async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.query;

    if (!text || !sourceLang || !targetLang) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const url = 'https://libretranslate.de/translate';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: text.toString(),
        source: sourceLang,
        target: targetLang,
        format: 'text'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('LibreTranslate API error:', data);
      return res.status(response.status).json(data);
    }

    res.json({ translation: data.translatedText });
  } catch (error) {
    console.error('Translation proxy error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// OpenAI proxy endpoint
app.post('/api/openai', async (req, res) => {
  try {
    const { apiKey, model, messages, temperature, max_tokens } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Proxy server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🌩️  StormTracker Proxy Server running on http://localhost:${PORT}`);
  console.log(`📡 Translation endpoint: http://localhost:${PORT}/api/translate`);
  console.log(`📡 OpenAI endpoint: http://localhost:${PORT}/api/openai`);
  console.log(`\nSet in your .env file:`);
  console.log(`VITE_PROXY_URL=http://localhost:${PORT}\n`);
});
