# HeroQuest Loot Generator — Vision & Plan

*Working plan for evolving this from a single-item LLM generator into a public-facing curated loot tool. Authored 2026-05-05.*

---

## Vision

Two-phase product: **curate expensive once, draw cheap forever.**

1. **Curation phase (private, expensive):** Use high-fidelity AI — Claude Opus for text, premium image model for art — to generate hundreds-to-thousands of HQ-canonical items. Deep context across all base + expansion content. Tier strength and lore consistency calibrated to Nima's taste. Each card gets professional-quality HQ-style art.
2. **Public phase (free at point of use):** Public-facing app that "fakes" AI generation by drawing from this large pre-built catalog. No tokens spent on user draws. Feels random and AI-magical, but it's curated.

**Coverage target:** generic items, hero-specific items, artifacts, across all heroes, across all expansions. Spells, potions, scrolls included.

**Public-facing safeguard:** rolling no-repeat window — last N (e.g. 50) drawn items cannot reappear; if randomly selected, re-roll. Already partially implemented in `src/lib/catalog.js` (`pushRecentDrawId`) — needs extending.

---

## Framing corrections (read first)

- **"Trained with me" — Claude is not fine-tunable.** Nima's taste gets injected via (a) a written **tier rubric** the prompt references, and (b) **few-shot gold examples** Nima hand-crafts per category. The current `prompt.js` already injects the official catalog; we extend that with canonical examples + an explicit tier-strength spec. This works very well — but the rubric-authoring phase is real upfront work.
- **Image generation is not Anthropic.** Claude doesn't make images. Visuals come from a separate API (gpt-image-1, Flux 1.1 Pro, etc.). HQ's art style — Les Edwards / Gary Chalk gritty painted dark-fantasy, single object on parchment, dramatic lighting — is very specific and needs a style-anchor iteration phase before bulk runs.

---

## Phasing

### Phase 0 — Foundations (do this BEFORE any bulk generation)

Goal: lock the rubric and visual style. Cheap to iterate, expensive if skipped.

- **Tier rubric** — externalize Nima's tier-strength definitions as a structured doc the prompt can cite (Tier 1 baseline → Tier 5 artifact mechanics, dice ranges, allowed effect categories per tier).
- **Lore consistency notes** — short doc on flavor-text voice, naming conventions, world references the model should pull from / avoid.
- **Visual style anchor** — generate 5-10 test cards across slots/tiers; iterate on image prompts until the look is right. Pick image model based on results.
- **Hand-crafted gold examples** — 10-30 items Nima authors or curates as exemplars per category. These embed in the system prompt as few-shot anchors.

### Phase 1 — Bulk curation

Goal: build the catalog in waves with QA between.

- Batch by category/expansion/tier so failure modes are scoped.
- Bulk-forge UI in Builder mode: generate N candidates → multi-select to keep → reject the rest. (New work — doesn't exist yet.)
- Schema validation on save (the validation checklist already exists as a doc; needs to become enforcement).
- Gap-finder dashboard: distribution by tier × slot × hero × expansion to surface holes.
- Wave QA: spot-check ~10% of each wave before committing.

### Phase 2 — Public app polish

Goal: ship something other people can use.

- Tune no-repeat rule (last 50, configurable; needs to interact correctly with active filters — small items list + tight filter could collapse the window).
- Public catalog browser (browse without drawing).
- Permalink share for individual items.
- Card → PNG/PDF export (printable home decks).
- Production deployment + save persistence story (current save flow is dev-only via Vite plugin; prod is read-only static — that's fine for the curate-locally-then-build model).

---

## Open decisions (Phase 0 inputs)

These cascade into everything. Answer in roughly this order — earlier ones gate later ones.

1. **Tier rubric** — do you already have tier-strength definitions written down, or are they intuitive? (If intuitive, externalizing them is the single highest-leverage Phase 0 task.)
2. **Visual style** — any HQ-style images you're happy with yet? Image model choice: gpt-image-1 (~$0.17/img, best instruction-following), Flux 1.1 Pro (~$0.04/img, great quality), Midjourney (best aesthetics, no proper API).
3. **Target catalog size for v1** — 500? 1000? 2500? Sets the budget. Rough math: 1000 items × Opus text + gpt-image-1 high ≈ $200-400; with Flux ≈ $50-150.
4. **Curation structure** — flat catalog, or organized into named sets/decks (e.g. "Kellar's Keep Common Treasures", "Wizard Artifacts")? Affects schema, prompt-batching, and the public browse UX.
5. **Item-type coverage** — same schema for everything, or do spells/potions/artifacts get their own shape? (Currently flat. Spells likely want their own structure: cost, range, duration, school.)
6. **Curation review pace** — manual review of every generated item, or batch-accept-with-spot-check? At 1-3 min/item, 1000 items manual = 20-50 hours.
7. **Budget ceiling** — rough cap for the curation phase?

---

## Existing groundwork (already in repo)

- LLM pipeline: Cloudflare Worker proxy, system-prompt with full official hero/expansion roster + official item catalog + variety seeder, prompt caching enabled.
- Builder mode (`?builder=1`): forge → review → save to `src/data/catalog/*.json`.
- Catalog filters: tier, slot, hero, expansion (expansion just wired in commit `22011ee`).
- Catalog viewer: list, filter, search, edit, delete (commit `4bcf2d7`).
- Public draw mode: random pick with last-30-draws "prefer fresh" logic.
- Validation checklist: markdown + printable HTML versions exist as docs (not yet enforced as schema).

## Known gaps to close

- Catalog has 1 item — public mode is functionally empty until Phase 1 runs.
- No image generation pipeline at all (`imageUrl` field exists but is never populated).
- No bulk-forge UI.
- No schema enforcement on save (just a human checklist).
- Save persistence is dev-only.
- No tier rubric document.
- No visual style document or anchor images.
