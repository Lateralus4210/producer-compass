import Link from "next/link";
import { AREA_ORDER, articles } from "@/lib/articles";

const AREAS = AREA_ORDER.map(slug => ({
  slug,
  label: articles[slug]?.label ?? slug,
}));

export default function Home() {
  return (
    <>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track { display: flex; flex-shrink: 0; animation: marquee 22s linear infinite; }
        .area-tile:hover { border-color: #444 !important; }
        .btn-ghost:hover { border-color: #444 !important; color: #888 !important; }
      `}</style>

      <div style={{ minHeight: '100dvh', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column' }}>

        {/* Hero — fills the viewport */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', gap: 32, padding: '40px 28px 28px',
        }}>

          <h1 style={{
            fontFamily: 'var(--font-libre), Georgia, serif',
            fontSize: 'clamp(26px, 5.5vw, 50px)',
            fontWeight: 400, lineHeight: 1.15,
          }}>
            <span style={{ fontSize: '0.61em' }}>Your music production</span>
            <br />
            <em style={{
              fontStyle: 'normal', color: '#F0C400',
              fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
            }}>
              Compass
            </em>
          </h1>

          {/* Scrolling marquee */}
          <div style={{
            width: '100%', overflow: 'hidden', display: 'flex',
            WebkitMaskImage: 'linear-gradient(to right, transparent, #000 18%, #000 82%, transparent)',
            maskImage: 'linear-gradient(to right, transparent, #000 18%, #000 82%, transparent)',
          }}>
            <div className="marquee-track">
              {[...AREAS, ...AREAS].map((area, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
                    textTransform: 'uppercase', color: '#444',
                    padding: '0 4px', whiteSpace: 'nowrap',
                  }}>
                    {area.label}
                  </span>
                  <span style={{ fontSize: 11, color: '#2a2a2a', padding: '0 10px' }}>·</span>
                </span>
              ))}
            </div>
          </div>

          <p style={{ color: '#777', fontSize: 14, maxWidth: 320, lineHeight: 1.65 }}>
            Ten areas that together make up the full picture of music production.
            Find where you&apos;re stuck and what to do about it.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: '100%', maxWidth: 280 }}>
            <Link href="/assess" style={{
              display: 'block', width: '100%', textAlign: 'center',
              background: '#F0C400', color: '#000',
              fontSize: 14, fontWeight: 700, padding: '13px 0',
              borderRadius: 50, letterSpacing: '0.07em',
              textDecoration: 'none',
            }}>
              Take the Assessment
            </Link>
            <Link href="/work-with-us" className="btn-ghost" style={{
              display: 'block', width: '100%', textAlign: 'center',
              padding: '11px 0', fontSize: 13, fontWeight: 600,
              border: '1px solid #2a2a2a', borderRadius: 10,
              color: '#555', textDecoration: 'none', transition: 'all 0.15s',
            }}>
              Work with us
            </Link>
          </div>

        </div>

        {/* Ten areas grid */}
        <div style={{ padding: '0 24px 48px', maxWidth: 560, margin: '0 auto', width: '100%' }}>
          <p style={{
            fontFamily: 'var(--font-montserrat), sans-serif',
            fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: '#444',
            textAlign: 'center', marginBottom: 16,
          }}>
            The Ten Areas
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {AREAS.map((area) => (
              <Link
                key={area.slug}
                href={`/learn/${area.slug}/what-is`}
                className="area-tile"
                style={{
                  display: 'block',
                  background: '#0e0e0e', border: '1px solid #282828',
                  borderRadius: 12, padding: '14px 18px',
                  color: '#fff', textDecoration: 'none',
                  fontSize: 13, fontWeight: 600, transition: 'border-color 0.15s',
                }}
              >
                {area.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
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
