'use client';
import { useState } from 'react';

export interface BrandFormData {
  name: string;
  industry: string;
  description: string;
}

const INDUSTRIES = [
  'Tecnología / Software',
  'Salud y Bienestar',
  'Educación',
  'Gastronomía / Restaurantes',
  'Moda y Lifestyle',
  'Consultoría y Servicios',
  'E-commerce / Retail',
  'Finanzas',
  'Arte y Creatividad',
  'Deporte y Fitness',
  'Turismo y Hospitalidad',
  'Inmobiliaria',
  'Otro',
];

interface BrandFormProps {
  onSubmit: (data: BrandFormData) => void;
}

export default function BrandForm({ onSubmit }: BrandFormProps) {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !industry || !description.trim()) return;
    onSubmit({ name: name.trim(), industry, description: description.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="brand-form">
      <div className="brand-form__field">
        <label htmlFor="brand-name">Nombre del negocio</label>
        <input
          id="brand-name"
          type="text"
          placeholder="Ej: Lumina Studio"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={80}
        />
      </div>

      <div className="brand-form__field">
        <label htmlFor="brand-industry">Industria</label>
        <select
          id="brand-industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          required
        >
          <option value="" disabled>Seleccioná una industria</option>
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
      </div>

      <div className="brand-form__field">
        <label htmlFor="brand-description">
          ¿Qué hace tu negocio?
          <span className="brand-form__char-count">{description.length}/200</span>
        </label>
        <textarea
          id="brand-description"
          placeholder="Describí brevemente a qué se dedica tu negocio, qué problema resuelve y a quién le habla..."
          value={description}
          onChange={(e) => {
            if (e.target.value.length <= 200) setDescription(e.target.value);
          }}
          required
          rows={4}
        />
      </div>

      <button type="submit" className="btn-primary brand-form__submit">
        Generar Identidad
      </button>
    </form>
  );
}
