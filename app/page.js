import Link from "next/link";

export default function Home() {
  return (
    <>
      <style>{`
        .learn-btn:hover { transform: scale(1.03); box-shadow: 0 0 32px #F0C40045; }
        .moon-bird { display: block; margin: 0 auto 12px; opacity: 0.55; width: 140px; }
        @media (min-width: 640px) { .moon-bird { width: 210px; } }
        .blurb { font-size: 15px; font-family: var(--font-dm-sans), sans-serif; }
        @media (min-width: 640px) { .blurb { font-size: 17px; } }
        .blurb em { font-style: italic; color: #fff; }
        .blurb strong { font-weight: 700; color: #fff; }
      `}</style>

      <div style={{ minHeight: '100dvh', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ maxWidth: 580, margin: '0 auto', width: '100%', padding: '56px 24px 56px' }}>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <p style={{
              fontFamily: 'var(--font-montserrat), sans-serif',
              fontSize: 'clamp(14px, 3vw, 20px)',
              fontWeight: 600, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: '#888',
              marginBottom: 8,
            }}>
              Your Music Production
            </p>
            <p style={{
              fontFamily: 'var(--font-libre), Georgia, serif',
              fontSize: 'clamp(38px, 7vw, 68px)',
              fontWeight: 700, lineHeight: 1, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#F0C400',
            }}>
              Compass
            </p>
          </div>

          {/* Moon + bird — below heading, above copy */}
          <img
            src="/moon-bird.png"
            alt=""
            aria-hidden="true"
            className="moon-bird"
          />

          {/* Blurb */}
          <div className="blurb" style={{
            display: 'flex', flexDirection: 'column', gap: 16,
            marginBottom: 40, color: '#ccc',
            lineHeight: 1.75, textAlign: 'center',
          }}>
            <p>
              <em>Compass for Music Producers</em> is a gamified framework developed by
              producers <span style={{ whiteSpace: 'nowrap' }}>Zach Burger (<em>RemEmber</em>)</span> and{' '}
              <span style={{ whiteSpace: 'nowrap' }}>Skyler Newsome (<em>Circles in the Sky</em>).</span>
            </p>
            <p>
              Think about it like a <strong>skill tree</strong> for <strong>music producers</strong>.
            </p>
            <p>
              Every producer will have a different profile. Seeing your scores in each of the
              10 areas is meant to encourage you in your strong suits, and reveal which area
              needs the most work:<br />what we call your <strong>North Star</strong>.
            </p>
          </div>

          {/* Single CTA */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link
              href="/learn"
              className="learn-btn"
              style={{
                display: 'block', textAlign: 'center',
                background: '#F0C400', color: '#000',
                fontSize: 14, fontWeight: 700, padding: '14px 40px',
                borderRadius: 50, letterSpacing: '0.06em',
                textDecoration: 'none',
                transition: 'transform 0.15s, box-shadow 0.15s',
                boxShadow: '0 0 20px #F0C40018',
              }}
            >
              See more
            </Link>
          </div>

        </div>

        {/* Footer */}
        <div style={{
          marginTop: 'auto',
          fontFamily: 'var(--font-montserrat), sans-serif',
          fontSize: 9, fontWeight: 600, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: '#444',
          textAlign: 'center', paddingBottom: 20,
          display: 'flex', flexDirection: 'column', gap: 3,
        }}>
          <div>© {new Date().getFullYear()} ZMT LLC</div>
          <div>Compass for Music Producers</div>
        </div>
      </div>
    </>
  );
}
