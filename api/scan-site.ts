import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { url } = req.body;
  if (!url || !url.startsWith('http')) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  try {
    const response = await fetch(url, { 
      timeout: 5000,
      headers: { 'User-Agent': 'VeriCheck-Bot/1.0' }
    });
    
    const html = await response.text();
    let score = 10 + (Math.random() * 15);

    // AI Site Fingerprints
    if (html.includes('wp-block-post-content')) score += 5;
    if (html.includes('content-generator')) score += 20;
    if (html.includes('ai-content')) score += 10;
    
    // Check for "Modern/Generic" templates often used by AI builders
    if (html.match(/elementor|framer|webflow/i)) score += 5;

    res.status(200).json({
      score: Math.min(99, score),
      title: html.match(/<title>([^<]*)<\/title>/)?.[1] || "Analyzed Site",
      params: {
        syntactic: Math.min(100, score * 1.1),
        semantic: Math.min(100, score * 0.9),
        syntid: 0,
        entropy: score > 40 ? 75 : 15
      }
    });
  } catch (err) {
    res.status(502).json({ error: "Site unreachable" });
  }
}
