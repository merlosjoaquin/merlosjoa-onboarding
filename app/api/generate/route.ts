import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SECTION_PROMPTS: Record<string, string> = {
  slogan: `Eres un experto en branding. Genera UN slogan corto y memorable (máx 8 palabras) para esta marca. Solo devuelve el slogan, sin comillas ni explicación.`,
  mision: `Eres un experto en branding. Genera la MISIÓN de esta marca (2-3 oraciones sobre el propósito actual). Solo devuelve el texto de la misión.`,
  vision: `Eres un experto en branding. Genera la VISIÓN de esta marca (2-3 oraciones sobre el futuro aspiracional). Solo devuelve el texto de la visión.`,
  valores: `Eres un experto en branding. Genera 5 VALORES de marca. Formato: un valor por línea, "Nombre: descripción corta (máx 15 palabras)". Solo devuelve los 5 valores.`,
  personalidad: `Eres un experto en branding. Define la PERSONALIDAD de esta marca: 1 arquetipo (Innovador, Experto, Rebelde, Cuidador, Héroe, Mago, Sabio, Explorador, Creador, Soberano, Bufón, Amante) + 3 rasgos. Formato: "Arquetipo: [nombre]\nRasgos: [rasgo1], [rasgo2], [rasgo3]". Solo devuelve eso.`,
  posicionamiento: `Eres un experto en branding. Genera el POSICIONAMIENTO de esta marca: 1 propuesta de valor (1 oración) + 2 diferenciadores clave. Formato: "Propuesta de valor: [texto]\nDiferenciadores: [1], [2]". Solo devuelve eso.`,
  audiencia: `Eres un experto en branding. Define el PÚBLICO OBJETIVO de esta marca con un buyer persona básico: quién es, sus necesidades y motivaciones. Máx 100 palabras. Solo devuelve el texto.`,
  tono: `Eres un experto en branding. Define el TONO DE VOZ de esta marca: 1 estilo + 3 adjetivos + 1 ejemplo de copy (frase de 10-15 palabras que use ese tono). Formato: "Estilo: [texto]\nAdjetivos: [adj1], [adj2], [adj3]\nEjemplo: [frase]". Solo devuelve eso.`,
};

export async function POST(req: NextRequest) {
  try {
    const { section, brandName, industry, description } = await req.json();

    if (!section || !brandName || !industry) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const systemPrompt = SECTION_PROMPTS[section];
    if (!systemPrompt) {
      return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
    }

    const userPrompt = `Marca: "${brandName}"\nIndustria: ${industry}\nDescripción: ${description || 'No proporcionada'}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    const content = completion.choices[0]?.message?.content?.trim() || '';
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Groq error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
