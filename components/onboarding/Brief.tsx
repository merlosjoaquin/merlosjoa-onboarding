'use client';

import { useState, FormEvent } from 'react';

export default function Brief() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSubmitting(true);

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString(),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        setSubmitting(false);
        alert('Hubo un error al enviar. Intentá de nuevo.');
      }
    } catch {
      setSubmitting(false);
      alert('Hubo un error al enviar. Intentá de nuevo.');
    }
  };

  return (
    <section id="brief">
      <div className="section-wrap">
        <form
          id="brief-form"
          name="brief"
          data-netlify="true"
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="form-name" value="brief" />

          <div className="brief-header">
            <div>
              <div className="section-eyebrow">Formulario de Brief</div>
              <h2 className="section-title">
                Contame todo<br />
                <em>sobre tu marca.</em>
              </h2>
            </div>
            <div className="brief-intro-note">
              <strong>Todo lo que escribas es confidencial.</strong> No hay longitud mínima ni máxima. Completá con la mayor honestidad posible — cuanto más contexto, más precisa la estrategia. Estimá entre 15 y 25 minutos.
            </div>
          </div>

          {/* SECCIÓN 01 — Datos de la Marca */}
          <div className="fsec">
            <div className="fsec-header">
              <div className="fsec-num">01</div>
              <h3>Datos de la Marca</h3>
              <span className="fsec-desc">Identidad básica</span>
            </div>
            <div className="row2">
              <div className="field">
                <label htmlFor="q01_nombre">Nombre de la marca o profesional</label>
                <input type="text" id="q01_nombre" name="q01_nombre" placeholder="Texto libre" />
              </div>
              <div className="field">
                <label htmlFor="q01_email">Email de contacto</label>
                <input type="email" id="q01_email" name="q01_email" placeholder="tucorreo@ejemplo.com" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="q01_nicho">Industria / Nicho</label>
              <span className="hint">Ej: fitness, gastronomía, finanzas personales, moda...</span>
              <input type="text" id="q01_nicho" name="q01_nicho" placeholder="Tu industria o nicho" />
            </div>
            <div className="field">
              <label htmlFor="q01_redes">¿Tenés redes activas? ¿Cuáles y con qué handles?</label>
              <span className="hint">Ej: IG @mihandle · TikTok @mihandle · LinkedIn /in/nombre</span>
              <input type="text" id="q01_redes" name="q01_redes" placeholder="Listá las redes con sus handles" />
            </div>
            <div className="row2">
              <div className="field">
                <label htmlFor="q01_antiguedad">Antigüedad de las redes / marca</label>
                <span className="hint">Ej: 6 meses en IG con 800 seguidores</span>
                <input type="text" id="q01_antiguedad" name="q01_antiguedad" placeholder="Tiempo y estado actual" />
              </div>
              <div className="field">
                <label htmlFor="q01_web">Sitio web o link en bio actual</label>
                <input type="text" id="q01_web" name="q01_web" placeholder="URL o 'No tengo'" />
              </div>
            </div>
          </div>

          <div className="step-divider"><span>Audiencia</span></div>

          {/* SECCIÓN 02 — Audiencia Objetivo */}
          <div className="fsec">
            <div className="fsec-header">
              <div className="fsec-num">02</div>
              <h3>Audiencia Objetivo</h3>
              <span className="fsec-desc">A quién le hablamos</span>
            </div>
            <div className="field">
              <label htmlFor="q02_ideal">Descripción del cliente ideal</label>
              <span className="hint">Edad, género, intereses, nivel económico, dónde vive...</span>
              <textarea id="q02_ideal" name="q02_ideal" className="tall" placeholder="Describí a tu cliente ideal lo más específico posible." />
            </div>
            <div className="field">
              <label htmlFor="q02_problema">¿Qué problema tiene tu cliente que vos resolvés?</label>
              <span className="hint">Sé específico — este es el eje del contenido</span>
              <textarea id="q02_problema" name="q02_problema" placeholder="El dolor o necesidad concreta que resolvés" />
            </div>
          </div>

          <div className="step-divider"><span>Competencia</span></div>

          {/* SECCIÓN 03 — Competencia */}
          <div className="fsec">
            <div className="fsec-header">
              <div className="fsec-num">03</div>
              <h3>Competencia</h3>
              <span className="fsec-desc">El ecosistema</span>
            </div>
            <div className="field">
              <label htmlFor="q03_nombres">3 competidores directos (con handle o nombre)</label>
              <input type="text" id="q03_nombres" name="q03_nombres" placeholder="Competidor 1 · Competidor 2 · Competidor 3" />
            </div>
            <div className="row2">
              <div className="field">
                <label htmlFor="q03_bien">¿Qué hacen bien que querés replicar?</label>
                <textarea id="q03_bien" name="q03_bien" placeholder="Lo que admirás o funciona en la competencia" />
              </div>
              <div className="field">
                <label htmlFor="q03_diferencial">¿En qué querés ser diferente a ellos?</label>
                <textarea id="q03_diferencial" name="q03_diferencial" placeholder="Tu ventaja competitiva o diferenciador clave" />
              </div>
            </div>
          </div>

          <div className="step-divider"><span>Objetivos</span></div>

          {/* SECCIÓN 04 — Objetivos de Negocio */}
          <div className="fsec">
            <div className="fsec-header">
              <div className="fsec-num">04</div>
              <h3>Objetivos de Negocio</h3>
              <span className="fsec-desc">Hacia dónde vamos</span>
            </div>
            <div className="field">
              <label htmlFor="q04_3meses">¿Qué querés lograr en los próximos 3 meses?</label>
              <span className="hint">Ej: 1000 seguidores, 5 clientes nuevos, lanzar producto...</span>
              <textarea id="q04_3meses" name="q04_3meses" placeholder="Objetivos concretos y medibles a 3 meses" />
            </div>
            <div className="row2">
              <div className="field">
                <label htmlFor="q04_ingresos">¿Cuál es tu principal fuente de ingresos?</label>
                <input type="text" id="q04_ingresos" name="q04_ingresos" placeholder="Tu modelo de negocio actual" />
              </div>
              <div className="field">
                <label htmlFor="q04_lowticket">¿Tenés producto de entrada (low ticket)?</label>
                <input type="text" id="q04_lowticket" name="q04_lowticket" placeholder="Oferta de entrada o 'No tengo todavía'" />
              </div>
            </div>
            <div className="row2">
              <div className="field">
                <label htmlFor="q04_seguidores">Meta de seguidores a 6 meses</label>
                <input type="text" id="q04_seguidores" name="q04_seguidores" placeholder="Número concreto" />
              </div>
              <div className="field">
                <label htmlFor="q04_facturacion">Meta de facturación mensual</label>
                <input type="text" id="q04_facturacion" name="q04_facturacion" placeholder="En USD o ARS" />
              </div>
            </div>
          </div>

          <div className="step-divider"><span>Contenido</span></div>

          {/* SECCIÓN 05 — Contenido y Comunicación */}
          <div className="fsec">
            <div className="fsec-header">
              <div className="fsec-num">05</div>
              <h3>Contenido y Comunicación</h3>
              <span className="fsec-desc">Cómo hablamos</span>
            </div>
            <div className="field">
              <label htmlFor="q05_tono">Tono de voz de la marca</label>
              <span className="hint">Ej: técnico y directo / cercano y motivacional / formal y profesional</span>
              <input type="text" id="q05_tono" name="q05_tono" placeholder="Cómo querés sonar en las redes" />
            </div>
            <div className="row2">
              <div className="field">
                <label htmlFor="q05_si">Temáticas que Sí querés cubrir</label>
                <textarea id="q05_si" name="q05_si" placeholder={'1) ...\n2) ...\n3) ...'} />
              </div>
              <div className="field">
                <label htmlFor="q05_no">Palabras o temas que NO querés usar</label>
                <textarea id="q05_no" name="q05_no" placeholder="Lo que está fuera de límites para tu marca" />
              </div>
            </div>
            <div className="row2">
              <div className="field">
                <label htmlFor="q05_produccion">¿Quién produce el contenido visual?</label>
                <input type="text" id="q05_produccion" name="q05_produccion" placeholder="yo mismo / fotógrafo / necesito ayuda" />
              </div>
              <div className="field">
                <label htmlFor="q05_material">¿Tenés material visual existente?</label>
                <input type="text" id="q05_material" name="q05_material" placeholder="Sí / No / Tengo algo pero poco" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="q05_frecuencia">¿Con qué frecuencia podés publicar realísticamente?</label>
              <input type="text" id="q05_frecuencia" name="q05_frecuencia" placeholder="Ej: 3 posts por semana / 1 reel diario" />
            </div>
          </div>

          <div className="step-divider"><span>Herramientas</span></div>

          {/* SECCIÓN 06 — Herramientas y Accesos */}
          <div className="fsec">
            <div className="fsec-header">
              <div className="fsec-num">06</div>
              <h3>Herramientas y Accesos</h3>
              <span className="fsec-desc">El stack actual</span>
            </div>
            <div className="row2">
              <div className="field">
                <label htmlFor="q06_scheduling">¿Usás alguna herramienta de scheduling?</label>
                <input type="text" id="q06_scheduling" name="q06_scheduling" placeholder="Later, Buffer, Meta Business Suite..." />
              </div>
              <div className="field">
                <label htmlFor="q06_email">¿Tenés email marketing configurado?</label>
                <input type="text" id="q06_email" name="q06_email" placeholder="Beehiiv, Mailchimp... o 'No tengo'" />
              </div>
            </div>
            <div className="row2">
              <div className="field">
                <label htmlFor="q06_pixel">¿Tenés Meta Pixel instalado?</label>
                <input type="text" id="q06_pixel" name="q06_pixel" placeholder="Sí / No / No tengo sitio" />
              </div>
              <div className="field">
                <label htmlFor="q06_acceso">¿Me das acceso de gestión a tus redes?</label>
                <input type="text" id="q06_acceso" name="q06_acceso" placeholder="Sí / Parcial / Lo consultamos" />
              </div>
            </div>
          </div>

          <div className="step-divider"><span>Inversión</span></div>

          {/* SECCIÓN 07 — Presupuesto y Tiempos */}
          <div className="fsec">
            <div className="fsec-header">
              <div className="fsec-num">07</div>
              <h3>Presupuesto y Tiempos</h3>
              <span className="fsec-desc">Para dimensionar bien</span>
            </div>
            <div className="field">
              <label htmlFor="q07_presupuesto">Rango de presupuesto mensual para marketing</label>
              <input type="text" id="q07_presupuesto" name="q07_presupuesto" placeholder="Un rango aproximado en USD o ARS." />
            </div>
            <div className="row2">
              <div className="field">
                <label htmlFor="q07_inicio">¿Cuándo querés empezar?</label>
                <input type="date" id="q07_inicio" name="q07_inicio" />
              </div>
              <div className="field">
                <label htmlFor="q07_deadline">¿Tenés alguna fecha límite o lanzamiento?</label>
                <input type="text" id="q07_deadline" name="q07_deadline" placeholder="Fecha concreta o 'Sin urgencia'" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="q07_extra">Algo más que quieras contarme</label>
              <span className="hint">Contexto adicional, experiencias previas, expectativas...</span>
              <textarea id="q07_extra" name="q07_extra" className="tall" placeholder="Espacio libre..." />
            </div>
          </div>

          <div className="submit-area">
            <h3>Todo listo.</h3>
            <p>
              Revisá tus respuestas y enviame el brief por email.<br />
              <strong>Respondo dentro de las 24 hs hábiles.</strong>
            </p>
            <div className="btn-row">
              {!success && (
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={submitting}
                >
                  {submitting ? 'Enviando...' : 'Enviar'}
                </button>
              )}
            </div>
            {success && (
              <div
                id="brief-success"
                style={{ marginTop: '20px', fontWeight: 600, fontSize: '16px' }}
              >
                ¡Brief recibido! Te respondo dentro de las 24 hs hábiles.
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
