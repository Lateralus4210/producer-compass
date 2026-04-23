# Compass Skill Tree — PDF Email

This is the document delivered to the subscriber's inbox after completing the skill tree. Layout mirrors the results screen. Compass explanation copy lives here (not on the results screen itself).

Last updated: 2026-04-06

---

## PDF Structure

### 1. Header
**[Name]'s Producer Skill Tree**
*Generated [date] · The Free Producer*

---

### 2. Skill Tree Visual
The filled-in constellation — their personalized snapshot. Areas lit proportional to score.

*Technical note: capture the SVG from the results screen client-side (html2canvas or SVG serialization) and embed as an image in the PDF. This is the hardest piece technically — see implementation notes below.*

---

### 3. Score Breakdown
One row per area, matching the results screen bar layout:

| Area | Score |
|---|---|
| Composition | X / 10 |
| Theory | X / 10 |
| DAW | X / 10 |
| Mixing | X / 10 |
| Mastering | X / 10 |
| Collaboration | X / 10 |
| Artwork/Content | X / 10 |
| Release | X / 10 |
| Ideation | X / 10 |
| Promo | X / 10 |

**Strongest area:** [area name]
**Biggest opportunity:** [area name]

---

### 4. What Is the Compass?

The Compass is a diagnostic framework for music producers — ten areas that together make up a complete production practice. Most producers are strong in two or three and stuck in ways they haven't named yet in the rest.

The skill tree doesn't tell you how talented you are. It tells you where your effort is going and where it isn't. That gap — between where you're spending time and where you're actually stuck — is where most producers lose years.

The ten areas are:

- **Ideation** — generating and selecting ideas worth developing
- **Composition** — building ideas into finished arrangements
- **Theory** — understanding the why behind the music you make
- **DAW** — turning intention into sound without friction
- **Mixing** — making a track sound like itself
- **Mastering** — preparing a track to translate across every speaker
- **Collaboration** — working with other artists without losing your voice
- **Artwork/Content** — communicating your music visually before it's heard
- **Release** — getting finished work out into the world consistently
- **Promo** — putting your work in front of the right people

---

### 5. What to Do With This

Your lowest-scoring areas aren't failures — they're the clearest signal of where a small amount of focused attention would move the needle fastest.

If you want to go deeper, a Compass consultation call walks through your scores in real time, identifies the root cause behind your lowest areas, and gives you a specific next step — not a general recommendation, but the one thing that actually applies to where you are.

[CTA button or link — TBD: free call, FP+ join link, or Skool community link]

---

### 6. Footer
*The Free Producer · remember.quest*
*This PDF was generated from your skill tree responses and is unique to you.*

---

## Implementation Notes

**Option A — Client-side (no backend)**
- Use `html2canvas` to screenshot the results screen SVG + bars
- Feed into `jsPDF` to generate a downloadable PDF in the browser
- Trigger download on the results screen ("Download your results") instead of emailing
- Simpler, no server cost, but no email delivery — user has to remember to save it

**Option B — Server-side via Vercel function**
- After MailerLite POST succeeds, make a second call to a `/api/generate-pdf` endpoint
- Endpoint uses `puppeteer-core` + `@sparticuz/chromium` to headlessly render the results page with the user's scores injected, screenshot it, wrap in PDF
- Email it via MailerLite transactional or a separate email API (Resend, Postmark)
- Correct delivery model but significant complexity + cold start time on Vercel serverless

**Option C — Static template per score tier (simplest)**
- No dynamic PDF — instead, the "PDF" is a styled HTML email that looks like the results page
- Score bars rendered as HTML/CSS in the email (no SVG capture needed)
- MailerLite automation handles delivery; no extra infrastructure
- Loses the constellation visual but keeps everything else
- Fastest path to "check your inbox for a PDF" being a real promise

**Recommendation for POC:** Option C first. Ship the HTML email that looks like the results page, drop the word "PDF" from the results screen CTA ("We sent your results to [email]"), upgrade to Option B after POC if demand warrants it.
