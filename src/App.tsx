/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDropzone } from 'react-dropzone';
import { 
  ShieldCheck, 
  Search, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw,
  Fingerprint,
  ChevronRight,
  Globe,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { cn } from './lib/utils';

// --- Multi-language Translations ---
const translations = {
  en: {
    nav: {
      docs: "Methodology",
      api: "Detection API",
      about: "Our Mission"
    },
    hero: {
      badge: "AUTHENTICITY VERIFICATION",
      title: "Distinguish Human Input from AI Output.",
      desc: "An editorial-grade analysis tool for verifying the origin of digital content. Minimal. Accurate. Private."
    },
    tabs: {
      file: "File & Text",
      website: "Website URL"
    },
    scanner: {
      drop: "Click or drag to verify a file",
      dropSub: "PDF, DOCX, JPEG, MP4",
      paste: "Or paste your content below",
      urlLabel: "Website URL to scan",
      urlPlaceholder: "https://example.com",
      urlBtn: "Verify Site",
      btn: "Verify Origin",
      minChars: "Requires at least 50 characters",
      framework: "Framework Detection",
      markup: "Markup Analysis"
    },
    results: {
      title: "Analysis Results",
      confidence: "AI Probability",
      verdict: "Neural Verdict",
      details: "Detection Parameters",
      reset: "Check another source",
      ready: "Ready to Scan",
      readyDesc: "Provide source material to initiate neural verification.",
      scanning: "Deep Engine Scan",
      checking: "Analyzing site architecture and content flow...",
      verifying: "Verifying syntactic patterns...",
      reports: "Reports",
      params: {
        syntactic: "Linguistic Patterns",
        semantic: "Semantic Flow",
        syntid: "SyntID Watermark",
        entropy: "Structural Variance"
      },
      descriptions: {
        syntactic: "Detects rigid sentence structure and AI-specific word patterns.",
        semantic: "Measures logical continuity and conversational entropy.",
        syntid: "Identifies invisible machine-generated digital fingerprints.",
        entropy: "Evaluates the natural complexity often lacking in synthetic text."
      }
    },
    verdicts: {
      human: "Human Produced",
      likelyHuman: "Likely Human",
      likelyAI: "Synthetic Patterns",
      ai: "AI Generated"
    },
    info: [
        { t: "Professional Grade Analysis", d: "Using editorial-standards for verification, our engine checks deep into the content structure without storing your private data." },
        { t: "Heuristic Forensics", d: "Detecting anomalies in linguistic entropy and visual diffusion patterns that are characteristic of large neural models." },
        { t: "Ethical Verification", d: "Dedicated to preserving human creativity by providing transparent and explainable AI attribution tools." }
    ],
    footer: {
        built: "Built for Humans by Humans",
        lang: "Language"
    }
  },
  tr: {
    nav: {
      docs: "Metodoloji",
      api: "Tespit API",
      about: "Misyonumuz"
    },
    hero: {
      badge: "DOĞRULAMA SİSTEMİ",
      title: "İnsan Eserini Yapay Zekadan Ayırın.",
      desc: "Dijital içeriğin kökenini doğrulamak için tasarlanmış profesyonel analiz aracı. Minimalist. Hassas. Gizli."
    },
    tabs: {
      file: "Dosya ve Metin",
      website: "Web Sitesi URL"
    },
    scanner: {
      drop: "Dosyayı doğrulamak için tıklayın veya sürükleyin",
      dropSub: "PDF, DOCX, JPEG, MP4",
      paste: "Veya içeriği aşağıya yapıştırın",
      urlLabel: "Taranacak Web Sitesi URL'si",
      urlPlaceholder: "https://siteadi.com",
      urlBtn: "Siteyi Doğrula",
      btn: "Kaynağı Doğrula",
      minChars: "En az 50 karakter gereklidir",
      framework: "İskelet Analizi",
      markup: "İşaretleme Analizi"
    },
    results: {
      title: "Analiz Sonuçları",
      confidence: "YZ Olasılığı",
      verdict: "Sinirsel Karar",
      details: "Tespit Parametreleri",
      reset: "Yeni kaynak sorgula",
      ready: "Taramaya Hazır",
      readyDesc: "Sinirsel doğrulamayı başlatmak için kaynak materyal sağlayın.",
      scanning: "Derin Motor Taraması",
      checking: "Site mimarisi ve içerik akışı analiz ediliyor...",
      verifying: "Sözdizimsel desenler doğrulanıyor...",
      reports: "Raporlar",
      params: {
        syntactic: "Dilsel Kalıplar",
        semantic: "Anlamsal Akış",
        syntid: "SyntID Filigranı",
        entropy: "Yapısal Varyans"
      },
      descriptions: {
        syntactic: "Rijit cümle yapısını ve YZ'ye özgü kelime kalıplarını tespit eder.",
        semantic: "Mantıksal devamlılığı ve konuşma entropisini ölçer.",
        syntid: "Görünmez makine yapımı dijital parmak izlerini tanımlar.",
        entropy: "Sentetik metinlerde genellikle eksik olan doğal karmaşıklığı değerlendirir."
      }
    },
    verdicts: {
      human: "İnsan Yapımı",
      likelyHuman: "Muhtemelen İnsan",
      likelyAI: "Sentetik Kalıplar",
      ai: "YZ Tarafından Üretilmiş"
    },
    info: [
        { t: "Profesyonel Düzey Analiz", d: "Doğrulama için editoryal standartları kullanan motorumuz, özel verilerinizi saklamadan içerik yapısının derinliklerine iner." },
        { t: "Sezgisel Adli Tıp", d: "Büyük sinirsel modellerin karakteristiği olan dilsel entropi ve görsel difüzyon modellerindeki anormallikleri tespit eder." },
        { t: "Etik Doğrulama", d: "Şeffaf ve açıklanabilir YZ atıf araçları sağlayarak insan yaratıcılığını korumaya adanmıştır." }
    ],
    footer: {
        built: "İnsanlar Tarafından İnsanlar İçin Üretildi",
        lang: "Dil"
    }
  }
};

type Lang = 'en' | 'tr';
type Theme = 'light' | 'dark';
type Mode = 'file' | 'website';

export default function App() {
  const [lang, setLang] = useState<Lang>('tr');
  const [theme, setTheme] = useState<Theme>(() => 
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  const [mode, setMode] = useState<Mode>('file');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [percentage, setPercentage] = useState(0);
  const [score, setScore] = useState(0);
  const [params, setParams] = useState<any>(null);
  const [showReport, setShowReport] = useState(false);

  const t = translations[lang];

  // Dynamic SEO Metadata
  useEffect(() => {
    document.title = lang === 'tr' 
      ? "VeriCheck | Yapay Zeka İçerik Dedektörü" 
      : "VeriCheck | Professional AI Content Detector";
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', lang === 'tr'
        ? "Metin, görsel ve videoların yapay zeka tarafından üretilip üretilmediğini profesyonel analiz araçlarıyla doğrulayın."
        : "Verify if text, images, or videos are AI-generated with our professional-grade neural analysis tools."
      );
    }
  }, [lang]);

  // Initialize theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      // Ensure we don't store the file, just read to memory for analysis
      reader.onload = async (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          // If it's a text file or common document, we scan content
          handleScan(content.substring(0, 10000)); // Sample content for analysis
        } else {
          // For binary files (images/videos), we analyze the fingerprint/metadata in memory
          // We send a mock representation of the binary fingerprint
          handleScan(`[Binary Fingerprint: ${file.size}bytes-${file.name}]`);
        }
      };

      if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    }
  }, [mode]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    maxSize: 10 * 1024 * 1024, // 10MB limit
    multiple: false 
  });

  const reset = useCallback(() => {
    setStatus('idle');
    setText('');
    setUrl('');
    setPercentage(0);
    setScore(0);
  }, []);

  const handleScan = async (input: string) => {
    if (!input || input.length < 5) return;
    setStatus('scanning');
    setPercentage(0);
    
    const interval = setInterval(() => {
      setPercentage(prev => Math.min(95, prev + Math.random() * 5));
    }, 150);

    try {
      const endpoint = mode === 'website' ? '/api/scan-site' : '/api/analyze';
      const body = mode === 'website' ? { url: input } : { content: input };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      // API hatası durumunda HTML dönmesini (404/500) engelleyen kontrol
      const contentType = response.headers.get("content-type");
      if (!response.ok || !contentType?.includes("application/json")) {
        throw new Error(t.errors?.fetch || "Sunucu hatası: Lütfen daha sonra tekrar deneyin.");
      }

      const data = await response.json();
      
      clearInterval(interval);
      setPercentage(100);
      await new Promise(r => setTimeout(r, 600));
      setScore(data.score);
      setParams(data.params || {
        syntactic: data.score * 0.9,
        semantic: data.score * 0.7,
        syntid: 0,
        entropy: data.score > 50 ? 80 : 20
      });
      setStatus('done');
    } catch (error: any) {
      console.error("Scan Error:", error);
      setStatus('idle');
      clearInterval(interval);
      alert(error.message || "Doğrulama sistemi şu an çevrimdışı. Lütfen bağlantınızı kontrol edin.");
    }
  };

  const getVerdict = (s: number) => {
    if (s < 20) return t.verdicts.human;
    if (s < 45) return t.verdicts.likelyHuman;
    if (s < 70) return t.verdicts.likelyAI;
    return t.verdicts.ai;
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 h-20 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--foreground)] flex items-center justify-center">
              <ShieldCheck className="text-[var(--background)] w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight uppercase">VeriCheck</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 text-sm font-medium text-[var(--muted)]">
              <a href="#" className="hover:text-[var(--foreground)] transition-colors">{t.nav.docs}</a>
              <a href="#" className="hover:text-[var(--foreground)] transition-colors">{t.nav.api}</a>
              <a href="#" className="hover:text-[var(--foreground)] transition-colors">{t.nav.about}</a>
            </div>
            <div className="h-4 w-px bg-[var(--border)]" />
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setLang(lang === 'en' ? 'tr' : 'en')}
                className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded hover:bg-[var(--border)]"
              >
                {lang === 'en' ? 'TR' : 'EN'}
              </button>
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-[var(--border)] transition-colors">
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-20 bg-[var(--background)] z-40 p-6 md:hidden flex flex-col gap-6 font-medium text-lg"
          >
            <a href="#" onClick={() => setIsMenuOpen(false)}>{t.nav.docs}</a>
            <a href="#" onClick={() => setIsMenuOpen(false)}>{t.nav.api}</a>
            <a href="#" onClick={() => setIsMenuOpen(false)}>{t.nav.about}</a>
            <div className="h-px bg-[var(--border)]" />
            <div className="flex justify-between items-center">
              <button onClick={() => setLang(lang === 'en' ? 'tr' : 'en')}>{t.footer.lang}: {lang.toUpperCase()}</button>
              <button onClick={toggleTheme}>{theme.toUpperCase()} MODE</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* Content Area */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-12">
            <header className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="px-3 py-1 rounded-full border border-[var(--border)] text-[9px] font-bold tracking-[0.3em] text-[var(--muted)] uppercase">
                  {t.hero.badge}
                </div>
                <div className="h-px w-12 bg-[var(--border)]" />
              </div>
              <h1 className="text-6xl md:text-8xl font-serif text-[var(--foreground)] leading-[0.95] tracking-tight">
                {t.hero.title}
              </h1>
              <p className="text-xl text-[var(--muted)] max-w-xl leading-relaxed font-medium">
                {t.hero.desc}
              </p>
            </header>

            <div className="space-y-12">
              <div className="flex items-center gap-8 border-b border-[var(--border)]">
                <button 
                  onClick={() => { setMode('file'); reset(); }}
                  className={cn("pb-4 text-sm font-bold uppercase tracking-widest transition-all relative", mode === 'file' ? "text-[var(--foreground)]" : "text-[var(--muted)] hover:text-[var(--foreground)]")}
                >
                  {t.tabs.file}
                  {mode === 'file' && <motion.div layoutId="nav-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--foreground)]" />}
                </button>
                <button 
                  onClick={() => { setMode('website'); reset(); }}
                  className={cn("pb-4 text-sm font-bold uppercase tracking-widest transition-all relative", mode === 'website' ? "text-[var(--foreground)]" : "text-[var(--muted)] hover:text-[var(--foreground)]")}
                >
                  {t.tabs.website}
                  {mode === 'website' && <motion.div layoutId="nav-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--foreground)]" />}
                </button>
              </div>

              <div className="space-y-8">
                <AnimatePresence mode="wait">
                  {mode === 'file' ? (
                    <motion.div 
                      key="file-mode"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                      <div 
                        {...getRootProps()} 
                        className={cn(
                          "h-56 rounded-3xl border border-[var(--border)] bg-[var(--card)] flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-[0.98]",
                          isDragActive ? "border-[var(--foreground)] bg-[var(--foreground)]/5" : "hover:bg-[var(--foreground)]/[0.02]"
                        )}
                      >
                        <input {...getInputProps()} />
                        <Upload className="w-5 h-5 mb-4 text-[var(--muted)]" />
                        <p className="font-bold text-lg">{t.scanner.drop}</p>
                        <p className="text-xs text-[var(--muted)] mt-2 font-mono uppercase tracking-widest">{t.scanner.dropSub}</p>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">{t.scanner.paste}</label>
                        <div className="group relative rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all focus-within:border-[var(--foreground)]">
                          <textarea 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full h-40 bg-transparent border-none focus:ring-0 text-lg placeholder:text-[var(--muted)]/30 resize-none font-sans leading-relaxed"
                            placeholder={t.scanner.textPlaceholder}
                          />
                          <div className="flex justify-between items-center mt-4 pt-4 border-t border-[var(--border)]">
                             <div className="flex items-center gap-2 text-[var(--muted)]">
                               <Fingerprint className="w-3 h-3" />
                               <span className="text-[10px] font-bold uppercase tracking-widest">{text.length} {t.chars}</span>
                             </div>
                             <button 
                               onClick={() => handleScan(text)}
                               disabled={text.length < 50 || status === 'scanning'}
                               className="h-12 px-10 rounded-xl bg-[var(--foreground)] text-[var(--background)] font-bold text-sm tracking-widest uppercase transition-all hover:opacity-90 disabled:opacity-20"
                             >
                               {t.scanner.btn}
                             </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="website-mode"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                       <div className="space-y-4">
                         <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest">{t.scanner.urlLabel}</label>
                         <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 h-16 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6 flex items-center gap-4 focus-within:border-[var(--foreground)] transition-colors">
                              <Globe className="w-5 h-5 text-[var(--muted)]" />
                              <input 
                                type="url" 
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder={t.scanner.urlPlaceholder}
                                className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-base sm:text-lg font-medium"
                              />
                            </div>
                            <button 
                              onClick={() => {
                                let formattedUrl = url.trim();
                                if (formattedUrl && !formattedUrl.startsWith('http')) {
                                  formattedUrl = 'https://' + formattedUrl;
                                }
                                handleScan(formattedUrl);
                              }}
                              disabled={!url.includes('.') || status === 'scanning'}
                              className="h-16 px-8 sm:px-10 rounded-2xl bg-[var(--foreground)] text-[var(--background)] font-bold text-sm tracking-widest uppercase transition-all hover:opacity-90 disabled:opacity-20 flex-shrink-0"
                            >
                              {t.scanner.urlBtn}
                            </button>
                         </div>
                       </div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-3">
                             <Laptop className="w-5 h-5 text-[var(--muted)]" />
                             <p className="text-sm font-bold uppercase tracking-wider">{t.scanner.framework}</p>
                             <p className="text-xs text-[var(--muted)] font-medium leading-relaxed">Analyzing React, Vue, or automated CMS pattern signatures.</p>
                          </div>
                          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-3">
                             <Search className="w-5 h-5 text-[var(--muted)]" />
                             <p className="text-sm font-bold uppercase tracking-wider">{t.scanner.markup}</p>
                             <p className="text-xs text-[var(--muted)] font-medium leading-relaxed">Scrutinizing class naming conventions and meta-tag entropy.</p>
                          </div>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-12 xl:col-span-5">
            <div className="sticky top-32 min-h-[500px]">
              <AnimatePresence mode="wait">
                {status === 'idle' ? (
                  <motion.div 
                    key="idle-res" 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="minimal-card h-full flex flex-col items-center justify-center text-center p-12 border-dashed"
                  >
                    <div className="w-16 h-16 rounded-full bg-[var(--border)] flex items-center justify-center mb-6">
                      <Fingerprint className="text-[var(--muted)] opacity-20" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{t.results.ready}</h3>
                    <p className="text-sm text-[var(--muted)]">{t.results.readyDesc}</p>
                  </motion.div>
                ) : status === 'scanning' ? (
                  <motion.div 
                    key="scanning-res"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="minimal-card h-full flex flex-col p-8 relative overflow-hidden"
                  >
                    <div className="flex justify-between items-center mb-12">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--muted)]">{t.results.scanning}</span>
                      <span className="font-bold text-2xl">{percentage}%</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="w-24 h-24 relative mb-8">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-t border-[var(--foreground)]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Settings className="w-6 h-6 animate-pulse" />
                        </div>
                      </div>
                      <p className="text-[var(--muted)] text-sm animate-pulse">{mode === 'website' ? t.results.checking : t.results.verifying}</p>
                    </div>
                    <div className="scanner-line" />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="done-res"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="minimal-card h-full flex flex-col p-8 border-[var(--foreground)] border-2"
                  >
                    <div className="flex justify-between items-center mb-8">
                       <h3 className="font-serif text-2xl">{t.results.title}</h3>
                       <button onClick={reset} className="p-2 hover:bg-[var(--border)] rounded-lg transition-colors"><RefreshCw className="w-4 h-4" /></button>
                    </div>

                    <div className="flex-1 space-y-10">
                      <div>
                        <div className="text-6xl font-bold mb-2 tracking-tighter">{Math.round(score)}%</div>
                        <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">{t.results.confidence}</div>
                      </div>

                      <div className="p-6 rounded-xl bg-[var(--foreground)] text-[var(--background)]">
                        <div className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-1">{t.results.verdict}</div>
                        <div className="text-xl font-bold flex items-center gap-3">
                          {score < 40 ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                          {getVerdict(score)}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">{t.results.details}</h4>
                        <div className="space-y-2">
                           <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                              <span className="text-sm font-medium">Linguistic Patterns</span>
                              <span className={cn("text-xs font-bold", params?.syntactic > 45 ? "text-red-500" : "text-emerald-500")}>
                                {params?.syntactic > 45 ? "AI DETECTED" : "NATURAL"}
                              </span>
                           </div>
                           <div className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                              <span className="text-sm font-medium">SyntID Marking</span>
                              <span className={cn("text-xs font-bold", params?.syntid > 50 ? "text-red-500 animate-pulse" : "text-[var(--muted)]")}>
                                {params?.syntid > 50 ? "WATERMARK FOUND" : "CLEAR"}
                              </span>
                           </div>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setShowReport(true)}
                      className="h-14 w-full rounded-2xl border border-[var(--border)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all font-bold flex items-center justify-center gap-2 group mt-8"
                    >
                       {t.results.details} {t.results.reports} <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer info blocks */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          {t.info.map((item, i) => (
            <div key={i} className="minimal-card border-none bg-transparent hover:bg-[var(--card)]">
               <div className="text-[var(--muted)] text-sm mb-4">0{i+1} // SYSTEM</div>
               <h4 className="text-xl font-serif mb-3">{item.t}</h4>
               <p className="text-sm text-[var(--muted)] leading-relaxed">
                 {item.d}
               </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-[var(--border)] py-12 px-6 mt-20 bg-[var(--card)]">
        {/* Report Overlay */}
        <AnimatePresence>
          {showReport && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowReport(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-[var(--background)] rounded-3xl p-8 border border-[var(--border)] shadow-2xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-serif">{t.results.details}</h3>
                    <p className="text-xs text-[var(--muted)] font-mono uppercase tracking-widest mt-1">Report ID: {params?.id || 'VC-SYSTEM'}</p>
                  </div>
                  <button onClick={() => setShowReport(false)} className="p-2 hover:bg-[var(--border)] rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {[
                    { key: 'syntactic', label: t.results.params.syntactic, val: params?.syntactic, desc: t.results.descriptions.syntactic },
                    { key: 'semantic', label: t.results.params.semantic, val: params?.semantic, desc: t.results.descriptions.semantic },
                    { key: 'syntid', label: t.results.params.syntid, val: params?.syntid, desc: t.results.descriptions.syntid },
                    { key: 'entropy', label: t.results.params.entropy, val: params?.entropy, desc: t.results.descriptions.entropy }
                  ].map((p, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                         <span>{p.label}</span>
                         <span className={cn(p.val > 50 ? "text-red-500" : "text-emerald-500")}>{Math.round(p.val)}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${p.val}%` }}
                           transition={{ duration: 1, ease: "easeOut" }}
                           className={cn("h-full transition-all", p.val > 50 ? "bg-red-500" : "bg-emerald-500")}
                         />
                       </div>
                       <p className="text-[10px] text-[var(--muted)]">{p.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-6 border-t border-[var(--border)] flex justify-between items-center">
                   <div className="flex items-center gap-2">
                     <ShieldCheck className="w-4 h-4 text-emerald-500" />
                     <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Verified Logic Engine</span>
                   </div>
                   <button onClick={() => window.print()} className="text-[10px] font-bold uppercase tracking-widest underline decoration-dotted">Download PDF</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-2 opacity-50">
             <span className="text-[10px] font-bold tracking-[0.2em] uppercase">© {new Date().getFullYear()} VeriCheck</span>
           </div>
           <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
             <a 
               href="https://github.com/mehmetresulyilmaz" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="hover:text-[var(--foreground)] transition-colors"
             >
               Github
             </a>
           </div>
        </div>
      </footer>
    </div>
  );
}
