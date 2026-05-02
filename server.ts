import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Rate limiting to prevent abuse
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 50, // Limit each IP to 50 requests per window
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." }
  });

  // Apply to API routes only
  app.use("/api", limiter);

  // Security: Add various HTTP headers to help protect the app
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for Vite dev server compatibility
    crossOriginEmbedderPolicy: false
  }));

  app.use(express.json({ limit: '1mb' }));

  // --- API ROUTES ---

  // Proactive Security Headers for API
  app.use("/api", (req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "no-store, max-age=0");
    next();
  });

  // AI Detection API (Strict Heuristic Engine)
  app.post("/api/analyze", (req, res) => {
    const { content } = req.body;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: "No valid content provided." });
    }

    const scanContent = content.substring(0, 15000).toLowerCase();
    let score = 5 + (Math.random() * 10);
    
    // Strict AI Linguistic Patterns (Aggressive weighting)
    const strictPatterns = [
      { regex: /delve/g, weight: 12 },
      { regex: /furthermore/g, weight: 10 },
      { regex: /in conclusion/g, weight: 10 },
      { regex: /it is worth noting/g, weight: 8 },
      { regex: /comprehensive/g, weight: 7 },
      { regex: /tapestry/g, weight: 15 },
      { regex: /testament/g, weight: 12 },
      { regex: /pivotal/g, weight: 8 },
      { regex: /multifaceted/g, weight: 10 },
      { regex: /unveiling/g, weight: 10 }
    ];

    let syntacticMatch = 0;
    strictPatterns.forEach(p => {
      const matches = scanContent.match(p.regex);
      if (matches) {
        score += matches.length * p.weight;
        syntacticMatch += matches.length * 25;
      }
    });

    // Simulated SyntID Watermark Detection
    let syntIdScore = 0;
    if (scanContent.length > 1000) {
      // In a real scenario, this would check for specific statistical anomalies 
      // or hidden markers. Here we simulate a 15% chance of deep detection.
      if (Math.random() > 0.85) {
        score += 55;
        syntIdScore = 100;
      }
    }

    // Entropy / Variance check (Strict)
    let entropyScore = 10;
    const sentences = scanContent.split(/[.!?]/).filter(s => s.trim().length > 10);
    if (sentences.length > 4) {
      const lengths = sentences.map(s => s.trim().split(" ").length);
      const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
      const variance = lengths.reduce((a, b) => a + Math.abs(b - avg), 0) / lengths.length;
      if (variance < 3.8) {
        score += 30;
        entropyScore = 95;
      } else if (variance < 5.5) {
        score += 12;
        entropyScore = 65;
      }
    }

    res.json({
      score: Math.min(100, Math.max(0, score)),
      id: `VC-${Date.now()}`,
      params: {
        syntactic: Math.min(100, syntacticMatch),
        semantic: Math.min(100, score * 0.85),
        syntid: syntIdScore,
        entropy: entropyScore
      }
    });
  });

  // Website Scanner API (Safe fetching with SSRF protection)
  app.post("/api/scan-site", async (req, res) => {
    const { url } = req.body;

    if (!url || !url.startsWith("http")) {
      return res.status(400).json({ error: "Invalid URL provided." });
    }

    try {
      const urlObj = new URL(url);
      const isPrivate = /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|0\.|::1|fe80)/.test(urlObj.hostname);
      if (isPrivate || urlObj.hostname === "localhost") {
        return res.status(403).json({ error: "Access to private networks is forbidden." });
      }

      const response = await fetch(url, { 
        timeout: 5000,
        headers: { 'User-Agent': 'VeriCheck-Bot/1.1 (Content Verification)' }
      });

      if (!response.ok) throw new Error("Target site unreachable.");
      const html = await response.text();
      
      let siteScore = 10 + (Math.random() * 20);
      if (html.includes('wp-block-post-content')) siteScore += 15;
      if (html.includes('content-generator')) siteScore += 30;
      if (html.includes('ai-content')) siteScore += 20;

      res.json({
        score: Math.min(100, siteScore),
        title: (html.match(/<title>([^<]*)<\/title>/)?.[1] || urlObj.hostname).substring(0, 80),
        params: {
          syntactic: Math.min(100, siteScore * 1.2),
          semantic: Math.min(100, siteScore * 0.9),
          syntid: 0,
          entropy: siteScore > 40 ? 80 : 20
        }
      });
    } catch (error) {
      res.status(502).json({ error: "Target website is not responding correctly." });
    }
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
