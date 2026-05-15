import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticle, getNextArticle, AREA_ORDER, SLUG_ORDER, articles } from "@/lib/articles";
import DevPanel from "@/app/components/DevPanel";

const SLUG_LABELS = {
  "what-is":    "Why It Matters",
  "low-score":  "Low Score",
  "high-score": "High Score",
};

const BREADCRUMB_ORDER = ["what-is", "low-score", "high-score"];

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
      padding: '24px 20px', textAlign: 'center',
    }}>
      <p style={{ color: '#bbb', fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}>
        If things feel like they&apos;re moving well in your music production, keep doing what
        you&apos;re doing.<br />
        If you get the sense at all that something is stagnant, that&apos;s a sign we can help.
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
        <div style={{ marginBottom: 36, fontSize: 12 }}>
          <span style={{
            fontFamily: 'var(--font-montserrat), sans-serif',
            fontSize: 10, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.14em', color: '#555',
          }}>
            {areaLabel}
          </span>
          <span style={{ margin: '0 6px', color: '#2a2a2a' }}>·</span>
          {BREADCRUMB_ORDER.map((s, i) => (
            <span key={s}>
              {i > 0 && <span style={{ color: '#2a2a2a', margin: '0 5px' }}>›</span>}
              {s === slug ? (
                <span style={{ color: '#F0C400', fontWeight: 600 }}>{SLUG_LABELS[s]}</span>
              ) : (
                <Link
                  href={`/${area}/${s}`}
                  style={{ color: '#444', textDecoration: 'none' }}
                >
                  {SLUG_LABELS[s]}
                </Link>
              )}
            </span>
          ))}
        </div>

        {/* Article */}
        <article style={{ marginBottom: 32 }}>
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

        {/* Next — directly after article */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 56 }}>
          <Link
            href={`/${next.area}/${next.slug}`}
            style={{
              background: '#F0C400', color: '#000',
              fontSize: 13, fontWeight: 700, padding: '12px 28px',
              borderRadius: 50, textDecoration: 'none', letterSpacing: '0.06em',
            }}
          >
            Next →
          </Link>
        </div>

        {/* Win Track plug — bottom */}
        <CoachingPlug />

      </div>
      <DevPanel />
    </div>
  );
}
