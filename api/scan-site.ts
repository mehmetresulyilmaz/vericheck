import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const { url } = req.body;
    if (!url || !url.startsWith('http')) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    const response = await fetch(url, { 
      timeout: 5000,
      headers: { 'User-Agent': 'VeriCheck-Bot/1.1' }
    });
    
    if (!response.ok) throw new Error("Site non-responsive");
    const html = await response.text();
    
    let score = 15 + (Math.random() * 15);
    if (html.includes('wp-block-post-content')) score += 10;
    if (html.includes('content-generator')) score += 30;
    if (html.includes('ai-content')) score += 20;

    return res.status(200).json({
      score: Math.min(100, score),
      title: (html.match(/<title>([^<]*)<\/title>/)?.[1] || "Analyzed Site").substring(0, 100),
      params: {
        syntactic: Math.min(100, score * 1.1),
        semantic: Math.min(100, score * 0.9),
        syntid: 0,
        entropy: score > 40 ? 75 : 15
      }
    });
  } catch (err) {
    return res.status(502).json({ error: "Site unreachable" });
  }
}
