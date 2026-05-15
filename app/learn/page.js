import Link from "next/link";
import { articles, AREA_ORDER } from "@/lib/articles";

export const metadata = {
  title: "Explore — Compass for Music Producers",
};

export default function LearnIndex() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .area-pill {
          opacity: 0;
          animation: fadeUp 0.35s ease forwards;
        }
        .area-pill:hover { opacity: 0.85; }
      `}</style>

      <div style={{ minHeight: '100dvh', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ maxWidth: 340, margin: '0 auto', width: '100%', padding: '56px 24px 56px' }}>

          <p style={{
            fontFamily: 'var(--font-montserrat), sans-serif',
            fontSize: 11, fontWeight: 600, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: '#555',
            textAlign: 'center', marginBottom: 36,
          }}>
            Choose an area
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {AREA_ORDER.map((area, i) => (
              <Link
                key={area}
                href={`/${area}/what-is`}
                className="area-pill"
                style={{
                  display: 'block', textAlign: 'center',
                  background: '#F0C400', color: '#000',
                  fontSize: 14, fontWeight: 700, padding: '11px 24px',
                  borderRadius: 50, textDecoration: 'none',
                  letterSpacing: '0.06em',
                  animationDelay: `${i * 0.07}s`,
                }}
              >
                {articles[area]?.label ?? area}
              </Link>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
