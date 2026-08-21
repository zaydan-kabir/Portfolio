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
| `stimson.png`       | The Stimson Center           | yes     |
| `pwc.png` + `pwc-dark.png` | PricewaterhouseCoopers (PwC) | yes |
| `stanford.png`      | Stanford University          | yes     |
| `oxford.png`        | University of Oxford         | yes     |

Rows whose file is missing show a small dashed empty slot — deliberately
not a lookalike mark, and not the org name repeated back, since the name
is already the visible text beside it. It holds the column's rhythm so a
pending row reads as awaiting art rather than broken.

The swap is automatic: each `<img>` already points at the filename above
and carries an `onerror` hook, so **dropping the file in here is the only
step needed** — no markup or CSS change.

### All slots filled

Every row now carries its official mark. Stanford and Stimson were the
last two — both were unobtainable from this environment (the egress
policy blocks stanford.edu, stimson.org, Wikimedia and Clearbit, and the
`simple-icons` set carries neither) and were supplied by hand.

Note that a *genuine* SVG cannot be sent through the chat attachment
pipeline — it rejects the file because it cannot read image dimensions
from the header. Either export it to PNG first, or paste the SVG source
as text and it can be written to `_raw-logos/` and rasterised from
there; the loader handles `.svg` sources directly.

## Adding a missing logo

1. Get the official asset from the organisation's own brand/press page.
   A true SVG is ideal — `normalise-logos.py` rasterises vectors at
   1600px wide before downscaling, which stays crisper than any small
   exported PNG. Otherwise a large transparent PNG (~600px+ on its long
   edge). Surrounding whitespace is fine; the script trims to content.
2. Save the raw file somewhere outside this folder, e.g.
   `project/uploads/_raw-logos/pwc-original.png`.
3. If the source arrives on an opaque ground, or pairs a black wordmark
   with brand colour, add it to the matching table in
   `prepare-sources.py` and run that first (see "Pre-cleaning" below).
4. Add a line to `SOURCES` in `normalise-logos.py`, then run it to
   produce the slot-sized file here.
5. Pick the row's dark-theme class in `index.html` from what the mark is:
   `class="mono"` for a black/grey mark, which inverts to white;
   `class="reverse"` for a mark drawn in one *brand* colour, which knocks
   the hue out before flipping (a plain invert would turn Stanford's
   cardinal cyan); no class at all for full-colour artwork, which is left
   as drawn. `normalise-logos.py` prints `mono=` per slot to help — it
   only distinguishes grey from coloured, so the mono/reverse call
   between those two is yours.

## Pre-cleaning

`prepare-sources.py` handles what normalisation cannot:

* **Flat JPEG on white** (Marriage Pact was supplied this way). Pasted in
  as-is it shows a white rectangle on both themes. The script maps
  luminance to alpha, which keeps antialiased edges clean and makes the
  knockout letters genuinely transparent.
* **Colour art flattened onto white** (the Stanford seal). `key_white`
  cannot be used here — it maps luminance to alpha and would hand back a
  black seal. The ground is *un-matted* instead: alpha is read from how
  far each pixel sits from white and the white is divided back out, which
  keeps the cardinal at full strength rather than leaving it washed pink
  along every antialiased edge.
* **A badge whose ground is part of the mark** (the Stimson roundel: a
  navy glyph on a pale green disc). Keying by luminance would take the
  pale disc too, so only white *reachable from an edge* is flooded away
  and the disc is left intact.
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
4. composite onto an identical transparent canvas, centred both ways,
   at 3x for retina.

One mark needs a step past this. A seal engraved in hairlines — Stanford
— loses most of its ink to antialiasing at 20px and comes out pink and
weightless however it is scaled, because the strokes are thinner than a
pixel. `ALPHA_GAMMA` in `normalise-logos.py` pushes that partial coverage
back up (0.7 for `stanford`) after the downscale, restoring the drawing's
weight without thickening the strokes. It is for fine line art only; on a
solid mark it just fattens the edges.

Slot is **64x28 CSS px** -> canvas **192x84**. At the current settings
PwC, the Oxford crest and the Stanford seal fill the slot, Knot lands at
81% of its naive fit and Marriage Pact and Stimson at 79%. Adding a logo
shifts the common ink target, so every other mark is rescaled slightly —
that is the point of the balance, and why the whole folder is rewritten
on each run.

Regenerate from the repo root:

```
python3 project/uploads/logos/prepare-sources.py   # only if sources changed
python3 project/uploads/logos/normalise-logos.py 64 28 0.86
```

`normalise-logos.py` reads the sources listed in `SOURCES` at the top of
the script — add a line there for each new logo — and rewrites the PNGs
in place. Raw originals live in `../_raw-logos/` and are never served.

## A note on usage

These are third-party trademarks, used here nominatively to indicate
where the site's author studied and worked. Use the organisation's own
official asset; do not redraw or approximate a mark. Missing rows
deliberately show an empty dashed slot rather than a lookalike.
