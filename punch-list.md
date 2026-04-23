# Skill Tree + Agent — Punch List

Last updated: 2026-04-20

---

## Active (needs decision or approval before build)

- **Question cuts** — 20 proposed cuts reviewed with Zach (strikethrough list); awaiting per-area approval to implement. Cuts 70 → 50 questions (5 per area).
- **6 swap questions** — flagged for replacement copy; no replacement provided yet. Zach to supply:
  - Ideation Q2 ("Have you started a new song idea in the last 30 days that you chose not to develop further?")
  - Ideation Q4 ("I have a running log of new music I've discovered.")
  - Ideation Q6 ("I have created something recently with no intention of finishing it.")
  - Composition Q5 ("I can describe how my most recent track is designed to feel different at the end than it does at the beginning.")
  - Mastering Q1 ("I can look at a waveform and have an opinion on whether it needs mastering.")
  - Release Q3 ("My releases include correct metadata: artist name, title, genre, and ISRC code.")

---

## Build Queue (ready to implement)

- **Breathing animation** — active skill tree nodes pulse gently brighter/dimmer on loop (~3–4s cycle)
- **Power curve scaling** — apply exponent ~1.5–1.8 to score → visual mapping so high scores pop outward, low scores cluster toward center
- **Whisper modals** — post-score conditional popup after each area's countup animation completes
  - Low score (< 5/10): copy written → `dev/copy/area-whispers.md`
  - High score (≥ 8/10): copy NOT yet written (see Copy below)
- **Pre-area intro modals** — one blurb shown once before each area's questions begin (explains what "Ideation" means, etc.)
  - Copy NOT yet written (see Copy below)
- **Node bloom by ring depth** — outer nodes more vivid/glowing; was in v1, removed in rebuild. CSS or SVG filter, intensity scales with ring index.
- **Spoke fill timing fix** — first spoke should animate on first Yes answer, not at area completion
- **Submit button deduplication** — disable after successful click, re-enable on error only
- **Results screen copy fix** — remove "check your inbox for PDF" → replace with "We sent your results to [email]"
- **Reveal screen CTA** — single primary CTA (Compass call via dynamic Tally URL); Skool link as secondary social proof only; remove extra links
- **OG/social meta tags** — `og:title`, `og:description`, `og:image` — needed before LinkedIn push

---

## Copy Needed

- **area-whispers HIGH score variants** — 10 lines, one per area (≥ 8/10 trigger); low-score variants already done
- **area-intros.md** — 10 blurbs, one per area, explaining what each Compass area covers before questions begin
- **MailerLite email sequence** (3 emails):
  - Email 1 (immediate): intro + personalized insight using {{strongest}} / {{weakest}} merge fields + Tally link
  - Email 2: what low [weakest area] score actually means for their career
  - Email 3: direct Compass coaching invite
- **About page** — the-free-producer.com/about: who it's for, what the 10 areas mean, what Compass offers, CTA

---

## Post-Launch (not blocking)

- SFX — node hover tick, fill ping, area complete chime, full tree completion sound
- Framer Motion — answer card stagger + tap feedback
- Tally secondary survey (superseded by agent for now; revisit if call volume warrants a qualification gate)
- Producer archetypes — needs 20–30 submissions of data before naming clusters
- PDF generation — upgrade from email link to real PDF after POC
