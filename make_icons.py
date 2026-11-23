# Creates the app icons in an "icons" folder. Run once: python make_icons.py
import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs("icons", exist_ok=True)
BG, ACCENT = (15, 23, 42), (45, 212, 191)

def font(size):
    for f in ["arialbd.ttf", "Arial Bold.ttf", "DejaVuSans-Bold.ttf"]:
        try:
            return ImageFont.truetype(f, size)
        except OSError:
            pass
    return ImageFont.load_default()

def make(size, name, maskable=False, rounded=True):
    transparent = rounded and not maskable
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0) if transparent else BG + (255,))
    d = ImageDraw.Draw(img)
    if transparent:
        d.rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * 0.22), fill=BG)
    f = font(int(size * (0.30 if maskable else 0.40)))
    b = d.textbbox((0, 0), "SA", font=f)
    w, h = b[2] - b[0], b[3] - b[1]
    d.text(((size - w) / 2 - b[0], (size - h) / 2 - b[1] - size * 0.03), "SA", font=f, fill=ACCENT)
    lw = int(size * (0.22 if maskable else 0.3))
    y = int(size * 0.5 + h / 2 + size * 0.04)
    d.rounded_rectangle([(size - lw) // 2, y, (size + lw) // 2, y + max(2, size // 40)], radius=max(1, size // 80), fill=ACCENT)
    img.save(f"icons/{name}")
    print("made", name)

make(192, "icon-192.png")
make(512, "icon-512.png")
make(512, "maskable-512.png", maskable=True)
make(180, "apple-touch-icon.png", rounded=False)
make(32, "favicon-32.png")