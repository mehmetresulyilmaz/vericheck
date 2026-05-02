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

  // AI Detection API (Heuristic Engine) - Data is strictly in-memory
  app.post("/api/analyze", (req, res) => {
    const { content } = req.body;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: "No valid content provided for analysis." });
    }

    // Limit analysis length for performance
    const scanContent = content.substring(0, 15000);
    const lowerContent = scanContent.toLowerCase();
    
    let score = 5 + (Math.random() * 15);
    
    // Human markers (natural entropy)
    const humanMarkers = ["i think", "personal opinion", "in my view", "actually", "perhaps"];
    humanMarkers.forEach(m => { if (lowerContent.includes(m)) score -= 3; });

    // AI markers (overly formal/repetitive)
    const aiPatterns = [/delve/g, /furthermore/g, /in conclusion/g, /it is worth noting/g, /comprehensive/g];
    aiPatterns.forEach(p => {
      const matches = lowerContent.match(p);
      if (matches) score += matches.length * 4;
    });

    if (scanContent.length > 500 && scanContent.split(" ").length > 50) {
        // AI often has very consistent sentence lengths
        const sentences = scanContent.split(/[.!?]/);
        const lengths = sentences.map(s => s.trim().split(" ").length).filter(l => l > 3);
        const variance = lengths.reduce((acc, l) => acc + Math.abs(l - 15), 0) / lengths.length;
        if (variance < 5) score += 10; // Low variance = more likely synthetic
    }

    const finalScore = Math.min(99.6, Math.max(0.4, score));

    res.json({
      score: finalScore,
      id: `VC-${Date.now()}`
    });
  });

  // Website Scanner API (Safe fetching with SSRF protection)
  app.post("/api/scan-site", async (req, res) => {
    const { url } = req.body;

    if (!url || !url.startsWith("http")) {
      return res.status(400).json({ error: "A valid URL starting with http/https is required." });
    }

    try {
      const urlObj = new URL(url);
      
      // Strict SSRF protection
      const isPrivate = /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|0\.|::1|fe80)/.test(urlObj.hostname);
      if (isPrivate || urlObj.hostname === "localhost") {
        return res.status(403).json({ error: "Access to the requested URL is restricted." });
      }

      const response = await fetch(url, { 
        timeout: 4000,
        headers: { 'User-Agent': 'VeriCheck-Bot/1.0 (Content Verification)' }
      });

      if (!response.ok) throw new Error("Target site returned non-200 response.");
      
      const html = await response.text();
      
      // Look for AI blog footprints or generic auto-generated CMS patterns
      let siteScore = 10 + (Math.random() * 20);
      if (html.includes('wp-block-post-content')) siteScore += 5;
      if (html.includes('content-generator')) siteScore += 15;
      
      const title = html.match(/<title>([^<]*)<\/title>/)?.[1] || urlObj.hostname;

      res.json({
        score: Math.min(99, siteScore),
        title: title.substring(0, 100)
      });
    } catch (error: any) {
      res.status(502).json({ error: "Target website unreachable or timed out." });
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
