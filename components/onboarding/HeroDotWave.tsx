'use client';
import { useEffect, useRef } from 'react';

export default function HeroDotWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const c = canvas;
    const ctx2d = c.getContext('2d');
    if (!ctx2d) return;
    const ctx = ctx2d;

    const SPACING = 28;
    const RADIUS = 1.5;
    const BASE = 0.10;   // minimum dot alpha
    const AMP  = 0.60;   // wave amplitude (peak alpha = BASE + AMP)
    const FREQ = 0.006;  // spatial frequency — ~1 full wave per 1050px of height
    const SPEED = 0.018; // time step per frame — full cycle ≈ 5.8s at 60fps

    let raf: number;
    let t = 0;

    function resize() {
      c.width  = c.offsetWidth;
      c.height = c.offsetHeight;
    }

    function draw() {
      const w = c.width;
      const h = c.height;
      ctx.clearRect(0, 0, w, h);

      for (let y = 0; y <= h + SPACING; y += SPACING) {
        const alpha = BASE + AMP * ((Math.sin(y * FREQ - t) + 1) / 2);
        ctx.beginPath();
        ctx.fillStyle = `rgba(232,146,30,${alpha.toFixed(3)})`;
        for (let x = 0; x <= w + SPACING; x += SPACING) {
          ctx.moveTo(x + RADIUS, y);
          ctx.arc(x, y, RADIUS, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      t += SPEED;
      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
