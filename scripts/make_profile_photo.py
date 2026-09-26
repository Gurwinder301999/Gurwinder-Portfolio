"""Convert a source photo into the optimised JPEG the site uses.

The portfolio portrait card is a 4:5 frame, so the source is centre-cropped to
that ratio and resized before being written out. Encoding at quality 82 with
progressive scan keeps the file small without visible artefacts on a face.

Usage: python make_profile_photo.py <source> <destination>
"""

import os
import sys

from PIL import Image, ImageOps

TARGET_RATIO = 4 / 5  # width / height
OUTPUT_WIDTH = 800


def build(source: str, destination: str) -> None:
    with Image.open(source) as img:
        # Honour EXIF rotation so phone photos are not sideways, then flatten
        # any transparency onto the dark canvas the site sits on.
        img = ImageOps.exif_transpose(img)
        if img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGBA")
            background = Image.new("RGB", img.size, (12, 12, 12))
            background.paste(img, mask=img.split()[-1])
            img = background
        else:
            img = img.convert("RGB")

        width, height = img.size
        current = width / height

        if current > TARGET_RATIO:
            # Too wide: trim the sides.
            new_width = int(round(height * TARGET_RATIO))
            left = (width - new_width) // 2
            img = img.crop((left, 0, left + new_width, height))
        else:
            # Too tall: trim top and bottom, biased upward so faces stay framed.
            new_height = int(round(width / TARGET_RATIO))
            top = int((height - new_height) * 0.25)
            img = img.crop((0, top, width, top + new_height))

        img = img.resize(
            (OUTPUT_WIDTH, int(round(OUTPUT_WIDTH / TARGET_RATIO))),
            Image.LANCZOS,
        )

        os.makedirs(os.path.dirname(destination) or ".", exist_ok=True)
        img.save(destination, "JPEG", quality=82, optimize=True, progressive=True)

    size_kb = os.path.getsize(destination) / 1024
    print(f"{destination}  {img.size[0]}x{img.size[1]}  {size_kb:.0f} KB")


if __name__ == "__main__":
    src = sys.argv[1] if len(sys.argv) > 1 else "Image1.png"
    dst = sys.argv[2] if len(sys.argv) > 2 else "public/profile-pic.jpeg"
    build(src, dst)
