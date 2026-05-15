import Link from "next/link";
import { articles } from "@/lib/articles";

const ROWS = [
  ["ideation", "composition", "music-theory"],
  ["daw-proficiency", "mixing", "mastering"],
  ["collaboration", "artwork-content", "release-process", "promo"],
];

export default function Home() {
  return (
    <>
      <style>{`
        .area-btn:hover { transform: scale(1.03); box-shadow: 0 0 32px #F0C40045; }
      `}</style>

      <div style={{ minHeight: '100dvh', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column' }}>

        <div style={{ maxWidth: 580, margin: '0 auto', width: '100%', padding: '56px 24px 56px' }}>

          {/* Heading */}
          <h1 style={{
            fontFamily: 'var(--font-libre), Georgia, serif',
            fontSize: 'clamp(26px, 5.5vw, 50px)',
            fontWeight: 400, lineHeight: 1.15,
            textAlign: 'center', marginBottom: 40,
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

          {/* Blurb */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 16,
            marginBottom: 48, color: '#e8e8e8', fontSize: 14,
            lineHeight: 1.75, textAlign: 'center',
          }}>
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
              Tap a button to learn more about how we approach each area.
            </p>
          </div>

          {/* Area buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ROWS.map((row, ri) => (
              <div key={ri} style={{ display: 'flex', gap: 10 }}>
                {row.map((slug) => (
                  <Link
                    key={slug}
                    href={`/learn/${slug}/what-is`}
                    className="area-btn"
                    style={{
                      flex: 1, display: 'block', textAlign: 'center',
                      background: '#F0C400', color: '#000',
                      fontSize: 13, fontWeight: 700, padding: '13px 6px',
                      borderRadius: 50, letterSpacing: '0.06em',
                      textDecoration: 'none',
                      transition: 'transform 0.15s, box-shadow 0.15s',
                      boxShadow: '0 0 20px #F0C40018',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {articles[slug]?.label ?? slug}
                  </Link>
                ))}
              </div>
            ))}
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
