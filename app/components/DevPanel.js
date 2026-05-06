"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AREA_ORDER, articles } from "@/lib/articles";

export default function DevPanel() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const go = (area, slug) => {
    setOpen(false);
    router.push(`/learn/${area}/${slug}`);
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-50 bg-zinc-800 text-zinc-400 text-xs px-3 py-1.5 rounded-full hover:bg-zinc-700 hover:text-white transition-colors"
        aria-label="Toggle dev panel"
      >
        dev
      </button>

      {/* Panel overlay */}
      {open && (
        <div className="fixed inset-0 z-40 flex items-end justify-end pointer-events-none">
          <div
            className="m-4 mb-12 w-72 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl pointer-events-auto overflow-y-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-zinc-700">
              <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Dev — Jump to area
              </p>
            </div>
            <div className="p-3 space-y-1">
              {AREA_ORDER.map((area) => (
                <div key={area}>
                  <p className="text-xs text-zinc-300 px-2 pt-2 pb-1 font-medium">
                    {articles[area].label}
                  </p>
                  <div className="flex gap-1 flex-wrap pl-2">
                    {["low-score", "high-score", "what-is"].map((slug) => (
                      <button
                        key={slug}
                        onClick={() => go(area, slug)}
                        className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-2 py-1 rounded transition-colors"
                      >
                        {slug}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
