# Compass Skill Tree — Changes Tracker

Current build: `compass-skill-tree7/index.html` (production: RemQuest repo)
Last updated: 2026-04-06

---

## Feedback From Community (2026-04-11 Skool Soft Launch Post)

**Steve Kelly:**
> "Some of the questions I knew the answer to, but I wouldn't say I'm actually good at those specific things (mastering for example). I probably wouldn't have given myself a 10 on Collab, or a 9 on mastering, but you guys made the criteria, not me."

**Rich Rath** (retired uni professor, 30 years research/teaching):
> "My lowest score — tied with promo and art — was for ideation. I have ideas for days. They often don't fit in a conceive/compose/record/mix cycle though, and I am wondering if there is a presumption that ideation follows a particular structure or process? Can you clarify what you mean by ideation? [...] For visuals like this to be genuinely useful, they have to let you drill down to the specific, for example a return to one's questions and answers. As it is, I don't know what any of the dots are so the visualization is not helpful in itself."

**Dennis Krugmann:**
> "Maybe add a back button if someone has chosen a wrong answer accidentally. But well done. I like it!"

### High Priority (Community)
- [ ] **Individual answer drill-down** (Rich — critical, echoes Gio) — "I don't know what any of the dots are so the visualization is not helpful in itself." Users need to be able to return to their specific questions and answers to make sense of scores.
- [ ] **Ideation definition/calibration** (Rich) — Rich scores high on raw idea generation but low on the survey. His ideas don't fit a linear produce cycle. Questions may be presupposing a "conceive/compose/record/mix" structure. Need either: (a) an in-app definition of what "ideation" means in the FP context, or (b) recalibrated questions that capture idea generation broadly, not just structured project-start behaviors.
- [ ] **Scoring calibration — knowledge vs. practice gap** (Steve) — Questions can be passed by someone who knows the right answers but doesn't actually do them. Steve correctly identifies he knows mastering theory but wouldn't say he's good at it. Inverted questions help but may not be enough. Consider questions framed around recent behavior, not knowledge.

### Already Done (confirm UX makes it visible)
- [x] **Back button** (Dennis) — Already built in v7 with per-question undo history. May not be discoverable — check if affordance is clear enough (button label, placement).

---

## Feedback From Calls (2026-04-09 Ansh, 2026-04-10 Gio)

### High Priority
- [ ] **Individual answer tracking + Google Sheets logging** (Gio + Rich — critical) — Currently only scores visible. Two different 5/7s carry totally different meaning. Implement: one row per submission in Google Sheets with all 70 yes/no values + 10 scores. Routing: Vercel function already handles submission — add Sheets API append call there. Schema: `timestamp | name | email | [q1..q70 as 0/1] | [10 area scores] | strongest | weakest`. This is also the data layer the Compass Agent will eventually need.
- [ ] **Mixing/Mastering question wording — "tool" vs "effects"** — Ansh answered "my ears" to "I know what the single most important tool in mixing is" — technically correct but not what the question is testing. Fix: differentiate the two concepts explicitly. Option A: reword to "...single most important *effect* in mixing is" (EQ). Option B: keep "tool" question for ears/critical listening as a separate concept, and make the 3-effects question the calibration point. Currently these two questions blur together and confuse respondents.
- [ ] **Music theory wording fix** (Gio + Ansh both noted) — "I believe music theory is there to tell me what I should and shouldn't do" → "...what I'm allowed and not allowed to do in my music"

### Medium Priority
- [ ] **DAW section — workflow/org questions** (Ansh) — Add: "Do you work from a template?" and "Are your plugins organized?" as additional calibration signals. Fits naturally in DAW Proficiency area.

### Low Priority / Longer Term
- [ ] **Question randomization** (Ansh) — Show a randomized subset each run so repeat users see different questions. Requires more questions in the bank first (currently 70 across 10 areas).
- [ ] **Some questions could benefit from spectrum** (Gio) — Acknowledge the UX trade-off (streamlined yes/no is a feature) but flag a handful of nuanced theory questions where multiple choice would add clarity. Not urgent — revisit post-POC.
- [ ] **Ideation scoring** (Gio + Skyler) — Both scored lower on Ideation than expected. With only 7 questions/area, a single no carries heavy weight. Flag for question review or adjust calibration.
- [ ] **Level difficulty scaling** (Ansh) — More wins required per level as you progress; difficulty should curve upward.

---

## Changes Made

### v7 (2026-04-05) — built from v6
- [x] Vercel serverless function at `docs/api/skill-tree-subscribe.js` — replaces Cloudflare Worker
- [x] MailerLite integration — scores stored as custom fields (composition, theory, daw, etc.), strongest/weakest derived server-side
- [x] Score fix — `scores.map(toTen)` sent to API instead of raw 0–28 values
- [x] Email validation — inline error, can't submit blank
- [x] `lsClear()` called on successful submit — revisiting the page starts fresh
- [x] Error state on failed submission — try/catch with inline error message, does not navigate to reveal on failure
- [x] Submit button disabled during in-flight request (`submitting` state)
- [x] Dev gate always shown — Start → title screen (not name screen); Skip to results → dummy scores → results
- [x] Dev gate: "Skip to results" button added for rapid testing
- [x] V3 binary Yes/No questions — all 70 replaced; 7-category sequence per area; scoring [0,7]→[1,10]
- [x] PDF download — captures reveal screen, saves as `[name]-skill-tree.pdf`
- [x] Black PDF background fix, 32px margin, washed-out color fix

### v6 (2026-04-04 → 2026-04-05) — built from v5 base
- [x] Flexbox layout for q-card — fixes Chrome mobile bug (was `position:absolute;bottom:0`)
- [x] Spokes now connect to actual nearest ring-0 node (SPOKE_TARGETS computed at module level)
- [x] Full area labels instead of 3-letter codes (IDN → Ideation, etc.)
- [x] Score remapping: [7,28]→[1,10] — worst answers now land at 1/10, not 3/10
- [x] Back button with per-question answer history undo
- [x] Email validation — can't submit blank; inline error message shown
- [x] Email gate copy updated — now mentions "you'll see your tree on the next screen"
- [x] SURVEY_VB taller `[60,10,480,500]` — more of the active sector is visible
- [x] All 70 top-choice answers rewritten to be more demanding/aspirational
- [x] `height: 100dvh` — handles mobile browser chrome correctly
- [x] LS key changed to `pst_v2` — avoids stale v5 session data
- [x] SURVEY_VB reframed: hub at ~71% down, active sector fills top; `meet` instead of `slice` — fixes PC clipping
- [x] PC layout: survey screen switches to side-by-side (tree left, q-card right sidebar) at ≥800px
- [x] Nodes reduced 17→10 per sector (1-2-3-4 ring layout); jitter reduced; `separateNodes` repulsion pass
- [x] Spokes fixed: perpendicular to hub, end at exact radial point on ring 0
- [x] First ring-0 node pinned to spoke end (no jitter)
- [x] Conduit edges: pre-determined non-crossing wiring patterns; 6 unique combinations across 10 sectors
- [x] Score bar width fixed: now uses `toTen` scale so 1/10 = 10% bar
- [x] Title screen: scrolling marquee replaces pill rows; width-matched to h1 via useRef; fade edges via mask-image
- [x] "SKILL TREE" — non-italic, all caps, letter-spacing 0.18em
- [x] "your music production" — smaller sub-size (0.61em) to visually balance with "SKILL TREE"
- [x] Copyright: two lines on mobile, one line on PC (media query + ::after separator)

### v5 and earlier (Skyler builds)
- [x] Per-area color theming (10 distinct colors)
- [x] Slider UI (4-dot: "Not me" / "Kind of" / "Mostly" / "That's me") with flavor text
- [x] Conduit edges between nodes with `conduit-flow` CSS animation
- [x] Active area rotates to 12 o'clock via Anime.js
- [x] ViewBox animation: zooms from full constellation to active sector during survey
- [x] tsParticles burst on area completion (per-area color)
- [x] Sequential results animation: bar fills then score counts up, one area at a time
- [x] localStorage persistence
- [x] Dev gate screen (resume/reset when saved state detected)
- [x] Libre Baskerville + Montserrat fonts
- [x] Reveal screen with connect links (Skool, LinkedIn)

---

## This Week — Skool Soft Launch Punch List

### Dev (code changes)

- [ ] **Pre-area intro modals** — brief blurb before each area's questions begin, describing what that area covers in the FP framework
  - Unintrusive — one or two sentences max; dismissable on tap/click
  - Fires once per area on first question load (not on every question)
  - Helps users like Rich understand what "Ideation" means before answering
  - Copy needed: one blurb × 10 areas → `dev/copy/area-intros.md`

- [ ] **Post-score conditional modals** — modal after each area score is revealed
  - **Low score (< 5/10):** hint at what FP+ mentoring would do to help in that area — specific and actionable, not generic encouragement. Copy in `dev/copy/area-whispers.md`
  - **High score (≥ 8/10):** brief recognition — acknowledge the strength, maybe note what it means for their music. Not just "great job."
  - Dismissable; fires after score countup animation completes
  - Copy needed: low + high variant × 10 areas → `dev/copy/area-whispers.md`

- [ ] **Results screen copy** — remove "check your inbox for a PDF" (nothing delivers it)
  - Replace with: "We sent your results to [email]"

- [ ] **Reveal screen CTA** — currently 5+ links; reduce to single primary
  - Primary: "Apply for a Compass call" → opens dynamic Tally URL
  - Skool link as secondary social proof only ("200+ producers")
  - No self-serve Calendly

- [ ] **Submit button deduplication** — disable after first successful click, re-enable on error only
  - Already has `submitting` state — extend to cover post-success

- [ ] **Dev gate UI** — change "Dev Mode" label to proper welcome-back screen before Skool sees it
  - "Welcome back, [name] — pick up where you left off?"

### No code needed

- [ ] **Data capture — results logging** — every submission writes a row to Google Sheets (via Sheets API from Vercel function)
  - Row schema: `timestamp | name | email | composition | theory | daw | mixing | mastering | collab | artwork | release | ideation | promo | strongest | weakest`
  - All scores as 1–10 integers; strongest/weakest as area name strings
  - MailerLite custom fields export is lightweight alternative if Sheets is too much overhead at POC scale

- [ ] **MailerLite welcome automation** — trigger: subscriber added to Compass Skill Tree group
  - Email 1 (immediate): intro + personalized insight using {{strongest}} and {{weakest}} merge fields + Tally link; draft in session notes (2026-04-06)
  - Email 2: value / what low [weakest area] actually means for their career
  - Email 3: direct invite — Compass mentoring offer
  - Test deliverability before Skool launch

- [ ] **Questions audit** — Zach reviews all 70 V3 binary questions, flags any rewording needed
  - Source of truth: `dev/copy/questions-v3-binary.md`

### Funnel — next build priorities

- [ ] **Tally secondary survey** — qualification gate between reveal and call booking
  - Build form in Tally (free): social links, genre, primary goal, blocker (open field), seriousness signal
  - Lift `email` state to App level; pass to RevealScreen
  - Build dynamic Tally URL with hidden fields: name, email, all 10 scores, strongest, weakest
  - Completed responses = warm leads; no response = stays in drip only
  - Zach/Skyler review Tally responses + social presence before reaching out personally (no self-booking)

### Content — needed before launch

- [ ] **Producer archetypes** — deferred until after POC data collection
  - After ~20–30 submissions: export MailerLite data, look for natural score clusters, name what you actually see
  - Reveal screen currently shows "Strongest: X · Opportunity: Y" — sufficient for POC

---

## the-free-producer.com Setup

- [ ] Point domain DNS to Vercel
- [ ] Build landing page (/) — Skill Tree as hero/entry point
- [ ] Build about page — "What is The Free Producer and what is Compass"
  - Who it's for, what the 10 Compass areas mean, what FP+ offers, CTA back to Skill Tree or Skool
- [ ] Update vercel.json routing
- [ ] Update social bios from remember.quest → the-free-producer.com once live

---

## Changes to Make — Post Skool POC

### Polish / Pre-Public

- [ ] **OG/social tags** — needed before LinkedIn push, not Skool
  - `og:title`, `og:description`, `og:image` (completed skill tree screenshot)

- [ ] **URL update** — `/compass-skill-tree7` → `/compass-skill-tree` just before public launch
  - Keep version folder, just update the public-facing path

- [ ] **Hide dev gate** — just before public launch

### UI — This Week

- [ ] **Node bloom/vividness by ring depth** — nodes farther from center should be more vivid and have a bloom effect (was in v1, removed during rebuild). Implement: CSS filter or SVG filter (`feGaussianBlur` + `feComposite` for bloom); scale intensity by ring index (ring 0 = subtle, ring 3 = full bloom). Produces a sense of depth — the outer nodes feel like "higher achievement."
- [ ] **Central spoke fill timing** — the spoke connecting the hub to the first node of each area currently doesn't fill until the area is completed. It should animate fill at the same time the first node lights up (i.e., on first Yes answer in the area, or when the area activates).

### Post-Launch Polish (not blocking)

- [ ] SFX — node hover tick, fill ping, area complete chime, full tree completion sound
- [ ] Framer Motion — answer card stagger + tap feedback (not loaded yet)
- [ ] Name screen friction — consider first name only, or defer name ask until after Q1-3
- [ ] PDF generation — upgrade from HTML email to real PDF after POC; see `dev/copy/pdf-email.md` for options
- [ ] Google Sheets data logging — MailerLite sufficient for Skool batch; add Sheets append if SQL queries needed post-POC
