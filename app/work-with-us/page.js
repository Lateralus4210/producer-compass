"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const OPTIONS = {
  projectsStarted: ["1–10", "11–50", "51–100", "100+"],
  projectsReleased: ["0", "1–10", "11–30", "31+"],
  yearsProducing: ["Less than a year", "1–3 years", "3–7 years", "7+ years"],
};

function OptionGrid({ field, options, value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(field, opt)}
          className={`text-sm px-4 py-3 rounded-lg border transition-colors ${
            value === opt
              ? "border-yellow-400 bg-yellow-400 text-black font-semibold"
              : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function WorkWithUs() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    projectsStarted: "",
    projectsReleased: "",
    yearsProducing: "",
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const step0Valid = form.name.trim().length > 0 && form.email.includes("@");
  const step1Valid = form.projectsStarted && form.projectsReleased && form.yearsProducing;

  async function submit() {
    setSubmitting(true);
    try {
      await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch (e) {
      console.error("Apply error:", e);
    }
    router.push("/assess");
  }

  if (submitting) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400 text-sm">Setting up your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-5 py-16">

        {step === 0 && (
          <>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-6">
              Compass for Music Producers
            </p>
            <h1 className="text-3xl font-bold mb-4 leading-snug">
              Win Track by Compass
            </h1>
            <p className="text-zinc-400 text-base leading-relaxed mb-8">
              If anything in your music production feels stagnant — something you haven&apos;t been
              able to move — this is where to start. We&apos;ll figure out what that is together.
            </p>

            <div className="border border-zinc-800 rounded-xl px-6 py-5 mb-10">
              <div className="flex items-baseline gap-2 mb-5">
                <span className="text-2xl font-bold text-white">$250</span>
                <span className="text-zinc-500 text-sm">/ month</span>
              </div>
              <ul className="space-y-3">
                {[
                  "3 hour-long strategy development sessions",
                  "Session recordings to revisit on your own time",
                  "Collaborative journal — a living paper trail of your thoughts and progress",
                  "Free access to the 200+ member community",
                  "Zoom calls with advanced professional music producers",
                  "Consistent accountability check-ins",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-zinc-300">
                    <span className="text-yellow-400 mt-0.5 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">First name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-600 placeholder-zinc-600"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-600 placeholder-zinc-600"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              disabled={!step0Valid}
              className="w-full font-semibold py-3 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#FFD700", color: "#000" }}
            >
              Continue →
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-6">
              Step 2 of 2
            </p>
            <h2 className="text-2xl font-bold mb-3">
              A few quick questions.
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-10">
              These help us understand where you are before you take the Compass Skill Tree assessment.
            </p>

            <div className="space-y-8 mb-10">
              <div>
                <p className="text-sm text-zinc-300 mb-3">
                  How many tracks have you started?
                </p>
                <OptionGrid
                  field="projectsStarted"
                  options={OPTIONS.projectsStarted}
                  value={form.projectsStarted}
                  onChange={update}
                />
              </div>

              <div>
                <p className="text-sm text-zinc-300 mb-3">
                  How many have you released publicly?
                </p>
                <OptionGrid
                  field="projectsReleased"
                  options={OPTIONS.projectsReleased}
                  value={form.projectsReleased}
                  onChange={update}
                />
              </div>

              <div>
                <p className="text-sm text-zinc-300 mb-3">
                  How long have you been producing?
                </p>
                <OptionGrid
                  field="yearsProducing"
                  options={OPTIONS.yearsProducing}
                  value={form.yearsProducing}
                  onChange={update}
                />
              </div>
            </div>

            <button
              onClick={submit}
              disabled={!step1Valid}
              className="w-full font-semibold py-3 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#FFD700", color: "#000" }}
            >
              Start assessment →
            </button>
          </>
        )}

      </div>
    </div>
  );
}
