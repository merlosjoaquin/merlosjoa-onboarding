'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Utilities ────────────────────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
    case g: h = ((b - r) / d + 2) / 6; break;
    case b: h = ((r - g) / d + 4) / 6; break;
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

export function generateColorScale(hex: string): string[] {
  const [h, s] = hexToHsl(hex);
  return [
    hslToHex(h, Math.min(s + 8, 100), 18),
    hslToHex(h, Math.min(s + 5, 100), 30),
    hslToHex(h, Math.min(s + 2, 100), 42),
    hex.toUpperCase(),
    hslToHex(h, Math.max(s - 8, 15), 62),
    hslToHex(h, Math.max(s - 14, 12), 74),
    hslToHex(h, Math.max(s - 20, 8), 84),
  ];
}

function isValidHex(hex: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? '#18263A' : '#FFFFFF';
}

// ─── Industry palettes ────────────────────────────────────────────────────────

const INDUSTRY_PALETTES: Record<string, string[][]> = {
  'Tecnología / Software': [
    ['#0F172A', '#1E3A5F', '#2563EB', '#38BDF8', '#F8FAFC'],
    ['#0D0D0D', '#1A1A2E', '#16213E', '#0F3460', '#E94560'],
    ['#0A0A0A', '#004D61', '#00B4D8', '#90E0EF', '#FAFAFA'],
  ],
  'Salud y Bienestar': [
    ['#F0FDF4', '#86EFAC', '#22C55E', '#15803D', '#052E16'],
    ['#FFF7ED', '#FED7AA', '#FB923C', '#EA580C', '#7C2D12'],
    ['#F0F9FF', '#BAE6FD', '#38BDF8', '#0284C7', '#0C4A6E'],
  ],
  'Educación': [
    ['#FEF9C3', '#FDE047', '#EAB308', '#A16207', '#422006'],
    ['#EFF6FF', '#BFDBFE', '#3B82F6', '#1D4ED8', '#1E1B4B'],
    ['#F5F3FF', '#DDD6FE', '#8B5CF6', '#6D28D9', '#2E1065'],
  ],
  'Gastronomía / Restaurantes': [
    ['#1A0A00', '#7C2D12', '#C2410C', '#FB923C', '#FFF7ED'],
    ['#0F0F0F', '#1C1C1C', '#8B1A1A', '#D4A017', '#F5F0E8'],
    ['#FFFFFF', '#F3F4F6', '#1F2937', '#111827', '#EF4444'],
  ],
  'Moda y Lifestyle': [
    ['#FDF2F8', '#F9A8D4', '#EC4899', '#BE185D', '#500724'],
    ['#0A0A0A', '#1A1A1A', '#D4AF37', '#8B7536', '#F5F0E8'],
    ['#FAFAF9', '#E7E5E4', '#78716C', '#44403C', '#1C1917'],
  ],
  'Consultoría y Servicios': [
    ['#0F172A', '#1E293B', '#334155', '#94A3B8', '#F8FAFC'],
    ['#1A1A2E', '#16213E', '#0F3460', '#533483', '#E2D5F8'],
    ['#F8F7F4', '#E8E0D5', '#C07A18', '#8B5A14', '#2C1A08'],
  ],
  'E-commerce / Retail': [
    ['#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1', '#1A1A2E'],
    ['#F8F9FA', '#E9ECEF', '#495057', '#212529', '#FF6347'],
    ['#0A0A0A', '#FF4500', '#FF8C00', '#FFD700', '#FFFACD'],
  ],
  'Finanzas': [
    ['#0F2027', '#203A43', '#2C5364', '#4A9BA8', '#E0F7FA'],
    ['#1A1A1A', '#2D4A22', '#4A7C59', '#7EC8A4', '#F0FFF4'],
    ['#0F172A', '#1E3A5F', '#1D4ED8', '#60A5FA', '#EFF6FF'],
  ],
  'Arte y Creatividad': [
    ['#2D1B69', '#11998E', '#38EF7D', '#FC5C7D', '#FFECD2'],
    ['#0A0A0A', '#FF006E', '#FB5607', '#FFBE0B', '#8338EC'],
    ['#F8F9FA', '#E63946', '#457B9D', '#1D3557', '#A8DADC'],
  ],
  'Deporte y Fitness': [
    ['#0D0D0D', '#FF3333', '#FF6B35', '#FFC300', '#FAFAFA'],
    ['#001427', '#08415C', '#CC2936', '#F4F4F8', '#388697'],
    ['#0A0A0A', '#00B4D8', '#0077B6', '#023E8A', '#CAF0F8'],
  ],
  'Turismo y Hospitalidad': [
    ['#0077B6', '#00B4D8', '#90E0EF', '#CAF0F8', '#03045E'],
    ['#2D6A4F', '#40916C', '#74C69D', '#B7E4C7', '#D8F3DC'],
    ['#FFBA08', '#FAA307', '#F48C06', '#E85D04', '#DC2F02'],
  ],
  'Inmobiliaria': [
    ['#1A1A1A', '#2C2C2C', '#C9A84C', '#E8D5A3', '#F5F0E8'],
    ['#0F172A', '#1E3A5F', '#2E6DA4', '#7FB3D3', '#EAF4FB'],
    ['#F5F5F5', '#E0E0E0', '#757575', '#212121', '#B71C1C'],
  ],
  'Otro': [
    ['#18263A', '#4A6275', '#C07A18', '#E89820', '#F2F5F8'],
    ['#1A1A2E', '#16213E', '#0F3460', '#533483', '#E94560'],
    ['#0F0F0F', '#1C1C1C', '#2D2D2D', '#D4A017', '#F5F0E8'],
  ],
};

export const DEFAULT_COLOR_ROLES = ['Primario 1', 'Primario 2', 'Acento', 'Fondo', 'Tipografía'];

function generateHarmoniousPalette(): string[] {
  const schemes = ['analogous', 'complementary', 'triadic', 'split-complementary', 'monochromatic'];
  const scheme = schemes[Math.floor(Math.random() * schemes.length)];
  const baseHue = Math.floor(Math.random() * 360);
  const baseSat = 40 + Math.floor(Math.random() * 40);
  let hues: number[];
  switch (scheme) {
    case 'analogous': hues = [baseHue, baseHue + 30, baseHue + 60, baseHue + 90, baseHue + 15]; break;
    case 'complementary': hues = [baseHue, baseHue + 30, baseHue + 180, baseHue + 210, baseHue + 150]; break;
    case 'triadic': hues = [baseHue, baseHue + 120, baseHue + 240, baseHue + 60, baseHue + 180]; break;
    case 'split-complementary': hues = [baseHue, baseHue + 150, baseHue + 210, baseHue + 30, baseHue + 330]; break;
    default: hues = [baseHue, baseHue, baseHue, baseHue, baseHue]; break;
  }
  const lightnesses = [20, 35, 55, 70, 85].sort(() => Math.random() - 0.5);
  return hues.map((h, i) => hslToHex(h % 360, baseSat, lightnesses[i]));
}

function getInitialPalette(industry: string): string[] {
  const palettes = INDUSTRY_PALETTES[industry];
  if (palettes?.length) return [...palettes[0]];
  const h = Math.floor(Math.random() * 360);
  const s = 40 + Math.floor(Math.random() * 40);
  return [20, 32, 48, 66, 82].map(l => hslToHex(h, s, l));
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ColorPaletteProps {
  industry: string;
  initialPalette?: string[];
  onChange?: (colors: string[]) => void;
  onRolesChange?: (roles: string[]) => void;
}

export default function ColorPalette({ industry, initialPalette, onChange, onRolesChange }: ColorPaletteProps) {
  const [colors, setColors] = useState<string[]>(() =>
    initialPalette?.length === 5 ? initialPalette : getInitialPalette(industry)
  );
  const [locked, setLocked] = useState<boolean[]>([false, false, false, false, false]);
  const [colorRoles, setColorRoles] = useState<string[]>([...DEFAULT_COLOR_ROLES]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editingRoleIndex, setEditingRoleIndex] = useState<number | null>(null);
  const [editingRoleValue, setEditingRoleValue] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [paletteIndex, setPaletteIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const roleInputRef = useRef<HTMLInputElement>(null);

  const availablePalettes = INDUSTRY_PALETTES[industry] || [];

  const regenerate = useCallback(() => {
    const newPalette = generateHarmoniousPalette();
    setColors(prev => prev.map((color, i) => locked[i] ? color : newPalette[i]));
  }, [locked]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (e.code === 'Space' && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
        e.preventDefault();
        regenerate();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [regenerate]);

  useEffect(() => { onChange?.(colors); }, [colors, onChange]);
  useEffect(() => { onRolesChange?.(colorRoles); }, [colorRoles, onRolesChange]);

  const toggleLock = (i: number) =>
    setLocked(prev => { const n = [...prev]; n[i] = !n[i]; return n; });

  const startEdit = (i: number) => {
    setEditingIndex(i);
    setEditValue(colors[i]);
    setTimeout(() => inputRef.current?.focus(), 0);
  };
  const commitEdit = () => {
    if (editingIndex === null) return;
    const val = editValue.startsWith('#') ? editValue : `#${editValue}`;
    if (isValidHex(val)) setColors(prev => { const n = [...prev]; n[editingIndex] = val.toUpperCase(); return n; });
    setEditingIndex(null);
  };

  const startRoleEdit = (i: number) => {
    setEditingRoleIndex(i);
    setEditingRoleValue(colorRoles[i]);
    setTimeout(() => roleInputRef.current?.focus(), 0);
  };
  const commitRoleEdit = () => {
    if (editingRoleIndex === null) return;
    const trimmed = editingRoleValue.trim();
    if (trimmed) setColorRoles(prev => { const n = [...prev]; n[editingRoleIndex] = trimmed; return n; });
    setEditingRoleIndex(null);
  };

  const copyHex = async (hex: string, i: number) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedIndex(i);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch { /* noop */ }
  };

  const switchPalette = (idx: number) => {
    setPaletteIndex(idx);
    setColors(availablePalettes[idx]
      ? availablePalettes[idx].map((c, i) => locked[i] ? colors[i] : c)
      : generateHarmoniousPalette()
    );
  };

  return (
    <div className="color-palette">
      <div className="color-palette__swatches">
        {colors.map((color, i) => {
          const scale = generateColorScale(color);
          return (
            <div key={i} className={`color-swatch ${locked[i] ? 'color-swatch--locked' : ''}`}>
              <div
                className="color-swatch__block"
                style={{ backgroundColor: color }}
                onClick={() => startEdit(i)}
              >
                <button
                  type="button"
                  className="color-swatch__lock"
                  onClick={e => { e.stopPropagation(); toggleLock(i); }}
                  title={locked[i] ? 'Desbloquear' : 'Bloquear color'}
                  aria-label={locked[i] ? 'Desbloquear color' : 'Bloquear color'}
                >
                  {locked[i] ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1C9.24 1 7 3.24 7 6v1H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2h-1V6c0-2.76-2.24-5-5-5zm0 2c1.71 0 3 1.29 3 3v1H9V6c0-1.71 1.29-3 3-3zm0 9c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
                    </svg>
                  )}
                </button>
                <button
                  type="button"
                  className="color-swatch__copy"
                  style={{ color: getContrastColor(color) }}
                  onClick={e => { e.stopPropagation(); copyHex(color, i); }}
                  title="Copiar HEX"
                >
                  {copiedIndex === i ? 'Copiado' : 'Copiar'}
                </button>
              </div>

              {/* Tints/shades scale strip */}
              <div className="color-swatch__scale">
                {scale.map((s, j) => (
                  <div key={j} className="color-swatch__scale-dot" style={{ backgroundColor: s }} />
                ))}
              </div>

              {/* HEX editor */}
              <div className="color-swatch__hex">
                {editingIndex === i ? (
                  <input
                    ref={inputRef}
                    className="color-swatch__hex-input"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditingIndex(null); }}
                    maxLength={7}
                    spellCheck={false}
                  />
                ) : (
                  <span onClick={() => startEdit(i)} title="Editar HEX">{color}</span>
                )}
              </div>

              {/* Role name editor */}
              <div className="color-swatch__role" title="Clic para editar el rol">
                {editingRoleIndex === i ? (
                  <input
                    ref={roleInputRef}
                    className="color-swatch__role-input"
                    value={editingRoleValue}
                    onChange={e => setEditingRoleValue(e.target.value)}
                    onBlur={commitRoleEdit}
                    onKeyDown={e => { if (e.key === 'Enter') commitRoleEdit(); if (e.key === 'Escape') setEditingRoleIndex(null); }}
                    maxLength={16}
                    spellCheck={false}
                  />
                ) : (
                  <span onClick={() => startRoleEdit(i)}>{colorRoles[i]}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="color-palette__controls">
        <button type="button" className="btn-secondary" onClick={regenerate}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 6 }}>
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          Generar paleta
        </button>
        <span className="color-palette__hint">o Espacio · clic en el rol para renombrarlo</span>

      </div>
    </div>
  );
}
