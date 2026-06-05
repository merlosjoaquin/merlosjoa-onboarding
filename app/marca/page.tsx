'use client';
import { useState, useCallback } from 'react';
import BrandForm, { type BrandFormData } from '@/components/marca/BrandForm';
import ColorPalette from '@/components/marca/ColorPalette';
import Typography from '@/components/marca/Typography';
import BrandText from '@/components/marca/BrandText';
import PdfExport from '@/components/marca/PdfExport';
import OnboardingCTA from '@/components/marca/OnboardingCTA';

type PageState = 'form' | 'generated';

interface FontPair {
  heading: string;
  body: string;
  style: string;
}

export default function MarcaPage() {
  const [pageState, setPageState] = useState<PageState>('form');
  const [formData, setFormData] = useState<BrandFormData | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [fonts, setFonts] = useState<FontPair>({ heading: 'Playfair Display', body: 'Inter', style: '' });
  const [texts, setTexts] = useState<Record<string, string>>({});

  const handleFormSubmit = (data: BrandFormData) => {
    setFormData(data);
    setPageState('generated');
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setPageState('form');
    setFormData(null);
    setColors([]);
    setTexts({});
  };

  const handleColorsChange = useCallback((newColors: string[]) => {
    setColors(newColors);
  }, []);

  const handleFontsChange = useCallback((pair: FontPair) => {
    setFonts(pair);
  }, []);

  const handleTextsChange = useCallback((newTexts: Record<string, string>) => {
    setTexts(newTexts);
  }, []);

  return (
    <main className="marca-page">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="marca-hero">
        <div className="marca-hero__inner">
          {pageState === 'form' && (
            <div className="marca-hero__eyebrow">Herramienta gratuita</div>
          )}
          <h1 className="marca-hero__title">
            {pageState === 'form' ? (
              <>Generá tu <em>identidad de marca</em> en segundos</>
            ) : (
              <>Tu identidad de <em>{formData?.name}</em></>
            )}
          </h1>
          {pageState === 'form' && (
            <p className="marca-hero__sub">
              Completá 3 datos y obtenés tu paleta, tipografías, slogan, misión, visión y más — gratis.
            </p>
          )}
          {pageState === 'generated' && formData && (
            <p className="marca-hero__sub">
              {formData.industry} · {formData.description.slice(0, 80)}{formData.description.length > 80 ? '...' : ''}
            </p>
          )}
        </div>
      </section>

      {/* ── Form state ───────────────────────────────────────────────── */}
      {pageState === 'form' && (
        <section className="marca-form-section">
          <div className="marca-wrap">
            <BrandForm onSubmit={handleFormSubmit} />
          </div>
        </section>
      )}

      {/* ── Generated state ──────────────────────────────────────────── */}
      {pageState === 'generated' && formData && (
        <>
          {/* Color Palette */}
          <section className="marca-section">
            <div className="marca-wrap">
              <div className="marca-section__header">
                <span className="marca-section__eyebrow">01</span>
                <h2 className="marca-section__title">Paleta de Colores</h2>
                <p className="marca-section__desc">
                  Bloqueá los colores que te gustan y regenerá el resto. Hacé clic en el HEX para editarlo.
                </p>
              </div>
              <ColorPalette
                industry={formData.industry}
                onChange={handleColorsChange}
              />
            </div>
          </section>

          {/* Typography */}
          <section className="marca-section marca-section--alt">
            <div className="marca-wrap">
              <div className="marca-section__header">
                <span className="marca-section__eyebrow">02</span>
                <h2 className="marca-section__title">Tipografía</h2>
                <p className="marca-section__desc">
                  Pares tipográficos curados para tu industria. Ciclá entre opciones hasta encontrar tu estilo.
                </p>
              </div>
              <Typography
                brandName={formData.name}
                industry={formData.industry}
                onChange={handleFontsChange}
              />
            </div>
          </section>

          {/* Brand Texts */}
          <section className="marca-section">
            <div className="marca-wrap">
              <div className="marca-section__header">
                <span className="marca-section__eyebrow">03</span>
                <h2 className="marca-section__title">Identidad Verbal</h2>
                <p className="marca-section__desc">
                  Generado con IA según tu industria y descripción. Editá cualquier texto directamente.
                </p>
              </div>
              <BrandText
                brandName={formData.name}
                industry={formData.industry}
                description={formData.description}
                onChange={handleTextsChange}
              />
            </div>
          </section>

          {/* Export */}
          <section className="marca-section marca-section--export">
            <div className="marca-wrap marca-export-row">
              <div>
                <h2 className="marca-export__title">Exportar tu manual de marca</h2>
                <p className="marca-export__desc">
                  Descargá todo lo generado en un PDF profesional listo para compartir con tu equipo.
                </p>
              </div>
              <PdfExport
                brandData={{
                  name: formData.name,
                  industry: formData.industry,
                  colors: colors.length === 5 ? colors : ['#0F172A', '#1E3A5F', '#2563EB', '#38BDF8', '#F8FAFC'],
                  fonts,
                  texts,
                }}
              />
            </div>
          </section>

          {/* Reset */}
          <div className="marca-wrap marca-reset">
            <button className="btn-ghost" onClick={handleReset}>
              ← Generar otra marca
            </button>
          </div>

          {/* CTA */}
          <OnboardingCTA />
        </>
      )}
    </main>
  );
}
