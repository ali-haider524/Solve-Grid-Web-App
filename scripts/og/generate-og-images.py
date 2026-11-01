"""Generate one 1200x630 Open Graph image per page into public/og/.

Run from the repo root:  python scripts/og/generate-og-images.py
Re-run after adding a tool or a page that uses createStaticPageMetadata.
Image file name = page path with "/" replaced by "--" (see ogImageFor in lib/seo.ts).
"""
import glob, os, re
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "public", "og")
FONT_DIRS = ["/usr/share/fonts/truetype/dejavu", "C:/Windows/Fonts"]

def font(names, size):
    for d in FONT_DIRS:
        for n in names:
            p = os.path.join(d, n)
            if os.path.exists(p):
                return ImageFont.truetype(p, size)
    return ImageFont.load_default()

BOLD = ["DejaVuSans-Bold.ttf", "arialbd.ttf"]
REG = ["DejaVuSans.ttf", "arial.ttf"]
NAVY, BLUE, MUTED, LINE, BG = (17, 32, 60), (49, 87, 232), (96, 112, 138), (219, 229, 242), (245, 247, 252)

def read(p):
    with open(p, encoding="utf-8") as f:
        return f.read()

def pages():
    out = {}
    tools = read(os.path.join(ROOT, "lib", "tools.ts"))
    body = tools[tools.index("export const tools"):]
    for m in re.finditer(r'\{\s*slug: "([^"]+)",\s*name: "([^"]+)",.*?category: "(\w+)".*?description:\s*"([^"]+)"', body, re.S):
        slug, name, cat, desc = m.groups()
        eyebrow = {"statistics": "STATISTICS CALCULATOR", "math": "MATH CALCULATOR",
                   "engineering": "ENGINEERING CALCULATOR"}.get(cat, "RESEARCH TOOL")
        out[f"/{slug}"] = (eyebrow, name, desc)
    for p in glob.glob(os.path.join(ROOT, "app", "**", "page.tsx"), recursive=True):
        s = read(p)
        m = re.search(r'''createStaticPageMetadata\(\s*(["'])(.+?)\1,\s*(["'])(.+?)\3,\s*"([^"]+)"''', s)
        if not m:
            continue
        _, title, _, desc, path = m.groups()
        eyebrow = "GUIDE" if path.startswith("/guides/") else "SOLVEGRID"
        out[path] = (eyebrow, title, desc)
    return out

def headline(title):
    # Keep the part before a subtitle separator so the headline stays short.
    for sep in [": ", " – ", " — ", " | "]:
        if sep in title and len(title.split(sep)[0]) >= 12:
            return title.split(sep)[0]
    return title

def wrap(draw, text, f, width, max_lines):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=f) <= width:
            cur = t
        else:
            lines.append(cur); cur = w
    if cur:
        lines.append(cur)
    if len(lines) > max_lines:
        lines = lines[:max_lines]
        while draw.textlength(lines[-1] + "…", font=f) > width:
            lines[-1] = lines[-1].rsplit(" ", 1)[0]
        lines[-1] = lines[-1].rstrip(",;:") + "…"
    return lines

def render(eyebrow, title, desc, dest):
    im = Image.new("RGB", (1200, 630), BG)
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((60, 60, 1140, 570), radius=36, fill="white", outline=LINE, width=3)
    d.rounded_rectangle((110, 105, 186, 181), radius=18, fill=BLUE)
    d.text((148, 143), "Σ", font=font(BOLD, 50), fill="white", anchor="mm")
    d.text((210, 143), "SolveGrid", font=font(BOLD, 40), fill=NAVY, anchor="lm")
    ef = font(BOLD, 22)
    d.text((1090, 143), eyebrow, font=ef, fill=BLUE, anchor="rm")
    head = headline(title)
    size = 64
    while size > 40:
        hf = font(BOLD, size)
        lines = wrap(d, head, hf, 980, 2)
        if " ".join(lines).replace("…", "") == head or size <= 44:
            break
        size -= 4
    y = 235
    for ln in lines:
        d.text((110, y), ln, font=hf, fill=NAVY)
        y += int(size * 1.18)
    df = font(REG, 26)
    y += 14
    for ln in wrap(d, desc, df, 980, 2):
        d.text((110, y), ln, font=df, fill=MUTED)
        y += 38
    d.text((110, 515), "solvegrid.online · free, step-by-step, no sign-up", font=font(BOLD, 22), fill=BLUE, anchor="lm")
    im.save(dest, optimize=True)

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    ps = pages()
    for path, (eyebrow, title, desc) in sorted(ps.items()):
        key = path.strip("/").replace("/", "--") or "home"
        render(eyebrow, title, desc, os.path.join(OUT, f"{key}.png"))
    print(f"Generated {len(ps)} images in public/og/")
