# Closing the Loop: Claude Coke Research Publication & Interactive Blog

An Anthropic-inspired interactive research publication for **"Claude Coke: Prevent Automated Crime by Agents"** (NeurIPS 2026 Position Paper Track), written in Gabor B. Hollbeck's authentic scientific writing style (`gabor-scientific-style`) and verified against his 2022 Physics Bachelor Thesis reference corpus (`STYLE DISTANCE = 0.103`).

## Repository Structure

- `index.html` — Full research blogpost and five interactive empirical laboratories in an asymmetric editorial layout (`#FAF9F5` warm paper canvas, `#F0EFEA` warm stone cards, `#D97757` terracotta accents, sticky Table of Contents & reading progress rail).
- `styles.css` — Self-contained stylesheet implementing the Anthropic Research visual design system, responsive breakpoints, tracked-changes diff styling, and inline Gabor-style rhetorical highlighter.
- `app.js` — Interactive simulation and data exploration logic powered by the exact empirical tables from `body.tex` and `appendix_cta.tex`.
- `blogpost_prose.tex` — Extracted LaTeX prose of the blogpost used for deterministic stylometric auditing via `style_diff.py`.
- `style_diff_report.json` — Full 27-metric comparison output from `style_diff.py --voice ml`.
- `assets/` — High-resolution paper figures, blurred sandbox storefront screenshots (`764shots_soMain_rounded_blurred.png`, `86shots_soProduct_rounded_blurred.png`, `937shots_so_chekcout_rounded_blurred.png`, `743shots_soFinal_rounded_blurred.png`), and the full camera-ready paper PDF (`ClaudeCoke_NeurIPS2026.pdf`).

## Interactive Features

1. **Interactive Composed Loop Calculator ($P(A, B, C) = P(A) \cdot P(B \mid A) \cdot P(C \mid A, B)$)** — Toggle Model (`GPT-4.1-mini`, `Gemini-3-Flash`, `Claude Haiku-4.5`), Principal Pressure Framing (`Verbal Pressure`, `Template Banner`, `Balance Only`), History Condition (`E2: With Phase-1 Bankruptcy Transcript` vs. `E1: Without History`), Harm Escalation Threshold (`Step 1` vs. `Step >= 3`), and Phase-3 Checkout Basis.
2. **Phase 1 Supply-Chain Bankruptcy Explorer (58 Analyzed Runs)** — Inspect the 84.5% (`49/58`) bankruptcy rate across `Standard`, `Communication`, `Orchestrator` (`80.8` vs. `63.4` survival rounds), and `OpenCode`, the 5 failure modes (`Overordering Cascade` `36/49 = 73.5%`), and the `Distributor` as modal weakest link (`25/49 = 51.0%`).
3. **Phase 2 Contextual Modulation & Moral-Tradeoff Explorer (53,000+ Trials)** — Three-tab interactive suite covering the 10-tool escalation ladder, the 27,600-decision existential pressure sweep across 23 balances, and the 12,150-decision moral-tradeoff payoff matrix (`6x` matched insolvent vs. solvent split: `0.420 vs. 0.120` for GPT-4.1-mini, `0.647 vs. 0.253` for Gemini-3-Flash).
4. **Phase 3 Agentic Browser Checkout Explorer (360 Trials)** — Filter all 24 `model x storefront x vision` cells (`n = 15` per cell), inspect the 8-step commitment-depth funnel (`72%` pass search, `79%` [`170/214`] place order at Step 8), and browse the contained sandbox storefront gallery.
5. **Gabor's Scientific Style Showcase & Tracked-Changes Diff Inspector** — Toggle between `Tracked-Changes Diff (Red Strikeout / Green Addition)`, `Gabor's Scientific Style`, and `Standard LLM Draft` across four real passages, plus a top-bar toggle to highlight Gabor's purposive openers, explicit causal chains, and epistemic honesty markers across the entire article.

## Quantitative Style Verification (`style_diff.py --voice ml`)

```bash
python3 /Users/gaborhollbeck/.claude/skills/gabor-scientific-style/scripts/style_diff.py \
  --voice ml --ours blogpost_prose.tex
```

- **Overall Style Distance**: `0.103` (2,328 words, 99 sentences, 25 paragraphs)
- `dashes_1k`: `0.00` (ref `0.00`)
- `share_we_opener`: `0.14` (ref `0.14`)
- `share_short_le10`: `0.10` (ref `0.10`)
- `par_len_sents`: `3.96` (ref `3.86`)
- `sent_len_p10` / `sent_len_p90`: `10.0` / `37.0` (ref `10.3` / `38.0`)
- `sent_len_mean`: `23.52` (ref `22.62`)
- `burstiness`: `0.42` (ref `0.45`)
- `subord_opener_share`: `0.35` (ref `0.32`)
