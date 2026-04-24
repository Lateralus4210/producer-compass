# Skill Tree + Agent — Punch List

Last updated: 2026-04-24

---

## Rebrand — Compass for Music Producers (from 2026-04-24 bizdev)

Decisions and tasks flowing from the rebrand to Compass. The "Free Producer" name creates friction at the point of sale; "Compass" removes the explanation tax.

- **Lock the name** — Front-runners: "Compass for Music Producers" vs. "Compass Music" vs. "Producer Compass." Decision needed before any assets are updated. (Zach to decide)
- **Site title + branding** — Update skill tree title screen copy, meta tags, and any "The Free Producer" references throughout the app to reflect the new brand name once locked
- **Compass Clients language** — Agent copy and any paid-tier references should use "Compass Clients" (not FP+) once the Skool rename is done
- **YouTube account decision** — Buffer needs a dedicated Compass YouTube channel to schedule video content. Decide: create new Compass Google/YouTube account, or disconnect Zach's personal account from Buffer? (Zach to decide)

### Skyler's tasks (from bizdev — tracked here for visibility)
- Skool: rename "FP+" category → "Compass Clients"; delete "Free Mix" (announce sunset + reroute posts to Lounge first); add up to 11 keywords per category; add "Guest Interviews/Speakers" category
- Skool group name change: "Compass for Music Producers" — $99 fee, do after name is locked
- Create shared Canva account under new Compass business email
- Build 6 carousel series (Producer Truths, You Don't Need That, Quick Mix Tips, Things Nobody Tells You, Compass Clients Awareness, TBD); schedule via Buffer
- Send Zach TikTok login so account can be connected to Buffer

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

- **Whisper modals** — post-score conditional popup after each area's countup animation completes
  - Low score (< 5/10): copy written → `copy/area-whispers.md`
  - High score (≥ 8/10): copy NOT yet written (see Copy below)
- **Pre-area intro modals** — one blurb shown once before each area's questions begin
  - Copy NOT yet written (see Copy below)
- **Pregenerated agent responses** — replace free-text input with a set of 3–4 preset options per agent turn. Benefits: lower friction, anti-AI-feeling, prevents tangents, tighter funnel to coaching ask. Requires redesigning the agent turn-taking loop and engineering the option sets per conversation stage.
- **Agent screen UI polish:**
  - "FP Coach" label → rename to "Compass Agent" (or "Compass Wizard" pending naming decision); increase font size
  - Sign out button text too small — increase size
  - Info/question mark button — make significantly larger and move it near the input/response area so users are more likely to click it
- **Area labels — push further from center** — some labels currently overlap the outer nodes of the constellation. Increase label radius (`LABEL_POS` currently at `234`) until all labels clear the outermost ring.
- **Spoke visual fix** — the spoke from hub to first node appears to behave like a scoreable node (seems to "absorb" the first point visually). The spoke should not count as a node — it is purely a connector. Fix: ensure the spoke only becomes colored/filled when the first circle node is already lit (litCount ≥ 1), not when hasScore > 0. The spoke fill should be a consequence of the first node lighting up, not a separate trigger.
- **High score modals** — revisit after low-score whispers are validated in the wild. High scores should trigger a different kind of modal (recognition/acknowledgment, not coaching). Copy and design TBD.
- **Results screen copy fix** — remove "check your inbox for PDF" → replace with "We sent your results to [email]"
- **Reveal screen CTA** — single primary CTA (Compass call via dynamic Tally URL); Skool link as secondary social proof only; remove extra links
- **Dev gate welcome-back screen** — change "Dev Mode" label to proper returning-user welcome ("Welcome back, [name] — pick up where you left off?")
- **OG/social meta tags** — `og:title`, `og:description`, `og:image` — needed before LinkedIn push

---

## Strategic / Site Direction

- **Artifx + VusicFX as Compass client value stack** — agent can surface these as amenities for paid Compass clients, not standalone free tools. Positions them as part of the coaching offer rather than as separate site features. Keep the-free-producer.com focused on the assessment → agent → call funnel; tools are a perk, not an entry point.
- **"Wizard" vs "Agent" naming** — consider calling the conversational guide a "Wizard" instead of "Agent/Coach." Fits the constellation aesthetic, avoids AI/bot associations for anti-AI users, and aligns with the software meaning (guided process leading somewhere). "Compass Wizard" is a candidate. Get Skyler's gut reaction.
- **CTA: raise your hand, not book a call** — instead of directing users to schedule a call, the wizard should surface a personalized summary of what Compass coaching would focus on (derived from weak areas), then ask "Does this sound like something you'd want to work on?" A yes triggers a lightweight intake (name/contact pre-filled) that goes to a Zach/Skyler review queue. They reach out — no self-booking, no cold calendar slots, no unqualified time burns. The user raises their hand; you decide who gets a call.

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

---

## Done (this session — 2026-04-23)

- [x] Breathing animation — lit nodes pulse 3.6s ease-in-out
- [x] Power curve scaling — exponent 1.6 on litCount
- [x] Node bloom by ring depth — CSS drop-shadow scaled by ring index
- [x] Spoke fill timing fix — partial fill shown as soon as any score exists in area
- [x] Submit button deduplication — useRef guard + submitted state
- [x] Sign out button — agent screen header; clears localStorage, returns to title
