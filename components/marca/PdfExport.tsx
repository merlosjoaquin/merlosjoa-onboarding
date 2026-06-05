'use client';
import { useState } from 'react';

interface PdfExportProps {
  brandData: {
    name: string;
    industry: string;
    colors: string[];
    fonts: { heading: string; body: string };
    texts: Record<string, string>;
  };
}

const SECTION_LABELS: Record<string, string> = {
  slogan: 'Slogan',
  mision: 'Misión',
  vision: 'Visión',
  valores: 'Valores de Marca',
  personalidad: 'Personalidad de Marca',
  posicionamiento: 'Posicionamiento',
  audiencia: 'Público Objetivo',
  tono: 'Tono de Voz',
};

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#18263A' : '#FFFFFF';
}

export default function PdfExport({ brandData }: PdfExportProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');

      // Build a temporary off-screen element
      const container = document.createElement('div');
      container.style.cssText = `
        position: fixed; top: -9999px; left: -9999px;
        width: 794px; background: #F2F5F8;
        font-family: Inter, system-ui, sans-serif;
        color: #18263A; padding: 48px;
        box-sizing: border-box;
      `;

      const primaryColor = brandData.colors[2] || '#C07A18';
      const accentColor = brandData.colors[3] || '#E89820';

      const hasTexts = Object.values(brandData.texts).some((v) => v && v.trim());

      container.innerHTML = `
        <div style="border-bottom: 3px solid ${primaryColor}; padding-bottom: 32px; margin-bottom: 40px;">
          <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: ${primaryColor}; margin-bottom: 12px;">
            Manual de Identidad de Marca
          </div>
          <h1 style="font-family: Georgia, serif; font-size: 48px; font-weight: 900; letter-spacing: -0.03em; margin: 0 0 8px; color: #18263A;">
            ${brandData.name}
          </h1>
          <p style="font-size: 14px; color: #4A6275; margin: 0;">${brandData.industry}</p>
        </div>

        <!-- Color Palette -->
        <div style="margin-bottom: 40px;">
          <h2 style="font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: ${primaryColor}; margin: 0 0 16px;">
            Paleta de Colores
          </h2>
          <div style="display: flex; gap: 8px; height: 80px;">
            ${brandData.colors
              .map(
                (c) => `
              <div style="flex: 1; background: ${c}; border-radius: 4px; display: flex; align-items: flex-end; padding: 8px;">
                <span style="font-size: 10px; font-weight: 700; color: ${getContrastColor(c)}; letter-spacing: 0.05em;">${c}</span>
              </div>`
              )
              .join('')}
          </div>
        </div>

        <!-- Typography -->
        <div style="margin-bottom: 40px; padding: 24px; background: #E4ECF3; border-radius: 4px;">
          <h2 style="font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: ${primaryColor}; margin: 0 0 16px;">
            Tipografía
          </h2>
          <div style="display: flex; gap: 32px;">
            <div>
              <div style="font-size: 10px; color: #8AA0B0; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.1em;">Headlines</div>
              <div style="font-size: 22px; font-weight: 700; color: #18263A;">${brandData.fonts.heading}</div>
            </div>
            <div>
              <div style="font-size: 10px; color: #8AA0B0; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.1em;">Body</div>
              <div style="font-size: 22px; font-weight: 700; color: #18263A;">${brandData.fonts.body}</div>
            </div>
          </div>
        </div>

        ${
          hasTexts
            ? `<!-- Brand Texts -->
        <div>
          <h2 style="font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: ${primaryColor}; margin: 0 0 24px;">
            Identidad Verbal
          </h2>
          ${Object.entries(brandData.texts)
            .filter(([, v]) => v && v.trim())
            .map(
              ([k, v]) => `
            <div style="margin-bottom: 24px; padding: 16px 20px; background: #E4ECF3; border-left: 3px solid ${accentColor}; border-radius: 0 4px 4px 0;">
              <div style="font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: ${primaryColor}; margin-bottom: 8px;">
                ${SECTION_LABELS[k] || k}
              </div>
              <div style="font-size: 13px; line-height: 1.7; color: #18263A; white-space: pre-wrap;">${v}</div>
            </div>`
            )
            .join('')}
        </div>`
            : ''
        }

        <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #C0CFDB; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 11px; color: #8AA0B0;">Generado con el Generador de Identidad de Marca</span>
          <span style="font-size: 11px; color: #8AA0B0;">joaquinmerlos.com</span>
        </div>
      `;

      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#F2F5F8',
        logging: false,
      });

      document.body.removeChild(container);

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [794, canvas.height / 2],
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, 794, canvas.height / 2);
      pdf.save(`${brandData.name.replace(/\s+/g, '-').toLowerCase()}-identidad-de-marca.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Error al exportar el PDF. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="btn-primary pdf-export-btn"
      onClick={handleExport}
      disabled={loading}
    >
      {loading ? (
        <>
          <span className="brand-text__spinner" style={{ marginRight: 8 }} />
          Generando PDF...
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 8 }}>
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
          Exportar Manual de Marca (PDF)
        </>
      )}
    </button>
  );
}
