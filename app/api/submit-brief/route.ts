import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = await req.text();
    const params = new URLSearchParams(body);
    const data = Object.fromEntries(params.entries());

    // Construir el email con todos los campos del brief
    const fieldsHtml = Object.entries(data)
      .filter(([key]) => key !== 'form-name')
      .map(([key, value]) => `<tr><td style="padding:8px 12px;font-weight:600;background:#f5f5f5;border:1px solid #ddd;white-space:nowrap">${key}</td><td style="padding:8px 12px;border:1px solid #ddd">${value || '—'}</td></tr>`)
      .join('');

    await resend.emails.send({
      from: 'Brief Onboarding <onboarding@resend.dev>',
      to: 'l4sh3ro@gmail.com',
      subject: `Nuevo Brief recibido — ${data['nombre'] || data['empresa'] || 'Sin nombre'}`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:700px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#E89820,#C06818);padding:24px 32px">
            <h1 style="color:white;margin:0;font-size:22px">Nuevo Brief recibido</h1>
            <p style="color:rgba(255,255,255,0.85);margin:4px 0 0">merlosjoa.com · Onboarding</p>
          </div>
          <div style="padding:32px">
            <table style="width:100%;border-collapse:collapse">
              ${fieldsHtml}
            </table>
          </div>
          <div style="padding:16px 32px;background:#f9f9f9;font-size:12px;color:#888">
            Enviado desde el formulario de brief de merlosjoa.com
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Resend error:', error);
    return NextResponse.json({ error: 'Failed to send brief' }, { status: 500 });
  }
}
