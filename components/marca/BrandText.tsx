'use client';
import { useState, useCallback } from 'react';

const SECTIONS = [
  { key: 'slogan', label: 'Slogan', icon: '✦', description: '1 línea memorable' },
  { key: 'mision', label: 'Misión', icon: '◎', description: 'Propósito actual' },
  { key: 'vision', label: 'Visión', icon: '◈', description: 'Futuro aspiracional' },
  { key: 'valores', label: 'Valores de Marca', icon: '◆', description: '5 valores clave' },
  { key: 'personalidad', label: 'Personalidad', icon: '◉', description: 'Arquetipo + rasgos' },
  { key: 'posicionamiento', label: 'Posicionamiento', icon: '◇', description: 'Propuesta de valor' },
  { key: 'audiencia', label: 'Público Objetivo', icon: '◐', description: 'Buyer persona básico' },
  { key: 'tono', label: 'Tono de Voz', icon: '◑', description: 'Estilo comunicacional' },
];

interface SectionState {
  content: string;
  loading: boolean;
  generated: boolean;
}

interface BrandTextProps {
  brandName: string;
  industry: string;
  description: string;
  onChange?: (texts: Record<string, string>) => void;
}

export default function BrandText({ brandName, industry, description, onChange }: BrandTextProps) {
  const [sections, setSections] = useState<Record<string, SectionState>>(() =>
    Object.fromEntries(
      SECTIONS.map(({ key }) => [key, { content: '', loading: false, generated: false }])
    )
  );
  const [generatingAll, setGeneratingAll] = useState(false);

  const updateSection = useCallback(
    (key: string, updates: Partial<SectionState>) => {
      setSections((prev) => {
        const next = { ...prev, [key]: { ...prev[key], ...updates } };
        if (updates.content !== undefined || updates.generated !== undefined) {
          const texts = Object.fromEntries(
            Object.entries(next).map(([k, v]) => [k, v.content])
          );
          onChange?.(texts);
        }
        return next;
      });
    },
    [onChange]
  );

  const generateSection = useCallback(
    async (key: string) => {
      updateSection(key, { loading: true });
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ section: key, brandName, industry, description }),
        });
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        updateSection(key, { content: data.content, loading: false, generated: true });
      } catch {
        updateSection(key, {
          content: 'Error al generar. Intentá de nuevo.',
          loading: false,
          generated: true,
        });
      }
    },
    [brandName, industry, description, updateSection]
  );

  const generateAll = useCallback(async () => {
    setGeneratingAll(true);
    SECTIONS.forEach(({ key }) => updateSection(key, { loading: true }));
    await Promise.all(SECTIONS.map(({ key }) => generateSection(key)));
    setGeneratingAll(false);
  }, [generateSection, updateSection]);

  return (
    <div className="brand-text">
      <div className="brand-text__header">
        <button
          className="btn-primary brand-text__generate-all"
          onClick={generateAll}
          disabled={generatingAll}
        >
          {generatingAll ? (
            <>
              <span className="brand-text__spinner" />
              Generando...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 6 }}>
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
              Generar todo
            </>
          )}
        </button>
        <p className="brand-text__hint">
          O generá cada sección por separado usando el botón ↻
        </p>
      </div>

      <div className="brand-text__grid">
        {SECTIONS.map(({ key, label, icon, description: desc }) => {
          const sec = sections[key];
          return (
            <div key={key} className={`brand-text__section ${sec.generated ? 'brand-text__section--generated' : ''}`}>
              <div className="brand-text__section-header">
                <span className="brand-text__section-icon">{icon}</span>
                <div>
                  <h3 className="brand-text__section-title">{label}</h3>
                  <span className="brand-text__section-desc">{desc}</span>
                </div>
                <button
                  className="brand-text__regen-btn"
                  onClick={() => generateSection(key)}
                  disabled={sec.loading}
                  title={`Regenerar ${label}`}
                  aria-label={`Regenerar ${label}`}
                >
                  {sec.loading ? (
                    <span className="brand-text__spinner brand-text__spinner--sm" />
                  ) : '↻'}
                </button>
              </div>

              <div className="brand-text__section-body">
                {sec.loading ? (
                  <div className="brand-text__skeleton">
                    <div className="brand-text__skeleton-line" style={{ width: '90%' }} />
                    <div className="brand-text__skeleton-line" style={{ width: '75%' }} />
                    <div className="brand-text__skeleton-line" style={{ width: '60%' }} />
                  </div>
                ) : sec.generated ? (
                  <textarea
                    className="brand-text__content-editable"
                    value={sec.content}
                    onChange={(e) => updateSection(key, { content: e.target.value })}
                    rows={key === 'valores' ? 8 : 4}
                  />
                ) : (
                  <p className="brand-text__placeholder">
                    Hacé clic en ↻ o en &ldquo;Generar todo&rdquo; para crear este contenido
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
