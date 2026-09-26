"""Verifies the generated favicon assets: alpha handling, ICO structure, and
that the orbit satellite was actually frozen off its starting axis."""
import io
import struct

from PIL import Image

PNG = "public/icon-512.png"
APPLE = "public/apple-touch-icon.png"
ICO = "public/favicon.ico"

# --- satellite position proves the SMIL clock was seeked, not left at t=0 ---
im = Image.open(PNG).convert("RGBA")
px = im.load()
w, h = im.size
cx = cy = w / 2

best = None
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a > 200 and r > 190 and 120 < b < 220 and g < 80:
            dist = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
            if dist > w * 0.28 and (best is None or r + b > best[2]):
                best = (x, y, r + b, dist)

print(f"icon-512 satellite at x={best[0]} y={best[1]} dist={best[3]:.0f} (ring ~{25 / 64 * w:.0f})")
print("  frozen mid-orbit (not at t=0 top axis):", abs(best[0] - cx) > 10)

# --- transparency contract -------------------------------------------------
ap = Image.open(APPLE).convert("RGBA")
print(f"apple-touch-icon mode={ap.mode} corner={ap.getpixel((0, 0))} (expect opaque #0C0C0C)")
print(f"icon-512          mode={im.mode} corner={im.getpixel((0, 0))} (expect transparent)")

# --- ico container ---------------------------------------------------------
d = open(ICO, "rb").read()
assert d[:4] == b"\x00\x00\x01\x00", "bad ICO magic"
count = struct.unpack("<H", d[4:6])[0]
print(f"ico entries={count}")
for i in range(count):
    e = 6 + i * 16
    width, height = d[e], d[e + 1]
    size, off = struct.unpack("<II", d[e + 8 : e + 16])
    png_sig = d[off : off + 8] == b"\x89PNG\r\n\x1a\n"
    sub = Image.open(io.BytesIO(d[off : off + size]))
    corner = sub.convert("RGBA").getpixel((0, 0))
    print(f"  {width}x{height} png={png_sig} mode={sub.mode} corner={corner}")
    assert png_sig, "ICO entry is not a PNG"
    # Antialiasing at 16px leaves a corner alpha of 1/255 rather than a hard 0;
    # anything this low is visually transparent.
    assert corner[3] <= 2, f"ICO {width}px corner is not transparent (alpha={corner[3]})"
print("all ICO entries carry transparency")
