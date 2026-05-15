import Link from "next/link";
import { AREA_ORDER, articles } from "@/lib/articles";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-5 py-16">

        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-6">
          Compass for Music Producers
        </p>
        <h1 className="text-3xl font-bold mb-4 leading-snug">
          Ten areas. One framework.
        </h1>
        <p className="text-zinc-400 text-base leading-relaxed mb-12">
          Compass breaks music production into ten areas — from the first spark of an idea
          to getting paid for your music. Use it to figure out where you&apos;re stuck and
          what to do about it.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-14">
          {AREA_ORDER.map((area) => {
            const label = articles[area]?.label ?? area;
            return (
              <Link
                key={area}
                href={`/learn/${area}/what-is`}
                className="block bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 hover:border-zinc-600 hover:bg-zinc-800 transition-colors"
              >
                <p className="font-semibold text-white text-sm">{label}</p>
              </Link>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/assess"
            className="inline-block text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            style={{ backgroundColor: "#FFD700", color: "#000" }}
          >
            Take the assessment →
          </Link>
          <Link
            href="/work-with-us"
            className="inline-block text-sm font-semibold px-5 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 hover:border-zinc-500 transition-colors"
          >
            Work with us
          </Link>
        </div>

      </div>
    </div>
  );
}
