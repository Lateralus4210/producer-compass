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
        .area-btn:hover { transform: scale(1.03); box-shadow: 0 0 32px #F0C40045; }
        .btn-ghost:hover { border-color: #444 !important; color: #888 !important; }
      `}</style>

      <div style={{ minHeight: '100dvh', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column' }}>

        {/* Hero */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', gap: 32, padding: '40px 28px 28px',
        }}>

          <h1 style={{
            fontFamily: 'var(--font-libre), Georgia, serif',
            fontSize: 'clamp(26px, 5.5vw, 50px)',
            fontWeight: 400, lineHeight: 1.15,
          }}>
            <span style={{ fontSize: '0.61em' }}>Your Music Production</span>
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

        </div>

        {/* Body content */}
        <div style={{ maxWidth: 560, margin: '0 auto', width: '100%', padding: '0 24px 56px' }}>

          {/* Blurb */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40, color: '#777', fontSize: 14, lineHeight: 1.75 }}>
            <p>
              Compass for Music Producers is a framework developed by Zach Burger (RemEmber) and
              Skyler Newsome (Circles in the Sky).
            </p>
            <p>
              The way we think about it is a skill tree for music producers. Every producer will
              have a different profile, and by finding out what yours looks like, it reveals what
              areas are your strong suits and which are weak, whether that&apos;s from lack of
              experience or just overthinking it.
            </p>
            <p>
              For each area shown below, we&apos;ve provided a rundown of what that area means to
              us, what a low score looks and feels like, and what a high score looks and feels like.
            </p>
            <p>
              When you&apos;re ready, take the Skill Tree assessment to see what your Skill Tree
              profile might look like.
            </p>
          </div>

          {/* Area buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            {AREAS.map((area) => (
              <Link
                key={area.slug}
                href={`/learn/${area.slug}/what-is`}
                className="area-btn"
                style={{
                  display: 'block', textAlign: 'center',
                  background: '#F0C400', color: '#000',
                  fontSize: 13, fontWeight: 700, padding: '13px 8px',
                  borderRadius: 50, letterSpacing: '0.06em',
                  textDecoration: 'none', transition: 'transform 0.15s, box-shadow 0.15s',
                  boxShadow: '0 0 20px #F0C40018',
                }}
              >
                {area.label}
              </Link>
            ))}
          </div>

          {/* Work with us */}
          <Link href="/work-with-us" className="btn-ghost" style={{
            display: 'block', width: '100%', textAlign: 'center',
            padding: '11px 0', fontSize: 13, fontWeight: 600,
            border: '1px solid #2a2a2a', borderRadius: 10,
            color: '#555', textDecoration: 'none', transition: 'all 0.15s',
            marginTop: 10,
          }}>
            Work with us
          </Link>

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
