'use client';
import { useState, useEffect } from 'react';

interface FontPair {
  heading: string;
  body: string;
  style: string;
}

const FONT_PAIRS: Record<string, FontPair[]> = {
  'Tecnología / Software': [
    { heading: 'Space Grotesk', body: 'Inter', style: 'Tech Moderno' },
    { heading: 'Syne', body: 'DM Sans', style: 'Futurista' },
    { heading: 'Outfit', body: 'Manrope', style: 'Limpio' },
  ],
  'Salud y Bienestar': [
    { heading: 'Cormorant Garamond', body: 'Nunito', style: 'Elegante Cálido' },
    { heading: 'Lora', body: 'Source Sans 3', style: 'Confiable' },
    { heading: 'Playfair Display', body: 'Lato', style: 'Premium' },
  ],
  'Educación': [
    { heading: 'Merriweather', body: 'Open Sans', style: 'Académico' },
    { heading: 'Libre Baskerville', body: 'Lato', style: 'Clásico' },
    { heading: 'Raleway', body: 'Nunito', style: 'Moderno Accesible' },
  ],
  'Gastronomía / Restaurantes': [
    { heading: 'Playfair Display', body: 'Lato', style: 'Clásico Elegante' },
    { heading: 'Italiana', body: 'Raleway', style: 'Artesanal' },
    { heading: 'Abril Fatface', body: 'Nunito Sans', style: 'Bold' },
  ],
  'Moda y Lifestyle': [
    { heading: 'Cormorant', body: 'Jost', style: 'Editorial Fino' },
    { heading: 'Bodoni Moda', body: 'DM Sans', style: 'Haute Couture' },
    { heading: 'Josefin Sans', body: 'Raleway', style: 'Minimal Chic' },
  ],
  'Consultoría y Servicios': [
    { heading: 'Playfair Display', body: 'Inter', style: 'Profesional Cálido' },
    { heading: 'EB Garamond', body: 'Source Sans 3', style: 'Experto' },
    { heading: 'Libre Baskerville', body: 'Open Sans', style: 'Confiable' },
  ],
  'E-commerce / Retail': [
    { heading: 'Nunito', body: 'Inter', style: 'Amigable Moderno' },
    { heading: 'Poppins', body: 'Lato', style: 'Vibrante' },
    { heading: 'Montserrat', body: 'Open Sans', style: 'Universal' },
  ],
  'Finanzas': [
    { heading: 'Merriweather', body: 'Lato', style: 'Sólido Confiable' },
    { heading: 'Playfair Display', body: 'Source Sans 3', style: 'Premium' },
    { heading: 'EB Garamond', body: 'Inter', style: 'Institucional' },
  ],
  'Arte y Creatividad': [
    { heading: 'Syne', body: 'DM Sans', style: 'Disruptivo' },
    { heading: 'Space Grotesk', body: 'Karla', style: 'Vanguardista' },
    { heading: 'Abril Fatface', body: 'Nunito', style: 'Expresivo' },
  ],
  'Deporte y Fitness': [
    { heading: 'Oswald', body: 'Lato', style: 'Potente' },
    { heading: 'Barlow Condensed', body: 'Open Sans', style: 'Dinámico' },
    { heading: 'Bebas Neue', body: 'Inter', style: 'Bold Impact' },
  ],
  'Turismo y Hospitalidad': [
    { heading: 'Cormorant Garamond', body: 'Lato', style: 'Lujo Relajado' },
    { heading: 'Playfair Display', body: 'Nunito', style: 'Aventura Premium' },
    { heading: 'Raleway', body: 'Open Sans', style: 'Fresco Moderno' },
  ],
  'Inmobiliaria': [
    { heading: 'Playfair Display', body: 'Lato', style: 'Exclusivo' },
    { heading: 'EB Garamond', body: 'Inter', style: 'Institucional' },
    { heading: 'Cormorant', body: 'Source Sans 3', style: 'Premium Moderno' },
  ],
  'Otro': [
    { heading: 'Playfair Display', body: 'Inter', style: 'Clásico + Moderno' },
    { heading: 'Montserrat', body: 'Open Sans', style: 'Universal' },
    { heading: 'Lora', body: 'Lato', style: 'Cálido Legible' },
  ],
};

function getFontPairs(industry: string): FontPair[] {
  return FONT_PAIRS[industry] || FONT_PAIRS['Otro'];
}

function buildGoogleFontsUrl(pairs: FontPair[]): string {
  const families = new Set<string>();
  pairs.forEach((p) => {
    families.add(p.heading.replace(/ /g, '+') + ':wght@400;700;900');
    families.add(p.body.replace(/ /g, '+') + ':wght@400;500;600');
  });
  return `https://fonts.googleapis.com/css2?${Array.from(families)
    .map((f) => `family=${f}`)
    .join('&')}&display=swap`;
}

interface TypographyProps {
  brandName: string;
  industry: string;
  onChange?: (pair: FontPair) => void;
}

export default function Typography({ brandName, industry, onChange }: TypographyProps) {
  const pairs = getFontPairs(industry);
  const [pairIndex, setPairIndex] = useState(0);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const currentPair = pairs[pairIndex];

  // Load Google Fonts dynamically
  useEffect(() => {
    const id = 'marca-google-fonts';
    let el = document.getElementById(id) as HTMLLinkElement | null;
    if (!el) {
      el = document.createElement('link');
      el.id = id;
      el.rel = 'stylesheet';
      document.head.appendChild(el);
    }
    el.href = buildGoogleFontsUrl(pairs);
    el.onload = () => setFontsLoaded(true);
    // If already cached it might not fire onload
    setTimeout(() => setFontsLoaded(true), 800);
  }, [industry]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = () => {
    const next = (pairIndex + 1) % pairs.length;
    setPairIndex(next);
    onChange?.(pairs[next]);
  };

  useEffect(() => {
    onChange?.(currentPair);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`typography-preview ${fontsLoaded ? 'typography-preview--loaded' : ''}`}>
      <div className="typography-preview__display">
        <p
          className="typography-preview__heading"
          style={{ fontFamily: `'${currentPair.heading}', serif` }}
        >
          {brandName || 'Tu Marca'}
        </p>
        <p
          className="typography-preview__subheading"
          style={{ fontFamily: `'${currentPair.body}', sans-serif` }}
        >
          Subtítulo de ejemplo · Tagline de marca
        </p>
        <p
          className="typography-preview__body"
          style={{ fontFamily: `'${currentPair.body}', sans-serif` }}
        >
          El texto de cuerpo usa esta tipografía para párrafos y descripciones. Legible, clara y alineada con la personalidad de la marca.
        </p>
      </div>

      <div className="typography-preview__meta">
        <div className="typography-preview__font-info">
          <div className="typography-preview__font-card">
            <span className="typography-preview__font-role">Headlines</span>
            <span
              className="typography-preview__font-name"
              style={{ fontFamily: `'${currentPair.heading}', serif` }}
            >
              {currentPair.heading}
            </span>
          </div>
          <div className="typography-preview__font-divider">+</div>
          <div className="typography-preview__font-card">
            <span className="typography-preview__font-role">Body</span>
            <span
              className="typography-preview__font-name"
              style={{ fontFamily: `'${currentPair.body}', sans-serif` }}
            >
              {currentPair.body}
            </span>
          </div>
        </div>
        <span className="typography-preview__style-tag">{currentPair.style}</span>
      </div>

      <div className="typography-preview__controls">
        <button type="button" className="btn-secondary" onClick={handleNext}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 6 }}>
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          Regenerar tipografía
        </button>
        <div className="typography-preview__dots">
          {pairs.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`color-palette__preset-dot ${pairIndex === i ? 'color-palette__preset-dot--active' : ''}`}
              onClick={() => { setPairIndex(i); onChange?.(pairs[i]); }}
              aria-label={`Par tipográfico ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
