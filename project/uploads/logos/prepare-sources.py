#!/usr/bin/env python3
"""
Pre-clean raw logo downloads before `normalise-logos.py` resizes them.

Two problems that normalisation alone cannot fix:

  * a logo supplied as a flat JPEG on a white ground — pasted straight in, it
    shows as a white rectangle on both themes. Fixed by mapping luminance to
    alpha, which also keeps antialiased edges clean and turns knockout letters
    genuinely transparent.

  * a logo that pairs a black wordmark with brand colour (PwC). A CSS
    `invert()` on the dark theme would flip the palette too — orange becomes
    blue. Fixed by baking a dark twin that lifts only the near-grey dark
    pixels, leaving every coloured block alone. Saturation is the
    discriminator: the wordmark is pure grey, the dark red bar is not.

Run from the repo root:  python3 project/uploads/logos/prepare-sources.py
"""

import os

from PIL import Image

RAW = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "_raw-logos")
RAW = os.path.normpath(RAW)

# black-on-white artwork that needs its ground keyed out
KEY_WHITE = {
    "marriage-pact-original.jpg": "marriage-pact-keyed.png",
}

# logos needing a baked dark-theme twin instead of a CSS invert
DARK_TWIN = {
    "pwc-original.png": "pwc-dark-original.png",
}

GREY_TOL = 30   # max-min channel spread still counted as "grey"
DARK_MAX = 85   # brightest channel still counted as "dark"
LIFT_TO = 240   # near-white the wordmark becomes on the dark twin


def key_white(src, dst):
    im = Image.open(src).convert("L")
    w, h = im.size
    out = Image.new("RGBA", (w, h))
    s, d = im.load(), out.load()
    for y in range(h):
        for x in range(w):
            a = 255 - s[x, y]
            d[x, y] = (0, 0, 0, 0 if a < 8 else a)
    bbox = out.split()[-1].getbbox()
    if bbox:
        out = out.crop(bbox)
    out.save(dst)
    return out.size


def dark_twin(src, dst):
    im = Image.open(src).convert("RGBA")
    px = im.load()
    w, h = im.size
    lifted = 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 8:
                continue
            if max(r, g, b) - min(r, g, b) < GREY_TOL and max(r, g, b) < DARK_MAX:
                px[x, y] = (LIFT_TO, LIFT_TO, LIFT_TO, a)
                lifted += 1
    im.save(dst)
    return lifted


def main():
    for src_name, dst_name in KEY_WHITE.items():
        src = os.path.join(RAW, src_name)
        if not os.path.exists(src):
            print(f"  skip {src_name}: not found")
            continue
        size = key_white(src, os.path.join(RAW, dst_name))
        print(f"  keyed  {src_name} -> {dst_name} {size}")

    for src_name, dst_name in DARK_TWIN.items():
        src = os.path.join(RAW, src_name)
        if not os.path.exists(src):
            print(f"  skip {src_name}: not found")
            continue
        n = dark_twin(src, os.path.join(RAW, dst_name))
        print(f"  twin   {src_name} -> {dst_name} ({n:,} px lifted)")


if __name__ == "__main__":
    main()
