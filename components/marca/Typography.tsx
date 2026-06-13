'use client';
import { useState, useEffect } from 'react';

interface FontPair {
  heading: string;
  body: string;
  style: string;
}

const FONT_POOL: Array<{ heading: string; body: string; style: string; tags: string[] }> = [
  { heading: 'Playfair Display', body: 'Inter', style: 'Clásico + Moderno', tags: ['elegante', 'premium', 'clasico'] },
  { heading: 'Space Grotesk', body: 'DM Sans', style: 'Tech Moderno', tags: ['tech', 'moderno', 'startup'] },
  { heading: 'Cormorant Garamond', body: 'Nunito', style: 'Elegante Cálido', tags: ['lujoso', 'organico', 'bienestar'] },
  { heading: 'Syne', body: 'Manrope', style: 'Futurista', tags: ['creativo', 'tech', 'futurista'] },
  { heading: 'Lora', body: 'Source Sans 3', style: 'Confiable', tags: ['confiable', 'profesional', 'salud'] },
  { heading: 'Abril Fatface', body: 'Nunito Sans', style: 'Bold', tags: ['bold', 'gastro', 'lifestyle'] },
  { heading: 'Fraunces', body: 'Figtree', style: 'Artesanal Premium', tags: ['artesanal', 'organico', 'premium'] },
  { heading: 'Cabinet Grotesk', body: 'Inter', style: 'Limpio', tags: ['tech', 'limpio', 'moderno'] },
  { heading: 'Italiana', body: 'Raleway', style: 'Editorial Fino', tags: ['elegante', 'moda', 'arte'] },
  { heading: 'Outfit', body: 'Karla', style: 'Amigable', tags: ['amigable', 'startup', 'educacion'] },
  { heading: 'DM Serif Display', body: 'DM Sans', style: 'Premium Financiero', tags: ['premium', 'financiero', 'confiable'] },
  { heading: 'Unbounded', body: 'Space Grotesk', style: 'Futurista Bold', tags: ['futurista', 'tech', 'gaming'] },
  { heading: 'Libre Baskerville', body: 'Libre Franklin', style: 'Clásico Editorial', tags: ['clasico', 'editorial', 'profesional'] },
  { heading: 'Clash Display', body: 'General Sans', style: 'Agencia Bold', tags: ['creativo', 'agencia', 'bold'] },
  { heading: 'Urbanist', body: 'Plus Jakarta Sans', style: 'Moderno Versátil', tags: ['moderno', 'limpio', 'versatil'] },
  { heading: 'Bodoni Moda', body: 'Jost', style: 'Haute Couture', tags: ['lujo', 'moda', 'editorial'] },
  { heading: 'Josefin Sans', body: 'Lato', style: 'Minimal Chic', tags: ['geometrico', 'minimal', 'deporte'] },
  { heading: 'Bitter', body: 'Mulish', style: 'Legible y Cálido', tags: ['legible', 'blog', 'educacion'] },
  { heading: 'Righteous', body: 'Barlow', style: 'Energético', tags: ['energetico', 'deporte', 'juvenil'] },
  { heading: 'Cinzel', body: 'EB Garamond', style: 'Lujo Clásico', tags: ['clasico', 'lujo', 'premium'] },
];

const INDUSTRY_WEIGHTS: Record<string, number[]> = {
  'Tecnología / Software': [1, 3, 7, 11, 14],
  'Salud y Bienestar': [2, 4, 6, 17],
  'Educación': [9, 17, 4, 14],
  'Gastronomía / Restaurantes': [0, 5, 6, 9],
  'Moda y Lifestyle': [0, 8, 11, 15, 19],
  'Consultoría y Servicios': [0, 4, 10, 14, 17],
  'E-commerce / Retail': [0, 9, 14, 5],
  'Finanzas': [10, 4, 14, 17, 19],
  'Arte y Creatividad': [3, 8, 13, 15, 11],
  'Deporte y Fitness': [16, 18, 14, 9],
  'Turismo y Hospitalidad': [0, 2, 6, 15, 19],
  'Inmobiliaria': [0, 10, 17, 15, 19],
  'Otro': [0, 1, 14, 4, 9],
};

const AVAILABLE_WEIGHTS = [
  { label: 'Light', value: '300' },
  { label: 'Regular', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Bold', value: '700' },
  { label: 'Black', value: '900' },
];

function getRandomFontPair(industry: string, currentHeading: string): FontPair {
  const weights = INDUSTRY_WEIGHTS[industry] || INDUSTRY_WEIGHTS['Otro'];
  const candidates = Math.random() < 0.7
    ? weights.map(i => FONT_POOL[i])
    : [...FONT_POOL];
  const filtered = candidates.filter(p => p.heading !== currentHeading);
  const pool = filtered.length > 0 ? filtered : candidates;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getInitialFontPair(industry: string): FontPair {
  const weights = INDUSTRY_WEIGHTS[industry] || INDUSTRY_WEIGHTS['Otro'];
  const idx = weights[Math.floor(Math.random() * weights.length)];
  return FONT_POOL[idx];
}

function buildGoogleFontsUrl(pairs: FontPair[], weights: string[]): string {
  const wStr = [...weights].sort((a, b) => Number(a) - Number(b)).join(';');
  const families = new Set<string>();
  pairs.forEach(p => {
    families.add(p.heading.replace(/ /g, '+') + ':wght@' + wStr);
    families.add(p.body.replace(/ /g, '+') + ':wght@' + wStr);
  });
  return `https://fonts.googleapis.com/css2?${Array.from(families).map(f => `family=${f}`).join('&')}&display=swap`;
}

interface TypographyProps {
  brandName: string;
  industry: string;
  onChange?: (pair: FontPair) => void;
  onWeightsChange?: (weights: string[]) => void;
}

export default function Typography({ brandName, industry, onChange, onWeightsChange }: TypographyProps) {
  const [currentPair, setCurrentPair] = useState<FontPair>(() => getInitialFontPair(industry));
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [selectedWeights, setSelectedWeights] = useState<string[]>(['400', '700']);

  useEffect(() => {
    const id = 'marca-google-fonts';
    let el = document.getElementById(id) as HTMLLinkElement | null;
    if (!el) {
      el = document.createElement('link');
      el.id = id;
      el.rel = 'stylesheet';
      document.head.appendChild(el);
    }
    el.href = buildGoogleFontsUrl([currentPair], selectedWeights);
    el.onload = () => setFontsLoaded(true);
    setTimeout(() => setFontsLoaded(true), 800);
  }, [currentPair, selectedWeights]);

  const handleNext = () => {
    const next = getRandomFontPair(industry, currentPair.heading);
    setCurrentPair(next);
    onChange?.(next);
  };

  const toggleWeight = (value: string) => {
    setSelectedWeights(prev => {
      if (prev.includes(value)) {
        if (prev.length === 1) return prev; // keep at least one
        return prev.filter(w => w !== value);
      }
      return [...prev, value].sort((a, b) => Number(a) - Number(b));
    });
  };

  useEffect(() => { onChange?.(currentPair); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { onWeightsChange?.(selectedWeights); }, [selectedWeights, onWeightsChange]);

  return (
    <div className={`typography-preview ${fontsLoaded ? 'typography-preview--loaded' : ''}`}>
      <div className="typography-preview__display">
        <p className="typography-preview__heading" style={{ fontFamily: `'${currentPair.heading}', serif` }}>
          {brandName || 'Tu Marca'}
        </p>
        <p className="typography-preview__subheading" style={{ fontFamily: `'${currentPair.body}', sans-serif` }}>
          Subtítulo de ejemplo · Tagline de marca
        </p>
        <p className="typography-preview__body" style={{ fontFamily: `'${currentPair.body}', sans-serif` }}>
          El texto de cuerpo usa esta tipografía para párrafos y descripciones. Legible, clara y alineada con la personalidad de la marca.
        </p>
      </div>

      <div className="typography-preview__meta">
        <div className="typography-preview__font-info">
          <div className="typography-preview__font-card">
            <span className="typography-preview__font-role">Titular</span>
            <span className="typography-preview__font-name" style={{ fontFamily: `'${currentPair.heading}', serif` }}>
              {currentPair.heading}
            </span>
          </div>
          <div className="typography-preview__font-divider">+</div>
          <div className="typography-preview__font-card">
            <span className="typography-preview__font-role">Cuerpo</span>
            <span className="typography-preview__font-name" style={{ fontFamily: `'${currentPair.body}', sans-serif` }}>
              {currentPair.body}
            </span>
          </div>
        </div>
        <span className="typography-preview__style-tag">{currentPair.style}</span>
      </div>

      {/* Weight samples */}
      <div className="typography-preview__weights">
        <span className="typography-preview__weight-label">Pesos</span>
        {AVAILABLE_WEIGHTS.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            className={`weight-chip ${selectedWeights.includes(value) ? 'weight-chip--active' : ''}`}
            onClick={() => toggleWeight(value)}
            title={`${label} ${value}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Weight specimen rows */}
      <div style={{ padding: '0 40px 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {selectedWeights.map(w => (
          <div key={w} style={{ display: 'flex', alignItems: 'baseline', gap: 16, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 10, color: 'var(--dim)', width: 64, flexShrink: 0, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>
              {AVAILABLE_WEIGHTS.find(ww => ww.value === w)?.label} {w}
            </span>
            <span style={{ fontFamily: `'${currentPair.heading}', serif`, fontWeight: Number(w), fontSize: 17, color: 'var(--text)', letterSpacing: '-.01em' }}>
              Aa Bb Cc Dd Ee · 0 1 2 3 4 5 6 7 8 9
            </span>
          </div>
        ))}
      </div>

      <div className="typography-preview__controls">
        <button type="button" className="btn-secondary" onClick={handleNext}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 6 }}>
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          Regenerar tipografía
        </button>
      </div>
    </div>
  );
}
