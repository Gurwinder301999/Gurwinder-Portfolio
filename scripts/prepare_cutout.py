"""Turn a raw full-body photo into a transparent, tightly-cropped PNG.

The source screenshots come with large empty margins and an opaque white
background, both of which look broken on a dark page. This script:

  1. whitens-tolerant keys the near-white pixels out to transparent,
  2. trims the fully transparent border so the subject fills the frame,
  3. pads slightly and writes an optimised transparent PNG.

Usage: python prepare_cutout.py <source> <destination>
"""

import os
import sys

from PIL import Image, ImageFilter, ImageChops

# How close to white a pixel must be before it is treated as background.
WHITE_CUTOFF = 240
# Feather the edge so the cutout does not look razor-cut against the dark page.
FEATHER_RADIUS = 1
# The source screenshots are low resolution. Upscaling is lossy, so it is kept
# modest and sharpened; the component also renders the figure at a modest size
# where the softness is not obvious.
UPSCALE = 2
SHARPEN_PERCENT = 115
SHARPEN_RADIUS = 1.6


def prepare(source: str, destination: str) -> None:
    img = Image.open(source).convert("RGBA")
    pixels = img.load()
    width, height = img.size

    # 1. Knock out the near-white background.
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            if r >= WHITE_CUTOFF and g >= WHITE_CUTOFF and b >= WHITE_CUTOFF:
                pixels[x, y] = (r, g, b, 0)
            elif r >= WHITE_CUTOFF - 12 and g >= WHITE_CUTOFF - 12 and b >= WHITE_CUTOFF - 12:
                # Slightly off-white: fade proportionally to avoid a hard rim.
                fade = max(0, 255 - ((WHITE_CUTOFF - min(r, g, b)) * 6))
                pixels[x, y] = (r, g, b, min(a, fade))

    # Soften the remaining edge a touch.
    alpha = img.getchannel("A").filter(ImageFilter.GaussianBlur(FEATHER_RADIUS))
    img.putalpha(alpha)

    # 2. Trim the transparent border to the subject's bounding box.
    bbox = img.getchannel("A").point(lambda v: 255 if v > 12 else 0).getbbox()
    if bbox:
        img = img.crop(bbox)

    # Upscale with a good resampling filter, then lightly sharpen. Colour is
    # left alone: the teal cast on the shirt is in the source photograph, not an
    # artefact of the cutout, so "correcting" it would misrepresent the photo.
    if UPSCALE > 1:
        img = img.resize(
            (img.width * UPSCALE, img.height * UPSCALE),
            Image.LANCZOS,
        )
    rgb = img.convert("RGB").filter(
        ImageFilter.UnsharpMask(radius=SHARPEN_RADIUS, percent=SHARPEN_PERCENT, threshold=3)
    )
    rgb.putalpha(img.getchannel("A"))
    img = rgb

    # 3. Small even margin so edges are not flush.
    pad = 10
    padded = Image.new("RGBA", (img.width + pad * 2, img.height + pad * 2), (0, 0, 0, 0))
    padded.paste(img, (pad, pad), img)
    img = padded

    os.makedirs(os.path.dirname(destination) or ".", exist_ok=True)
    img.save(destination, "PNG", optimize=True)

    size_kb = os.path.getsize(destination) / 1024
    print(f"{destination}  {img.width}x{img.height}  ratio {img.width / img.height:.3f}  {size_kb:.0f} KB")


if __name__ == "__main__":
    src = sys.argv[1] if len(sys.argv) > 1 else "image2.png"
    dst = sys.argv[2] if len(sys.argv) > 2 else "public/full-body-cutout.png"
    prepare(src, dst)
