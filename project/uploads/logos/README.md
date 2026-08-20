# Institution logos — About page

These are the marks shown in the Experience and Education lists on
`project/index.html`. Every file here is **pre-normalised** so the whole
column reads as one set (see "Harmonising" below).

## Status

| Slot file           | Row                          | Present |
| ------------------- | ---------------------------- | ------- |
| `replit.png`        | Replit                       | yes     |
| `knot.png`          | Knot                         | yes     |
| `marriage-pact.png` | Marriage Pact                | **no**  |
| `stimson.png`       | The Stimson Center           | **no**  |
| `pwc.png`           | PricewaterhouseCoopers (PwC) | **no**  |
| `stanford.png`      | Stanford University          | **no**  |
| `oxford.png`        | University of Oxford         | **no**  |

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
3. Run the normaliser (below) to produce the slot-sized file here.
4. If the mark is a single flat colour, add `class="mono"` to that row's
   `<img>` in `index.html` so it inverts on the dark theme. If it is
   full colour, leave the class off.

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
4. composite onto an identical transparent canvas, left-aligned and
   vertically centred, at 3x for retina.

Slot is **44x20 CSS px** -> canvas **132x60**. Knot lands at 81% of its
naive fit; Replit fills the slot.

Regenerate with `normalise-logos.py` in this folder:

```
python3 normalise-logos.py 44 20 0.86
```

It reads the sources listed in `SOURCES` at the top of the script — add
a line there for each new logo — and rewrites the PNGs in place.

## A note on usage

These are third-party trademarks, used here nominatively to indicate
where the site's author studied and worked. Use the organisation's own
official asset; do not redraw or approximate a mark. Missing rows
deliberately show a plain typographic monogram rather than a lookalike.
