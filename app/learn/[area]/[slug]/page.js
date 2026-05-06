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
    title: `${article.title} — The Free Producer Compass`,
    description: article.body[0],
    openGraph: {
      title: article.title,
      description: article.body[0],
    },
  };
}

function SkoolPlug() {
  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-6 py-5 mb-10">
      <p className="text-sm text-zinc-500 uppercase tracking-wider font-medium mb-1">
        Free Community
      </p>
      <p className="text-base font-semibold text-zinc-800 mb-2">
        Join The Free Producer on Skool
      </p>
      <p className="text-sm text-zinc-600 mb-4">
        A community of producers working to get their music out of their hard drives
        and into the world. Free to join.
      </p>
      <a
        href="https://www.skool.com/the-free-producer"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-zinc-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-zinc-700 transition-colors"
      >
        Join the community →
      </a>
    </div>
  );
}

function CoachingPlug() {
  return (
    <div className="bg-zinc-900 text-white rounded-xl px-6 py-6 mt-10">
      <p className="text-sm text-zinc-400 uppercase tracking-wider font-medium mb-1">
        Accountability & Mentorship
      </p>
      <p className="text-xl font-semibold mb-3">
        Work through this one-on-one.
      </p>
      <p className="text-zinc-300 text-sm mb-5">
        If you recognized yourself in what you just read, that&apos;s useful information.
        A&M is one month of structured work — a diagnostic, exploratory calls, and one
        concrete thing you prove to yourself before the month is out.
      </p>
      <Link
        href="/am"
        className="inline-block bg-white text-zinc-900 text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-zinc-100 transition-colors"
      >
        Learn about A&M →
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
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-5 py-12">

        {/* Breadcrumb */}
        <p className="text-xs text-zinc-400 uppercase tracking-widest mb-8">
          The Compass Skill Tree &mdash; {areaLabel}
        </p>

        {/* Skool plug — top */}
        <SkoolPlug />

        {/* Article */}
        <article>
          <h1 className="text-3xl font-bold text-zinc-900 mb-8 leading-snug">
            {article.title}
          </h1>

          <div className="space-y-5">
            {article.body.map((para, i) => (
              <p key={i} className="text-zinc-700 leading-relaxed text-[1.05rem]">
                {para}
              </p>
            ))}
          </div>
        </article>

        {/* Coaching plug — bottom */}
        <CoachingPlug />

        {/* Next button */}
        <div className="mt-10 flex justify-end">
          {next ? (
            <Link
              href={`/learn/${next.area}/${next.slug}`}
              className="inline-flex items-center gap-2 bg-zinc-900 text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Next
              <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <Link
              href="/am"
              className="inline-flex items-center gap-2 bg-zinc-900 text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              See A&M
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>

      </div>

      <DevPanel />
    </div>
  );
}
