# Institution logos — About page

These are the marks shown in the Experience and Education lists on
`project/index.html`. Every file here is **pre-normalised** so the whole
column reads as one set (see "Harmonising" below).

## Status

| Slot file           | Row                          | Present |
| ------------------- | ---------------------------- | ------- |
| `replit.png`        | Replit                       | yes     |
| `knot.png`          | Knot                         | yes     |
| `marriage-pact.png` | Marriage Pact                | yes     |
| `stimson.png`       | The Stimson Center           | **no**  |
| `pwc.png` + `pwc-dark.png` | PricewaterhouseCoopers (PwC) | yes |
| `stanford.png`      | Stanford University          | **no**  |
| `oxford.png`        | University of Oxford         | yes     |

Rows whose file is missing fall back to a small typographic monogram
chip. That fallback is automatic: each `<img>` already points at the
filename above and carries an `onerror` hook, so **dropping the file in
here is the only step needed** — no markup or CSS change.

## Adding a missing logo

1. Get the official asset from the organisation's own brand/press page
   (SVG or a large transparent PNG is best — at least ~600px on its
   long edge, transparent background, no surrounding whitespace baked
   in; the script trims it anyway).
2. Save the raw file somewhere outside this folder, e.g.
   `project/uploads/_raw-logos/pwc-original.png`.
3. If the source is a flat JPEG on a white ground, or pairs a black
   wordmark with brand colour, add it to `prepare-sources.py` and run
   that first (see "Pre-cleaning" below).
4. Add a line to `SOURCES` in `normalise-logos.py`, then run it to
   produce the slot-sized file here.
5. If the mark is a single flat colour, add `class="mono"` to that row's
   `<img>` in `index.html` so it inverts on the dark theme. If it is
   full colour, leave the class off.

## Pre-cleaning

`prepare-sources.py` handles two things normalisation cannot:

* **Flat JPEG on white** (Marriage Pact was supplied this way). Pasted in
  as-is it shows a white rectangle on both themes. The script maps
  luminance to alpha, which keeps antialiased edges clean and makes the
  knockout letters genuinely transparent.
* **Black wordmark + brand colour** (PwC). A CSS `invert()` on the dark
  theme would flip the palette too — orange would become blue. Instead a
  dark twin is baked, lifting only the near-grey dark pixels and leaving
  every coloured block alone; saturation is the discriminator, so the
  black wordmark lifts while the dark red bar does not. The twin is
  listed in `VARIANT_OF` so it inherits its base's scale exactly and the
  mark does not jump size when the theme is toggled.

## Harmonising

The marks in this set are wildly different shapes — Replit is a dense
square, Knot a wide wordmark, a university crest is tall and detailed.
Scaling each to simply "fit the same box" does *not* make them look
equal: fitted naively, the Knot wordmark carried about **1.8x** Replit's
ink and read much heavier.

So each asset is normalised by **coverage-weighted ink area** rather
than bounding box:

1. trim to the actual content bounds (alpha bbox),
2. measure ink = sum(alpha)/255 — area weighted by opacity, so airy
   marks are not over-credited for their bounding box,
3. scale so every mark hits a common ink target (the geometric mean of
   what each would carry if fitted, damped by 0.86), clamped so nothing
   overflows the slot,
   — then blended back toward the plain fit scale by `BLEND` (0.6).
   Pure ink balancing over-punishes dense marks: the solid Marriage Pact
   block is genuinely "heavy", but shrunk to match an airy wordmark its
   type stopped being readable. `BLEND` is the optics/legibility dial —
   1.0 is pure optical balance, 0 is just fill the box,
4. composite onto an identical transparent canvas, left-aligned and
   vertically centred, at 3x for retina.

Slot is **44x20 CSS px** -> canvas **132x60**. At the current settings
PwC and the Oxford crest fill the slot, Knot lands at 81% of its naive
fit and Marriage Pact at 79%.

Regenerate from the repo root:

```
python3 project/uploads/logos/prepare-sources.py   # only if sources changed
python3 project/uploads/logos/normalise-logos.py 44 20 0.86
```

`normalise-logos.py` reads the sources listed in `SOURCES` at the top of
the script — add a line there for each new logo — and rewrites the PNGs
in place. Raw originals live in `../_raw-logos/` and are never served.

## A note on usage

These are third-party trademarks, used here nominatively to indicate
where the site's author studied and worked. Use the organisation's own
official asset; do not redraw or approximate a mark. Missing rows
deliberately show a plain typographic monogram rather than a lookalike.
