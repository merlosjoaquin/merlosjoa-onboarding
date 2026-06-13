'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface Resource {
  id: number;
  num: string;
  img: string;
  driveUrl: string;
}

const resources: Resource[] = [
  { id: 1,  num: '01', img: '/images/recurso-02.jpg', driveUrl: 'https://drive.google.com/uc?export=download&id=1BOEh-XinXHBm-zOtHwmmq1DFfMB63ai3' },
  { id: 2,  num: '02', img: '/images/recurso-03.jpg', driveUrl: 'https://drive.google.com/uc?export=download&id=1j9R2HfWwe40ildNzXOiD07y1Bb9so8Ex' },
  { id: 3,  num: '03', img: '/images/recurso-04.jpg', driveUrl: 'https://drive.google.com/uc?export=download&id=1Ia_odpTqpFaWRFFh57gwO-UPcxexU6-C' },
  { id: 4,  num: '04', img: '/images/recurso-05.jpg', driveUrl: 'https://drive.google.com/uc?export=download&id=13AP8ppAfuWFBw6qPg62UEyb_S5Ye1QGF' },
  { id: 5,  num: '05', img: '/images/recurso-06.jpg', driveUrl: 'https://drive.google.com/uc?export=download&id=1u3iHTrP4FWHjbus9jyW3dbvaRTOn4o78' },
  { id: 6,  num: '06', img: '/images/recurso-07.jpg', driveUrl: 'https://drive.google.com/uc?export=download&id=15NKnnHNlF1ymM1X62E_UfQxmQ4YZrG1D' },
  { id: 7,  num: '07', img: '/images/recurso-08.jpg', driveUrl: 'https://drive.google.com/uc?export=download&id=1or4ENbCZQJZduKVT0oCVPVA0m82U_J6Y' },
  { id: 8,  num: '08', img: '/images/recurso-09.jpg', driveUrl: 'https://drive.google.com/uc?export=download&id=1cncP1o9GUlEZssbbMWviRGbySUl4T0b8' },
  { id: 9,  num: '09', img: '/images/recurso-10.jpg', driveUrl: 'https://drive.google.com/uc?export=download&id=1a32M2Ka2ouFCwdlfqn0ffLcyUH7RPbNK' },
  { id: 10, num: '10', img: '/images/recurso-11.jpg', driveUrl: 'https://drive.google.com/uc?export=download&id=1MPAsHUYp9T1nGvDsnEr2fQprnRRyzIQ3' },
];

const N = resources.length;
const CARD_W = 240;
const GAP = 20;

function getDownloaded(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem('rcard_downloaded') || '{}');
  } catch {
    return {};
  }
}

function markDownloaded(url: string) {
  const d = getDownloaded();
  d[url] = 1;
  localStorage.setItem('rcard_downloaded', JSON.stringify(d));
}

export default function Resources() {
  const [current, setCurrent] = useState(0);
  const [downloaded, setDownloaded] = useState<Record<string, number>>({});
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Load downloaded state from localStorage on mount
  useEffect(() => {
    setDownloaded(getDownloaded());
  }, []);

  const render = useCallback((instant: boolean) => {
    const track = trackRef.current;
    if (!track) return;
    const half = track.clientWidth / 2;
    const step0 = (CARD_W * 1.2) / 2 + GAP + (CARD_W * 0.9) / 2;
    const stepN = CARD_W * 0.9 + GAP;

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      let d = ((i - current) % N + N) % N;
      if (d > Math.floor(N / 2)) d -= N;
      const absd = Math.abs(d);
      const isActive = d === 0;
      const scale = isActive ? 1.2 : 0.9;
      const opacity =
        isActive ? 1
        : absd === 1 ? 0.55
        : absd === 2 ? 0.35
        : absd === 3 ? 0.18
        : 0;
      const zIdx = 10 - absd;
      const cx =
        d === 0
          ? half
          : half + (d > 0 ? 1 : -1) * (step0 + (absd - 1) * stepN);
      const tx = cx - CARD_W / 2;

      if (instant) card.style.transition = 'none';
      card.style.left = '0px';
      card.style.width = CARD_W + 'px';
      card.style.transform = `translateX(${tx}px) scale(${scale})`;
      card.style.opacity = String(opacity);
      card.style.zIndex = String(zIdx);
      card.style.pointerEvents = isActive ? 'auto' : 'none';
      card.classList.toggle('rcard--active', isActive);
      if (instant) {
        requestAnimationFrame(() => {
          card.style.transition = '';
        });
      }
    });
  }, [current]);

  // Render on current change and on resize
  useEffect(() => {
    render(false);
  }, [render]);

  useEffect(() => {
    render(true);
    const handleResize = () => render(true);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (dx > dy) e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      setCurrent(prev => ((prev + (dx < 0 ? 1 : -1) + N) % N));
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleDownloadClick = (url: string) => {
    setTimeout(() => {
      markDownloaded(url);
      setDownloaded(getDownloaded());
    }, 80);
  };

  const goTo = (n: number) => setCurrent(((n % N) + N) % N);

  return (
    <section id="recursos">
      <div className="recursos-header">
        <div className="recursos-header-text">
          <div className="section-eyebrow">Recursos Digitales</div>
          <h2 className="section-title">
            Plantillas y guías<br />
            <em>listas para usar.</em>
          </h2>
          <p>Herramientas para avanzar solo antes de contratar un servicio completo.</p>
        </div>
      </div>

      <div className="shelf-outer">
        <button
          className="shelf-nav shelf-nav--prev"
          onClick={() => goTo(current - 1)}
          aria-label="Anterior recurso"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div
          className="shelf-track"
          id="shelfTrack"
          ref={trackRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {resources.map((resource, i) => {
            const isDone = !!downloaded[resource.driveUrl];
            return (
              <div
                key={resource.id}
                className="rcard"
                ref={el => { cardRefs.current[i] = el; }}
              >
                <div
                  className="rcard-head"
                  style={{ backgroundImage: `url('${resource.img}')` }}
                >
                  <span className="rcard-icon"></span>
                  <span className="rcard-num">{resource.num}</span>
                </div>
                <div className="rcard-body">
                  <a
                    className={`rcard-cta${isDone ? ' rcard-cta--done' : ''}`}
                    href={resource.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleDownloadClick(resource.driveUrl)}
                  >
                    {isDone ? 'Obtenido' : 'Conseguilo'}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <button
          className="shelf-nav shelf-nav--next"
          onClick={() => goTo(current + 1)}
          aria-label="Siguiente recurso"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="shelf-dots">
        {resources.map((_, i) => (
          <button
            key={i}
            className={`shelf-dot${i === current ? ' shelf-dot--active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Recurso ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
