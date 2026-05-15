import Link from "next/link";

export default function Home() {
  return (
    <>
      <style>{`
        .learn-btn:hover { transform: scale(1.03); box-shadow: 0 0 32px #F0C40045; }
      `}</style>

      <div style={{ minHeight: '100dvh', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column' }}>

        <div style={{ maxWidth: 580, margin: '0 auto', width: '100%', padding: '56px 24px 56px' }}>

          {/* Heading with moon+bird image behind */}
          <div style={{ position: 'relative', textAlign: 'center', marginBottom: 40, padding: '24px 0' }}>
            <img
              src="/moon-bird.png"
              alt=""
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 280,
                opacity: 0.5,
                zIndex: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />
            <h1 style={{
              position: 'relative', zIndex: 1,
              fontFamily: 'var(--font-libre), Georgia, serif',
              fontSize: 'clamp(26px, 5.5vw, 50px)',
              fontWeight: 400, lineHeight: 1.15,
              margin: 0,
            }}>
              <span style={{
                fontSize: '0.61em', color: '#fff',
                textShadow: '0 1px 8px #000, 0 0 24px #000',
              }}>Your Music Production</span>
              <br />
              <em style={{
                fontStyle: 'normal', color: '#F0C400',
                fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
                textShadow: '0 2px 12px #000a, 0 0 32px #000',
              }}>
                Compass
              </em>
            </h1>
          </div>

          {/* Blurb */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 16,
            marginBottom: 48, color: '#e8e8e8', fontSize: 16,
            lineHeight: 1.75, textAlign: 'center',
          }}>
            <p>
              Compass for Music Producers is a framework developed by producers Zach Burger (RemEmber) and
              Skyler Newsome (Circles in the Sky).
            </p>
            <p>
              Think about it like a skill tree for music producers.<br />
              Every producer will have a different profile. Finding out what yours looks like reveals which
              areas are your strong suits and which are weak, whether that&apos;s from lack of experience
              or overthinking it.
            </p>
          </div>

          {/* Single CTA */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link
              href="/learn/ideation/low-score"
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
              Learn more
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
