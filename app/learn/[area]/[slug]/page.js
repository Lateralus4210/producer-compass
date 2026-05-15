import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticle, getNextArticle, AREA_ORDER, SLUG_ORDER, articles } from "@/lib/articles";
import DevPanel from "@/app/components/DevPanel";

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
  const areaLabel = articles[area]?.label ?? area;
  return {
    title: `${article.title} — Compass for Music Producers`,
    description: article.body[0],
    openGraph: {
      title: article.title,
      description: article.body[0],
    },
  };
}

function SkoolPlug() {
  return (
    <div className="border border-zinc-800 rounded-xl px-6 py-5 mb-10">
      <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-1">
        Free Community
      </p>
      <p className="text-base font-semibold text-white mb-2">
        Join The Free Producer on Skool
      </p>
      <p className="text-sm text-zinc-400 mb-4">
        A community of producers working to get their music out of their hard drives
        and into the world. Free to join.
      </p>
      <a
        href="https://www.skool.com/the-free-producer"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        style={{ backgroundColor: "#FFD700", color: "#000" }}
      >
        Join the community →
      </a>
    </div>
  );
}

function CoachingPlug() {
  return (
    <div className="border border-zinc-800 rounded-xl px-6 py-6 mb-10">
      <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-1">
        Win Track by Compass — $250/month
      </p>
      <p className="text-zinc-300 text-sm leading-relaxed mb-5">
        If you feel everything is moving smoothly with your music production journey, Compass
        isn&apos;t for you. But if you notice any hesitation answering that question — anything
        that feels stagnant — Compass was made for you. Compass is here to figure out what that
        is, figure out what&apos;s keeping it from moving, then support your growth so things
        start moving again.
      </p>
      <Link
        href="/work-with-us"
        className="inline-block text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        style={{ backgroundColor: "#FFD700", color: "#000" }}
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
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-5 py-12">

        {/* Breadcrumb */}
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-8">
          The Compass Skill Tree &mdash; {areaLabel}
        </p>

        {/* Coaching plug — top */}
        <CoachingPlug />

        {/* Article */}
        <article>
          <h1 className="text-3xl font-bold mb-8 leading-snug" style={{ color: "#FFD700" }}>
            {article.title}
          </h1>

          <div className="space-y-5">
            {article.body.map((para, i) => (
              <p key={i} className="text-zinc-300 leading-relaxed text-[1.05rem]">
                {para}
              </p>
            ))}
          </div>
        </article>

        {/* Skool plug — bottom */}
        <SkoolPlug />

        {/* Next button */}
        <div className="mt-10 flex justify-end">
          {next ? (
            <Link
              href={`/learn/${next.area}/${next.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
              style={{ backgroundColor: "#FFD700", color: "#000" }}
            >
              Next
              <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <Link
              href="/work-with-us"
              className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
              style={{ backgroundColor: "#FFD700", color: "#000" }}
            >
              See Win Track
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>

      </div>

      <DevPanel />
    </div>
  );
}
