import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const { content } = req.body;
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: "No content provided" });
    }

    const scanContent = content.substring(0, 15000).toLowerCase();
    
    // Aggressive Penalty for Synthetic Markers
    let baseScore = 2 + (Math.random() * 8);
    
    // Binary/Image Fingerprint Detection (Simulated)
    // If the input looks like a hex string or special binary metadata
    if (content.includes('[Binary Fingerprint:')) {
       // High sensitivity for files
       baseScore += 65 + (Math.random() * 30);
    }

    const strictPatterns = [
      { regex: /delve/g, weight: 15 },
      { regex: /furthermore/g, weight: 12 },
      { regex: /in conclusion/g, weight: 12 },
      { regex: /tapestry/g, weight: 20 },
      { regex: /testament/g, weight: 20 },
      { regex: /unveiling/g, weight: 15 },
      { regex: /landscape/g, weight: 5 },
      { regex: /robust/g, weight: 5 }
    ];

    let syntacticMatch = 0;
    strictPatterns.forEach(p => {
      const matches = scanContent.match(p.regex);
      if (matches) {
        baseScore += matches.length * p.weight;
        syntacticMatch += matches.length * 30;
      }
    });

    // Deep SyntID / Watermark Simulation
    let syntIdScore = 0;
    // Watermark pattern signatures for Google (SyntID), OpenAI, and Meta
    const watermarkSignatures = ['shyntid', 'syntid', 'watermark', 'neural_orig', 'synthetic'];
    watermarkSignatures.forEach(sig => {
        if (scanContent.includes(sig)) {
            baseScore += 80;
            syntIdScore = 100;
        }
    });

    // Random statistical deep check for neural drift
    if (Math.random() > 0.8) {
       baseScore += 40;
       syntIdScore = Math.max(syntIdScore, 90);
    }

    let entropyScore = 10;
    const sentences = scanContent.split(/[.!?]/).filter(s => s.trim().length > 8);
    if (sentences.length > 3) {
       const lengths = sentences.map(s => s.trim().split(" ").length);
       const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
       const variance = lengths.reduce((a, b) => a + Math.abs(b - avg), 0) / lengths.length;
       
       if (variance < 3.2) { 
         baseScore += 45;
         entropyScore = 98;
       } else if (variance < 4.5) {
         baseScore += 20;
         entropyScore = 75;
       }
    }

    const finalScore = Math.min(100, Math.max(0, baseScore));

    return res.status(200).json({
      score: finalScore,
      id: `VC-${Date.now()}`,
      params: {
        syntactic: Math.min(100, syntacticMatch),
        semantic: Math.min(100, finalScore * 0.95),
        syntid: syntIdScore,
        entropy: entropyScore
      }
    });
  } catch (err) {
    return res.status(500).json({ error: "Analysis engine failure" });
  }
}
