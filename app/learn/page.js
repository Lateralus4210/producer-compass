import Link from "next/link";
import { articles, AREA_ORDER } from "@/lib/articles";

export const metadata = {
  title: "Explore — Compass for Music Producers",
};

export default function LearnIndex() {
  return (
    <div style={{ minHeight: '100dvh', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: 400, margin: '0 auto', width: '100%', padding: '56px 24px 56px' }}>

        <p style={{
          fontFamily: 'var(--font-montserrat), sans-serif',
          fontSize: 11, fontWeight: 600, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: '#555',
          textAlign: 'center', marginBottom: 32,
        }}>
          Choose an area
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {AREA_ORDER.map((area) => (
            <Link
              key={area}
              href={`/learn/${area}/what-is`}
              style={{
                display: 'block', textAlign: 'center',
                background: '#F0C400', color: '#000',
                fontSize: 14, fontWeight: 700, padding: '14px 24px',
                borderRadius: 50, textDecoration: 'none',
                letterSpacing: '0.06em',
                transition: 'opacity 0.15s',
              }}
            >
              {articles[area]?.label ?? area}
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
