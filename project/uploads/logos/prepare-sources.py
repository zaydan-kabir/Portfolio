#!/usr/bin/env python3
"""
Pre-clean raw logo downloads before `normalise-logos.py` resizes them.

Four problems that normalisation alone cannot fix:

  * a logo supplied as a flat JPEG on a white ground — pasted straight in, it
    shows as a white rectangle on both themes. Fixed by mapping luminance to
    alpha, which also keeps antialiased edges clean and turns knockout letters
    genuinely transparent.

  * a logo that pairs a black wordmark with brand colour (PwC). A CSS
    `invert()` on the dark theme would flip the palette too — orange becomes
    blue. Fixed by baking a dark twin that lifts only the near-grey dark
    pixels, leaving every coloured block alone. Saturation is the
    discriminator: the wordmark is pure grey, the dark red bar is not.

  * a badge mark supplied as a JPEG whose own ground is part of the artwork
    (the Stimson roundel: a navy glyph on a pale green disc). Only the white
    *outside* the disc may go — keying by luminance would take the pale disc
    with it — so the ground is flood-filled inward from the corners and the
    disc is left untouched.

  * a *coloured* mark painted on an opaque white disc (the Stanford seal).
    `key_white` cannot be used — it throws the hue away and would return a
    black seal. Fixed by un-matting instead: the ground is treated as white
    the artwork was composited over, so alpha is recovered from how far each
    pixel sits from white and the cardinal is restored at full strength.

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

# coloured artwork sitting on an opaque white ground, to be un-matted
UNMATTE_WHITE = {
    "stanford-original.png": "stanford-keyed.png",
}

# badge marks whose own ground is artwork: only the white around them goes
FLOOD_WHITE = {
    "stimson-original.jpg": "stimson-keyed.png",
}

UNMATTE_FLOOR = 6  # alpha below this (out of 255) is treated as bare ground

FLOOD_WHITE_MIN = 238  # darkest channel a pixel may have and still be "paper"
FLOOD_EDGE_REF = 40    # distance from white at which a rim pixel is fully opaque

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


def flood_white(src, dst):
    """Drop the paper *around* a badge without touching the badge's own ground.

    The Stimson roundel is a navy glyph on a pale green disc: luminance keying
    would eat the disc along with the white corners. Connectivity is the
    discriminator instead — only paper reachable from an edge is removed, so
    an enclosed light area survives. Rim pixels then get partial alpha scaled
    by how far they sit from white, which keeps the circle from stair-casing
    once it is downscaled into the slot.
    """
    im = Image.open(src).convert("RGBA")
    px = im.load()
    w, h = im.size

    def paper(x, y):
        r, g, b, _ = px[x, y]
        return min(r, g, b) >= FLOOD_WHITE_MIN

    seen = [[False] * w for _ in range(h)]
    stack = [(x, y) for x in range(w) for y in (0, h - 1)]
    stack += [(x, y) for y in range(h) for x in (0, w - 1)]
    stack = [(x, y) for x, y in stack if paper(x, y)]
    for x, y in stack:
        seen[y][x] = True
    while stack:
        x, y = stack.pop()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx] and paper(nx, ny):
                seen[ny][nx] = True
                stack.append((nx, ny))

    cleared = 0
    for y in range(h):
        for x in range(w):
            if seen[y][x]:
                px[x, y] = (0, 0, 0, 0)
                cleared += 1
                continue
            touches = any(
                0 <= nx < w and 0 <= ny < h and seen[ny][nx]
                for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1))
            )
            if touches:
                r, g, b, _ = px[x, y]
                a = min(255, round(255 * (255 - min(r, g, b)) / FLOOD_EDGE_REF))
                px[x, y] = (r, g, b, a)

    bbox = im.split()[-1].getbbox()
    if bbox:
        im = im.crop(bbox)
    im.save(dst)
    return im.size, cleared


def unmatte_white(src, dst):
    """Recover colour artwork that was flattened onto a white ground.

    A pixel is `ink * a + white * (1 - a)`, so the darkest channel carries the
    coverage: `a = 1 - min(r, g, b) / 255`. Dividing the white back out
    restores the ink's own colour, which keeps the cardinal saturated instead
    of leaving it washed pink along every antialiased edge. Assumes the ink
    bottoms out near zero in at least one channel — true of Stanford cardinal
    (#c5042d) and of most single-colour brand marks.
    """
    im = Image.open(src).convert("RGBA")
    px = im.load()
    w, h = im.size
    out = Image.new("RGBA", (w, h))
    d = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a0 = px[x, y]
            if a0 < 8:
                continue
            a = 255 - min(r, g, b)
            if a < UNMATTE_FLOOR:
                continue
            f = a / 255
            ink = tuple(min(255, max(0, round((c - 255 * (1 - f)) / f))) for c in (r, g, b))
            d[x, y] = (*ink, round(a * a0 / 255))
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

    for src_name, dst_name in FLOOD_WHITE.items():
        src = os.path.join(RAW, src_name)
        if not os.path.exists(src):
            print(f"  skip {src_name}: not found")
            continue
        size, cleared = flood_white(src, os.path.join(RAW, dst_name))
        print(f"  flood   {src_name} -> {dst_name} {size} ({cleared:,} px cleared)")

    for src_name, dst_name in UNMATTE_WHITE.items():
        src = os.path.join(RAW, src_name)
        if not os.path.exists(src):
            print(f"  skip {src_name}: not found")
            continue
        size = unmatte_white(src, os.path.join(RAW, dst_name))
        print(f"  unmatte {src_name} -> {dst_name} {size}")

    for src_name, dst_name in DARK_TWIN.items():
        src = os.path.join(RAW, src_name)
        if not os.path.exists(src):
            print(f"  skip {src_name}: not found")
            continue
        n = dark_twin(src, os.path.join(RAW, dst_name))
        print(f"  twin   {src_name} -> {dst_name} ({n:,} px lifted)")


if __name__ == "__main__":
    main()
