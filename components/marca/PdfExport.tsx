'use client';
import { useState } from 'react';

interface FontPair { heading: string; body: string; style: string; }

interface PdfExportProps {
  brandData: {
    name: string;
    industry: string;
    colors: string[];
    colorRoles: string[];
    fonts: FontPair;
    fontWeights: string[];
    texts: Record<string, string>;
  };
  onReset: () => void;
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

const WEIGHT_LABELS: Record<string, string> = {
  '100': 'Thin', '200': 'ExtraLight', '300': 'Light',
  '400': 'Regular', '500': 'Medium', '600': 'SemiBold',
  '700': 'Bold', '800': 'ExtraBold', '900': 'Black',
};

const USAGE_RULES = [
  'No condensar, estirar ni deformar ningún elemento de la marca.',
  'No cambiar la tipografía original por otra distinta a la establecida en este manual.',
  'No alterar la cromática por colores que no pertenezcan a la paleta definida.',
  'No utilizar la marca en diagonal ni con ninguna rotación distinta a la horizontal.',
  'No agregar efectos como sombra, gradiente o transparencia sobre los elementos gráficos.',
  'No colocar la marca sobre fondos que dificulten su legibilidad o reduzcan su impacto.',
  'No modificar la jerarquía ni la proporción entre los elementos del sistema visual.',
  'No utilizar versiones de color no contempladas en la escala cromática de este manual.',
];

// ── Color utilities ──────────────────────────────────────────────────────────

function hexToRgb(hex: string) {
  const c = hex.replace('#', '');
  return { r: parseInt(c.slice(0, 2), 16), g: parseInt(c.slice(2, 4), 16), b: parseInt(c.slice(4, 6), 16) };
}

function hexToCmyk(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const r1 = r / 255, g1 = g / 255, b1 = b / 255;
  const k = 1 - Math.max(r1, g1, b1);
  if (k >= 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - r1 - k) / (1 - k)) * 100),
    m: Math.round(((1 - g1 - k) / (1 - k)) * 100),
    y: Math.round(((1 - b1 - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

function hexToHsl(hex: string): [number, number, number] {
  const { r, g, b } = hexToRgb(hex);
  const r1 = r / 255, g1 = g / 255, b1 = b / 255;
  const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  switch (max) {
    case r1: h = ((g1 - b1) / d + (g1 < b1 ? 6 : 0)) / 6; break;
    case g1: h = ((b1 - r1) / d + 2) / 6; break;
    case b1: h = ((r1 - g1) / d + 4) / 6; break;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function generateColorScale(hex: string): string[] {
  const [h, s] = hexToHsl(hex);
  return [
    hslToHex(h, Math.min(s + 8, 100), 18),
    hslToHex(h, Math.min(s + 5, 100), 30),
    hslToHex(h, Math.min(s + 2, 100), 42),
    hex.toUpperCase(),
    hslToHex(h, Math.max(s - 8, 15), 62),
    hslToHex(h, Math.max(s - 14, 12), 74),
    hslToHex(h, Math.max(s - 20, 8), 84),
    hslToHex(h, Math.max(s - 24, 6), 91),
    hslToHex(h, Math.max(s - 28, 4), 96),
  ];
}

function getContrastColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? '#18263A' : '#FFFFFF';
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Section renderer ─────────────────────────────────────────────────────────

async function renderSection(html: string): Promise<HTMLCanvasElement> {
  const { default: html2canvas } = await import('html2canvas');
  const div = document.createElement('div');
  div.style.cssText = [
    'position:fixed', 'top:-9999px', 'left:-9999px', 'width:794px',
    'background:#FFFFFF', "font-family:Inter,system-ui,-apple-system,sans-serif",
    'color:#0F172A', 'box-sizing:border-box', '-webkit-font-smoothing:antialiased',
  ].join(';');
  div.innerHTML = html;
  document.body.appendChild(div);
  const canvas = await html2canvas(div, {
    scale: 2, useCORS: true, backgroundColor: '#FFFFFF', logging: false, allowTaint: true,
  });
  document.body.removeChild(div);
  return canvas;
}

// ── Page builders ─────────────────────────────────────────────────────────────

function buildCoverPage(name: string, industry: string, colors: string[], accent: string): string {
  const bar = colors.map(c => `<div style="flex:1;background:${c};"></div>`).join('');
  const toc = [
    ['01', 'Paleta de Colores'],
    ['02', 'Tipografía'],
    ['03', 'Identidad Verbal'],
  ].map(([n, t]) => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:13px 0;border-bottom:1px solid #F1F5F9;">
      <span style="font-size:15px;color:#0F172A;font-weight:500;">${esc(t)}</span>
      <span style="font-size:11px;color:#94A3B8;font-weight:700;letter-spacing:.1em;">${n}</span>
    </div>`).join('');

  return `
    <div style="width:794px;min-height:1123px;background:#FFFFFF;position:relative;box-sizing:border-box;">
      <div style="height:6px;display:flex;">${bar}</div>
      <div style="padding:88px 64px 40px;">
        <div style="font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:${accent};margin-bottom:18px;font-weight:800;">
          Manual de Identidad de Marca
        </div>
        <h1 style="font-size:64px;font-weight:900;letter-spacing:-.03em;color:#0F172A;margin:0 0 10px;line-height:1.0;font-family:Georgia,'Times New Roman',serif;">
          ${esc(name)}
        </h1>
        <div style="font-size:17px;color:#64748B;margin-bottom:48px;font-weight:400;">${esc(industry)}</div>
        <div style="display:flex;height:10px;border-radius:100px;overflow:hidden;margin-bottom:56px;">${bar}</div>
        <div style="font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#94A3B8;margin-bottom:14px;font-weight:700;">Contenido</div>
        ${toc}
      </div>
      <div style="position:absolute;bottom:40px;left:64px;right:64px;display:flex;justify-content:space-between;align-items:center;padding-top:16px;border-top:1px solid #F1F5F9;">
        <span style="font-size:11px;color:#94A3B8;">Generado en porefox.com.ar | @merlosjoa</span>
        <span style="font-size:11px;color:#94A3B8;">${new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
    </div>`;
}

function buildColorsPage(colors: string[], colorRoles: string[], accent: string): string {
  const cards = colors.map((color, i) => {
    const rgb = hexToRgb(color);
    const cmyk = hexToCmyk(color);
    const scale = generateColorScale(color);
    const textColor = getContrastColor(color);
    const scaleDots = scale.map(s => `<div style="flex:1;height:18px;background:${s};"></div>`).join('');

    return `
      <div style="margin-bottom:20px;">
        <div style="display:flex;border-radius:8px 8px 0 0;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.07);">
          <div style="width:120px;flex-shrink:0;background:${color};padding:20px 14px;display:flex;flex-direction:column;justify-content:flex-end;">
            <span style="font-size:11px;font-weight:700;color:${textColor};font-family:monospace;letter-spacing:.05em;">${color.toUpperCase()}</span>
          </div>
          <div style="flex:1;background:#F8FAFC;padding:16px 20px;display:flex;align-items:center;gap:18px;flex-wrap:wrap;">
            <div style="min-width:90px;">
              <div style="font-size:8px;color:#94A3B8;text-transform:uppercase;letter-spacing:.16em;margin-bottom:3px;font-weight:700;">Rol</div>
              <div style="font-size:13px;font-weight:700;color:#0F172A;">${esc(colorRoles[i] || `Color ${i + 1}`)}</div>
            </div>
            <div style="width:1px;height:32px;background:#E2E8F0;flex-shrink:0;"></div>
            <div>
              <div style="font-size:8px;color:#94A3B8;text-transform:uppercase;letter-spacing:.16em;margin-bottom:3px;font-weight:700;">HEX</div>
              <div style="font-size:12px;font-weight:700;color:#0F172A;font-family:monospace;">${color.toUpperCase()}</div>
            </div>
            <div style="width:1px;height:32px;background:#E2E8F0;flex-shrink:0;"></div>
            <div>
              <div style="font-size:8px;color:#94A3B8;text-transform:uppercase;letter-spacing:.16em;margin-bottom:3px;font-weight:700;">RGB</div>
              <div style="font-size:12px;font-weight:700;color:#0F172A;">${rgb.r} · ${rgb.g} · ${rgb.b}</div>
            </div>
            <div style="width:1px;height:32px;background:#E2E8F0;flex-shrink:0;"></div>
            <div>
              <div style="font-size:8px;color:#94A3B8;text-transform:uppercase;letter-spacing:.16em;margin-bottom:3px;font-weight:700;">CMYK</div>
              <div style="font-size:12px;font-weight:700;color:#0F172A;">C${cmyk.c} M${cmyk.m} Y${cmyk.y} K${cmyk.k}</div>
            </div>
          </div>
        </div>
        <div style="display:flex;border-radius:0 0 6px 6px;overflow:hidden;">${scaleDots}</div>
      </div>`;
  }).join('');

  return `
    <div style="padding:48px 64px 56px;background:#FFFFFF;">
      <div style="display:flex;align-items:baseline;gap:14px;margin-bottom:32px;padding-bottom:18px;border-bottom:2px solid ${accent};">
        <span style="font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:${accent};font-weight:800;">01</span>
        <h2 style="font-size:26px;font-weight:800;color:#0F172A;margin:0;letter-spacing:-.02em;">Paleta de Colores</h2>
      </div>
      ${cards}
      <div style="margin-top:8px;padding:14px 16px;background:#F8FAFC;border-radius:6px;">
        <div style="font-size:8px;color:#94A3B8;text-transform:uppercase;letter-spacing:.16em;margin-bottom:8px;font-weight:700;">
          Escala cromática — variantes de oscuro a claro (color acento)
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:9px;color:#94A3B8;font-weight:600;">900</span>
          <div style="flex:1;display:flex;height:20px;border-radius:4px;overflow:hidden;">
            ${generateColorScale(colors[2] || colors[0]).map(s => `<div style="flex:1;background:${s};"></div>`).join('')}
          </div>
          <span style="font-size:9px;color:#94A3B8;font-weight:600;">100</span>
        </div>
      </div>
    </div>`;
}

function buildTypographyPage(fonts: FontPair, fontWeights: string[], accent: string): string {
  const alpha = 'Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz';
  const nums  = '0 1 2 3 4 5 6 7 8 9 ! @ # $ % & *';
  const pangram = 'El veloz murciélago hindú comía feliz cardillo y kiwi.';
  const sortedWeights = [...fontWeights].sort((a, b) => Number(a) - Number(b));

  const weightRows = (family: string) =>
    sortedWeights.map(w => `
      <div style="display:flex;align-items:baseline;gap:16px;padding:7px 0;border-bottom:1px solid #F1F5F9;">
        <span style="font-size:9px;color:#94A3B8;width:72px;flex-shrink:0;font-weight:700;letter-spacing:.1em;text-transform:uppercase;">
          ${WEIGHT_LABELS[w] || w} ${w}
        </span>
        <span style="font-size:16px;font-family:'${family}',serif,sans-serif;font-weight:${w};color:#0F172A;line-height:1.3;">
          ${pangram}
        </span>
      </div>`).join('');

  const fontBlock = (role: string, roleDesc: string, family: string) => `
    <div style="margin-bottom:32px;padding:24px 28px;background:#F8FAFC;border-radius:8px;border-left:3px solid ${accent};">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
        <span style="font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:${accent};font-weight:800;background:${accent}18;padding:3px 10px;border-radius:100px;">
          ${role}
        </span>
        <span style="font-size:10px;color:#94A3B8;">${roleDesc}</span>
      </div>
      <div style="font-size:32px;font-weight:700;color:#0F172A;font-family:'${family}',serif,sans-serif;margin-bottom:14px;letter-spacing:-.01em;line-height:1;">
        ${family}
      </div>
      <div style="font-size:13px;color:#475569;font-family:'${family}',serif,sans-serif;margin-bottom:8px;line-height:1.9;letter-spacing:.01em;">
        ${alpha}
      </div>
      <div style="font-size:13px;color:#475569;font-family:'${family}',serif,sans-serif;margin-bottom:16px;letter-spacing:.04em;">
        ${nums}
      </div>
      ${weightRows(family)}
    </div>`;

  return `
    <div style="padding:48px 64px 56px;background:#FFFFFF;">
      <div style="display:flex;align-items:baseline;gap:14px;margin-bottom:32px;padding-bottom:18px;border-bottom:2px solid ${accent};">
        <span style="font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:${accent};font-weight:800;">02</span>
        <h2 style="font-size:26px;font-weight:800;color:#0F172A;margin:0;letter-spacing:-.02em;">Tipografía</h2>
      </div>
      ${fontBlock('Titular', 'Títulos, encabezados y display', fonts.heading)}
      ${fontBlock('Cuerpo', 'Párrafos, botones y UI', fonts.body)}
    </div>`;
}

function buildIdentityPage(texts: Record<string, string>, accent: string): string {
  const entries = Object.entries(texts).filter(([, v]) => v?.trim());
  const blocks = entries.map(([k, v]) => `
    <div style="margin-bottom:16px;padding:18px 22px;border-radius:6px;border-left:3px solid ${accent};background:#F8FAFC;">
      <div style="font-size:8px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:${accent};margin-bottom:8px;">
        ${esc(SECTION_LABELS[k] || k)}
      </div>
      <div style="font-size:13px;line-height:1.8;color:#1E293B;white-space:pre-wrap;">${esc(v)}</div>
    </div>`).join('');

  return `
    <div style="padding:48px 64px 56px;background:#FFFFFF;">
      <div style="display:flex;align-items:baseline;gap:14px;margin-bottom:32px;padding-bottom:18px;border-bottom:2px solid ${accent};">
        <span style="font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:${accent};font-weight:800;">03</span>
        <h2 style="font-size:26px;font-weight:800;color:#0F172A;margin:0;letter-spacing:-.02em;">Identidad Verbal</h2>
      </div>
      ${blocks}
    </div>`;
}

function buildRulesPage(accent: string): string {
  const items = USAGE_RULES.map(rule => `
    <div style="display:flex;align-items:flex-start;gap:14px;padding:13px 0;border-bottom:1px solid #F1F5F9;">
      <div style="width:22px;height:22px;flex-shrink:0;background:#FEE2E2;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-top:1px;">
        <span style="color:#DC2626;font-size:12px;font-weight:900;line-height:1;">✕</span>
      </div>
      <span style="font-size:13px;color:#0F172A;line-height:1.65;padding-top:2px;">${esc(rule)}</span>
    </div>`).join('');

  return `
    <div style="padding:48px 64px 56px;background:#FFFFFF;">
      <div style="display:flex;align-items:baseline;gap:14px;margin-bottom:32px;padding-bottom:18px;border-bottom:2px solid ${accent};">
        <span style="font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:${accent};font-weight:800;">04</span>
        <h2 style="font-size:26px;font-weight:800;color:#0F172A;margin:0;letter-spacing:-.02em;">Usos Incorrectos</h2>
      </div>
      <p style="font-size:13px;color:#64748B;margin:0 0 24px;line-height:1.75;">
        Para preservar la consistencia e impacto de la identidad visual, es fundamental respetar las siguientes
        normas de uso. El incumplimiento debilita la marca y genera inconsistencia ante la audiencia.
      </p>
      ${items}
    </div>`;
}

// ── Main export component ────────────────────────────────────────────────────

export default function PdfExport({ brandData, onReset }: PdfExportProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const { default: jsPDF } = await import('jspdf');

      const accent = brandData.colors[2] || brandData.colors[0] || '#C07A18';
      const weights = brandData.fontWeights.length ? brandData.fontWeights : ['400', '700'];
      const wStr = [...weights].sort((a, b) => Number(a) - Number(b)).join(';');

      // Ensure fonts are loaded
      const gfLink = document.createElement('link');
      gfLink.rel = 'stylesheet';
      gfLink.href = [
        `https://fonts.googleapis.com/css2?`,
        `family=${brandData.fonts.heading.replace(/ /g, '+')}:wght@${wStr}`,
        `&family=${brandData.fonts.body.replace(/ /g, '+')}:wght@${wStr}`,
        `&display=swap`,
      ].join('');
      document.head.appendChild(gfLink);
      await new Promise(r => setTimeout(r, 1400));
      await document.fonts.ready;

      const colors = brandData.colors.length === 5
        ? brandData.colors
        : ['#0F172A', '#1E3A5F', '#2563EB', '#38BDF8', '#F8FAFC'];
      const colorRoles = brandData.colorRoles.length === 5
        ? brandData.colorRoles
        : ['Primario 1', 'Primario 2', 'Acento', 'Fondo', 'Tipografía'];
      const hasTexts = Object.values(brandData.texts).some(v => v?.trim());

      // Render all pages in sequence (html2canvas mutates DOM so sequential is safer)
      const coverCanvas    = await renderSection(buildCoverPage(brandData.name, brandData.industry, colors, accent));
      const colorsCanvas   = await renderSection(buildColorsPage(colors, colorRoles, accent));
      const typoCanvas     = await renderSection(buildTypographyPage(brandData.fonts, weights, accent));
      const identityCanvas = hasTexts ? await renderSection(buildIdentityPage(brandData.texts, accent)) : null;

      document.head.removeChild(gfLink);

      const toImg = (c: HTMLCanvasElement) => c.toDataURL('image/jpeg', 0.93);
      const pw = (c: HTMLCanvasElement) => c.width / 2;
      const ph = (c: HTMLCanvasElement) => c.height / 2;

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [pw(coverCanvas), ph(coverCanvas)], compress: true });
      pdf.addImage(toImg(coverCanvas), 'JPEG', 0, 0, pw(coverCanvas), ph(coverCanvas));

      for (const canvas of [colorsCanvas, typoCanvas, identityCanvas]) {
        if (!canvas) continue;
        pdf.addPage([pw(canvas), ph(canvas)]);
        pdf.addImage(toImg(canvas), 'JPEG', 0, 0, pw(canvas), ph(canvas));
      }

      pdf.save(`${brandData.name.replace(/\s+/g, '-').toLowerCase()}-manual-de-marca.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Error al exportar. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
      <button className="btn-primary pdf-export-btn" onClick={handleExport} disabled={loading} type="button">
        {loading ? (
          <>
            <span className="brand-text__spinner" style={{ marginRight: 8 }} />
            Generando PDF… puede tardar unos segundos
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 8 }}>
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            ↓ EXPORTAR MANUAL DE MARCA (PDF)
          </>
        )}
      </button>
      <button onClick={onReset} className="btn-primary" type="button">
        ← GENERAR OTRA MARCA
      </button>
    </div>
  );
}
