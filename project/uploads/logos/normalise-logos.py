#!/usr/bin/env python3
"""
Normalise institution logos for the About page's Experience / Education lists.

The marks in this set are very different shapes (a dense square mark, a wide
wordmark, a tall university crest). Scaling each to merely *fit* the same box
does not make them look equal — a wordmark fitted to the box carries far more
ink than a compact mark and reads heavier.

So each logo is balanced by coverage-weighted INK AREA rather than bounding
box: trim to content, measure sum(alpha)/255, then scale every mark toward a
common ink target (clamped so nothing overflows its slot) and composite onto
an identical transparent canvas.

Usage:  python3 normalise-logos.py [BOX_W] [BOX_H] [DAMP]
        defaults: 44 20 0.86

Add a line to SOURCES for each new logo, then re-run.  Requires Pillow.
"""

import json
import math
import os
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
UPLOADS = os.path.dirname(HERE)

# slot filename -> source image, relative to project/uploads/
# Drop the official asset in, add its line here, re-run.
SOURCES = {
    "replit": "New_Replit_Logo.svg.png",
    "knot": "knot-wordmark.png",
    # "marriage-pact": "_raw-logos/marriage-pact-original.png",
    # "stimson":       "_raw-logos/stimson-original.png",
    # "pwc":           "_raw-logos/pwc-original.png",
    # "stanford":      "_raw-logos/stanford-original.png",
    # "oxford":        "_raw-logos/oxford-original.png",
}

SCALE = 3  # render at 3x for retina


def load(path):
    """Trim to content, and report ink area + whether the mark is one colour."""
    im = Image.open(path).convert("RGBA")
    bbox = im.split()[-1].getbbox()
    if bbox is None:
        raise ValueError(f"{path} is fully transparent")
    im = im.crop(bbox)

    alpha = im.split()[-1]
    ink = sum(alpha.getdata()) / 255.0

    px = im.load()
    mono = True
    for y in range(0, im.height, max(1, im.height // 60)):
        for x in range(0, im.width, max(1, im.width // 60)):
            r, g, b, a = px[x, y]
            if a < 30:
                continue
            if max(r, g, b) - min(r, g, b) > 26:
                mono = False
    return im, ink, mono


def main():
    box_w = int(sys.argv[1]) if len(sys.argv) > 1 else 44
    box_h = int(sys.argv[2]) if len(sys.argv) > 2 else 20
    damp = float(sys.argv[3]) if len(sys.argv) > 3 else 0.86
    cw, ch = box_w * SCALE, box_h * SCALE

    loaded = {}
    for key, rel in SOURCES.items():
        src = os.path.join(UPLOADS, rel)
        if not os.path.exists(src):
            print(f"  skip {key}: no source at {rel}")
            continue
        loaded[key] = load(src)

    if not loaded:
        print("nothing to do — add sources to SOURCES")
        return

    # scale at which each mark would just fit the slot
    fits = {k: min(cw / v[0].width, ch / v[0].height) for k, v in loaded.items()}
    # common optical target: geometric mean of the fitted ink areas, damped so
    # the airiest mark does not drag the whole set upward
    target = math.exp(
        sum(math.log(v[1] * fits[k] ** 2) for k, v in loaded.items()) / len(loaded)
    ) * damp

    manifest = {}
    for key, (im, ink, mono) in loaded.items():
        scale = min(math.sqrt(target / ink), fits[key])
        w = max(1, round(im.width * scale))
        h = max(1, round(im.height * scale))

        canvas = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
        canvas.alpha_composite(im.resize((w, h), Image.LANCZOS), (0, (ch - h) // 2))

        out = os.path.join(HERE, f"{key}.png")
        canvas.save(out, optimize=True)

        manifest[key] = {
            "mono": mono,
            "slot": [box_w, box_h],
            "drawn_css": [round(w / SCALE, 1), round(h / SCALE, 1)],
            "pct_of_naive_fit": round(scale / fits[key], 3),
        }
        flag = "  <- add class=\"mono\" in index.html" if mono else ""
        print(
            f"  {key:14s} {w / SCALE:5.1f}x{h / SCALE:4.1f} css "
            f"({scale / fits[key] * 100:3.0f}% of fit)  mono={mono}{flag}"
        )

    with open(os.path.join(HERE, "manifest.json"), "w") as fh:
        json.dump(manifest, fh, indent=2)
        fh.write("\n")


if __name__ == "__main__":
    main()
