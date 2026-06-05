export default function Hero() {
  return (
    <section
      className="hero"
      style={{ backgroundImage: "url('/images/hero.jpg')" }}
    >
      <div className="hero-inner">
        <div className="hero-text">
          <div className="hero-eyebrow">
            <span>Product Marketing Specialist</span>
          </div>
          <h1 className="hero-title">
            Tu marca,<br />
            al <em>siguiente nivel.</em>
          </h1>
          <div className="hero-divider">
            <span>Community Management | Product Management | Inbound Marketing | Customer Experience</span>
          </div>
          <div className="hero-bottom">
            <div className="hero-btns">
              <a className="btn-primary" href="#brief">Trabajemos Juntos</a>
              <a className="btn-ghost" href="#recursos">Recursos Gratis</a>
              <a className="btn-primary" href="/marca">Crea tu marca gratis</a>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-glow"></div>
          <svg
            className="hero-contours"
            viewBox="0 0 560 560"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E8921E" />
                <stop offset="55%" stopColor="#D44E16" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
            <ellipse cx="285" cy="275" rx="245" ry="185" transform="rotate(-18 285 275)" stroke="url(#cg)" strokeWidth="0.8" opacity="0.50" />
            <ellipse cx="290" cy="270" rx="222" ry="166" transform="rotate(-12 290 270)" stroke="url(#cg)" strokeWidth="0.9" opacity="0.48" />
            <ellipse cx="283" cy="278" rx="200" ry="149" transform="rotate(-6 283 278)" stroke="url(#cg)" strokeWidth="0.9" opacity="0.48" />
            <ellipse cx="287" cy="273" rx="178" ry="132" transform="rotate(0 287 273)" stroke="url(#cg)" strokeWidth="1.0" opacity="0.50" />
            <ellipse cx="281" cy="280" rx="156" ry="116" transform="rotate(6 281 280)" stroke="url(#cg)" strokeWidth="1.0" opacity="0.52" />
            <ellipse cx="286" cy="275" rx="134" ry="100" transform="rotate(12 286 275)" stroke="url(#cg)" strokeWidth="1.1" opacity="0.54" />
            <ellipse cx="290" cy="270" rx="112" ry="84" transform="rotate(20 290 270)" stroke="url(#cg)" strokeWidth="1.2" opacity="0.56" />
            <ellipse cx="283" cy="278" rx="90" ry="68" transform="rotate(27 283 278)" stroke="url(#cg)" strokeWidth="1.2" opacity="0.58" />
            <ellipse cx="287" cy="273" rx="68" ry="52" transform="rotate(33 287 273)" stroke="url(#cg)" strokeWidth="1.3" opacity="0.62" />
            <ellipse cx="285" cy="277" rx="46" ry="36" transform="rotate(40 285 277)" stroke="url(#cg)" strokeWidth="1.4" opacity="0.66" />
            <ellipse cx="286" cy="275" rx="24" ry="19" transform="rotate(45 286 275)" stroke="url(#cg)" strokeWidth="1.5" opacity="0.72" />
            <ellipse cx="360" cy="340" rx="190" ry="138" transform="rotate(22 360 340)" stroke="url(#cg)" strokeWidth="0.7" opacity="0.28" />
            <ellipse cx="365" cy="335" rx="164" ry="118" transform="rotate(30 365 335)" stroke="url(#cg)" strokeWidth="0.8" opacity="0.26" />
            <ellipse cx="358" cy="342" rx="138" ry="100" transform="rotate(37 358 342)" stroke="url(#cg)" strokeWidth="0.9" opacity="0.24" />
            <ellipse cx="362" cy="338" rx="112" ry="82" transform="rotate(44 362 338)" stroke="url(#cg)" strokeWidth="1.0" opacity="0.26" />
            <ellipse cx="360" cy="340" rx="86" ry="64" transform="rotate(50 360 340)" stroke="url(#cg)" strokeWidth="1.1" opacity="0.28" />
            <ellipse cx="361" cy="339" rx="60" ry="46" transform="rotate(56 361 339)" stroke="url(#cg)" strokeWidth="1.2" opacity="0.30" />
          </svg>
        </div>
      </div>

      <div className="hero-scroll">
        <span>Scroll</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}
