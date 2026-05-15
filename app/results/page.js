"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { AREA_ORDER, articles } from "@/lib/articles";

// Maps AREA_ORDER index → area slug
function getLowestAreas(scores) {
  return AREA_ORDER
    .map((area, i) => ({ area, score: scores[i] ?? 5 }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((x) => x.area);
}

function ResultsContent() {
  const params = useSearchParams();
  const raw = params.get("scores");

  const scores = raw
    ? raw.split(",").map((n) => parseFloat(n)).filter((n) => !isNaN(n))
    : [];

  const hasScores = scores.length === 10;
  const lowestAreas = hasScores ? getLowestAreas(scores) : [];
  const primaryArea = lowestAreas[0];

  if (!hasScores) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-5">
        <div className="max-w-md text-center">
          <p className="text-zinc-500 text-sm mb-4">No scores found.</p>
          <Link href="/" className="text-white underline text-sm">Take the survey →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-xl mx-auto px-5 py-14">

        {/* Header */}
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-6">
          Your Compass Results
        </p>
        <h1 className="text-3xl font-bold mb-3 leading-snug">
          Here&apos;s where to start.
        </h1>
        <p className="text-zinc-400 mb-10 text-base leading-relaxed">
          Based on your answers, these are the areas most worth your attention right now.
          We&apos;ve put together a short reading path for each one.
        </p>

        {/* Score list */}
        <div className="space-y-3 mb-12">
          {lowestAreas.map((area, rank) => {
            const idx = AREA_ORDER.indexOf(area);
            const score = scores[idx];
            const label = articles[area]?.label ?? area;
            const isPrimary = rank === 0;

            return (
              <Link
                key={area}
                href={`/learn/${area}/low-score`}
                className={`block rounded-xl px-5 py-4 transition-colors ${
                  isPrimary
                    ? "bg-white text-black hover:bg-zinc-100"
                    : "bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${isPrimary ? "text-zinc-500" : "text-zinc-500"}`}>
                      #{rank + 1} lowest
                    </p>
                    <p className="font-semibold text-lg">{label}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${isPrimary ? "text-black" : "text-white"}`}>
                      {Math.round(score * 10) / 10}
                    </p>
                    <p className={`text-xs ${isPrimary ? "text-zinc-500" : "text-zinc-600"}`}>/ 10</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Primary CTA */}
        {primaryArea && (
          <div className="mb-10">
            <Link
              href={`/learn/${primaryArea}/low-score`}
              className="block w-full text-center bg-white text-black font-semibold py-4 rounded-xl hover:bg-zinc-100 transition-colors"
            >
              Start with {articles[primaryArea]?.label} →
            </Link>
          </div>
        )}

        {/* Coaching plug */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-5 mb-5">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Compass for Music Producers</p>
          <p className="text-sm text-zinc-400 mb-4">
            If you notice any hesitation about whether things are moving — anything that feels stagnant — Compass was made for you.
          </p>
          <Link
            href="/work-with-us"
            className="inline-block bg-white text-black text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Work with us →
          </Link>
        </div>

        {/* Skool plug */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-5">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Free Community</p>
          <p className="font-semibold mb-2">Join The Free Producer on Skool</p>
          <p className="text-sm text-zinc-400 mb-4">
            A community of producers working to get their music out of their hard drives and into the world.
          </p>
          <a
            href="https://www.skool.com/the-free-producer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-black text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Join free →
          </a>
        </div>

      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense>
      <ResultsContent />
    </Suspense>
  );
}
