# Compass Skill Tree — Copy & Strategy Notes

Last updated: 2026-04-05

---

## Question Format Options Under Consideration

### V1 — Behavioral descriptors (archived)
Four answer choices per question describing behaviors at different skill levels.
File: `questions-v1-behavioral.md`

### V2 — Statement / self-assess (current)
"I regularly listen to music I wouldn't normally make." → 4-point slider.
File: `questions-v2-statements.md`

### V3 — Binary (not yet written)
Pure Yes/No or That's me/Not me (2 options only).
- Fastest to complete — minimizes friction and abandonment
- Eliminates middle-ground hedging ("Kind of" / "Mostly" = rationalized high score)
- Eliminates social desirability bias (can't slowly inch the slider toward "That's me")
- Trade-off: lower data resolution per question; need well-calibrated statements to spread scores
- Works best for factual statements: "I've released at least one song in 2026." "I know the 3 most important effects for mixing."

### V4 — Categorical diagnostic (not yet written)
Each area's 7 questions follow a fixed category sequence to reveal the *reason* behind a low score, not just the score itself.

**Proposed category sequence per area:**
1. **Awareness** — Does this person know what this area actually involves?
2. **Avoidance** — Are they avoiding it because they feel unqualified or intimidated?
3. **Practice** — Do they do this thing at all?
4. **Satisfaction** — Are they happy with their results in this area? *(Zach, 2026-04-06; replaces Consistency as #4)*
5. **Intentionality** — Do they do it on purpose, or just by feel?
6. **Output** — Does their effort produce results?
7. **Reflection** — Do they study their own work in this area?

*Categories 5–7 are provisional — Zach's initial seed was 1–4; these need review before being locked.*

**Why this matters:** High scores in any area don't help us. Low scores are the coaching hook. But "low mixing score" is not enough — knowing *why* (intimidated, avoidant, unaware the problem exists, inconsistent) lets us write a targeted follow-up email sequence and a more useful Compass call opener. The email for "doesn't know what mixing is" is completely different from "knows but feels unqualified."

---

## On Score Bias

The 4-point slider creates selection pressure toward looking good — people want their tree lit up. Binary reduces this. Statement framing ("I release on a consistent schedule") is more honest than behavioral framing ("how consistent is your schedule?") because the user has to endorse a claim, not just describe a behavior.

**The calibration principle:** questions in Release and Promo should be binary-hard truths that most producers can't honestly say yes to. Questions in Ideation and DAW should be things most producers genuinely can agree with. This creates natural variance without needing to artificially tune scoring weights.

---

## A/B Testing Plan

Test one variable at a time. Order of priority:

1. **Hook** (pain point emphasis) — test before headline, because it determines who clicks at all
2. **Headline** (promise) — test once hook is validated
3. **Image** — screenshot of completed skill tree is the baseline; test against no image

### Hook candidates
- "Are you working on the wrong thing as a producer?"
- "Frustrated by the progress you're making as a producer?"
- "Stop guessing what to work on next."
- "Stop guessing." (paired with subhead explaining)

### Headline candidates
- "Your music production skill tree" (current — descriptive, no promise)
- "See your producer build"
- "What type of producer are you?"
- "Ready to see the next step for your production career?"

### Notes on framing
- **Headlines should make a promise** (what they get)
- **Hooks should name a pain point** (what they're escaping)
- The pain point is more important for cold traffic — they don't know us yet, but they know the frustration
- "Stop guessing what to work on next" is strong because it names the exact problem the Compass solves — unfocused effort, no clear priority
- Zach suggestion (2026-04-05): **"Stop guessing (something)"** — the fill-in could be "what to work on," "what's holding you back," "where your gaps are"

### Image candidates
- Screenshot of a completed, fully lit skill tree
- Animated GIF of tree building in real time (highest friction to produce, likely highest CTR)
- No image

---

## Landing Page Direction

For cold traffic, the **pain point** should be the entry point — not the skill tree visualization. The tree is the mechanism, not the hook.

**Proposed above-the-fold order:**
1. Hook (pain point)
2. Headline (promise of what the tool delivers)
3. Image (completed skill tree screenshot)
4. CTA ("Find out in 5 minutes →" or similar)

The current title screen ("Your music production / SKILL TREE") reads as a product name, not a promise. Fine for warm Skool audience who already trust us. Needs a wrapper for cold traffic.

---

## Open Questions

- Which format to wire into v7 for Skool POC: V2 (statements) or V3 (binary)?
- How many questions per area is right for binary? 7 binary Ys/Ns might still feel like 70 questions — could reduce to 5.
- Does the categorical diagnostic (V4) add too much complexity for a cold audience, or is it worth the design cost for richer data?
