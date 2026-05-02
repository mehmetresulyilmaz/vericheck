import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { content } = req.body;
  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: "No content provided" });
  }

  const scanContent = content.substring(0, 10000).toLowerCase();
  let score = 8 + (Math.random() * 12);

  // Heuristic Patterns
  const aiPatterns = [/delve/g, /furthermore/g, /in conclusion/g, /it is worth noting/g, /comprehensive/g, /tapestry/g, /testament/g];
  aiPatterns.forEach(p => {
    const matches = scanContent.match(p);
    if (matches) score += matches.length * 5;
  });

  const sentences = scanContent.split(/[.!?]/).filter(s => s.trim().length > 10);
  if (sentences.length > 5) {
     const lengths = sentences.map(s => s.trim().split(" ").length);
     const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
     const variance = lengths.reduce((a, b) => a + Math.abs(b - avg), 0) / lengths.length;
     if (variance < 4) score += 15; // Unusually consistent sentence lengths
  }

  res.status(200).json({
    score: Math.min(99.6, Math.max(0.4, score)),
    id: `VC-${Date.now()}`
  });
}
