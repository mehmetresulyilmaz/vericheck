import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { content } = req.body;
  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: "No content provided" });
  }

  // Strict Heuristic Patterns
  const aiPatterns = [
    /delve/g, /furthermore/g, /in conclusion/g, /it is worth noting/g, 
    /comprehensive/g, /tapestry/g, /testament/g, /at the end of the day/g,
    /pivotal/g, /multifaceted/g, /unveiling/g
  ];

  let detectionParams: any = {
    syntactic: 0,
    semantic: 0,
    syntid: 0,
    entropy: 0
  };

  aiPatterns.forEach(p => {
    const matches = scanContent.match(p);
    if (matches) {
       score += matches.length * 8; // Higher penalty
       detectionParams.syntactic += matches.length * 20;
    }
  });

  // Simulated SyntID Verification (Watermark detection)
  if (scanContent.length > 2000) {
    if (Math.random() > 0.85) { // Simulated hit
        score += 45;
        detectionParams.syntid = 100;
    }
  }

  const sentences = scanContent.split(/[.!?]/).filter(s => s.trim().length > 10);
  if (sentences.length > 5) {
     const lengths = sentences.map(s => s.trim().split(" ").length);
     const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
     const variance = lengths.reduce((a, b) => a + Math.abs(b - avg), 0) / lengths.length;
     
     if (variance < 3.5) { 
        score += 25; // Very strict on consistent length (AI trait)
        detectionParams.entropy = 90;
     } else if (variance < 5) {
        score += 10;
        detectionParams.entropy = 60;
     }
  }

  res.status(200).json({
    score: Math.min(100, Math.max(0, score)),
    id: `VC-${Date.now()}`,
    params: {
        syntactic: Math.min(100, detectionParams.syntactic),
        semantic: Math.min(100, score * 0.8),
        syntid: detectionParams.syntid,
        entropy: detectionParams.entropy
    }
  });
}
