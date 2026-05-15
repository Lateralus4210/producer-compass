import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticle, getNextArticle, AREA_ORDER, SLUG_ORDER, articles } from "@/lib/articles";
import DevPanel from "@/app/components/DevPanel";

const PILL_ROWS = [
  ["ideation", "composition", "music-theory"],
  ["daw-proficiency", "mixing", "mastering"],
  ["collaboration", "artwork-content", "release-process", "promo"],
];

export async function generateStaticParams() {
  const params = [];
  for (const area of AREA_ORDER) {
    for (const slug of SLUG_ORDER) {
      params.push({ area, slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }) {
  const { area, slug } = await params;
  const article = getArticle(area, slug);
  if (!article) return {};
  return {
    title: `${article.title} — Compass for Music Producers`,
    description: article.body[0],
    openGraph: {
      title: article.title,
      description: article.body[0],
    },
  };
}

function CoachingPlug() {
  return (
    <div style={{
      border: '1px solid #1a1a1a', borderRadius: 16,
      padding: '24px 20px', marginBottom: 32, textAlign: 'center',
    }}>
      <p style={{ color: '#bbb', fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}>
        If things feel like they&apos;re moving well in your music production, keep doing what
        you&apos;re doing. If you get the sense that something is stagnant at all, that&apos;s
        a sign that we can help out.
      </p>
      <Link
        href="/work-with-us"
        style={{
          display: 'inline-block', background: '#F0C400', color: '#000',
          fontSize: 13, fontWeight: 700, padding: '11px 28px',
          borderRadius: 50, textDecoration: 'none', letterSpacing: '0.06em',
        }}
      >
        Work with us →
      </Link>
    </div>
  );
}

export default async function ArticlePage({ params }) {
  const { area, slug } = await params;

  const article = getArticle(area, slug);
  if (!article) notFound();

  const areaLabel = articles[area]?.label ?? area;
  const next = getNextArticle(area, slug);

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff' }}>
      <div style={{ maxWidth: 580, margin: '0 auto', padding: '48px 24px 56px', textAlign: 'center' }}>

        {/* Breadcrumb */}
        <p style={{
          fontSize: 11, color: '#555',
          textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 24,
        }}>
          The Compass Skill Tree: {areaLabel}
        </p>

        {/* Area picker — top */}
        <div style={{ marginBottom: 40 }}>
          {PILL_ROWS.map((row, ri) => (
            <div key={ri} style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 6 }}>
              {row.map((a) => (
                <Link
                  key={a}
                  href={`/learn/${a}/low-score`}
                  style={{
                    width: 88,
                    flexShrink: 0,
                    display: 'block',
                    textAlign: 'center',
                    background: a === area ? '#F0C400' : '#111',
                    color: a === area ? '#000' : '#555',
                    border: a === area ? 'none' : '1px solid #222',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '8px 3px',
                    borderRadius: 50,
                    letterSpacing: '0.05em',
                    textDecoration: 'none',
                  }}
                >
                  {articles[a]?.label ?? a}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Article */}
        <article style={{ marginBottom: 48 }}>
          <h1 style={{
            fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 700,
            color: '#FFD700', marginBottom: 28, lineHeight: 1.2,
          }}>
            {article.title}
          </h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {article.body.map((para, i) => (
              <p key={i} style={{ color: '#aaa', lineHeight: 1.78, fontSize: 16 }}>
                {para}
              </p>
            ))}
          </div>
        </article>

        {/* Win Track plug — bottom */}
        <CoachingPlug />

        {/* Next */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {next ? (
            <Link
              href={`/learn/${next.area}/${next.slug}`}
              style={{
                background: '#F0C400', color: '#000',
                fontSize: 13, fontWeight: 700, padding: '12px 28px',
                borderRadius: 50, textDecoration: 'none', letterSpacing: '0.06em',
              }}
            >
              Next →
            </Link>
          ) : (
            <Link
              href="/work-with-us"
              style={{
                background: '#F0C400', color: '#000',
                fontSize: 13, fontWeight: 700, padding: '12px 28px',
                borderRadius: 50, textDecoration: 'none', letterSpacing: '0.06em',
              }}
            >
              See Win Track →
            </Link>
          )}
        </div>

      </div>
      <DevPanel />
    </div>
  );
}
