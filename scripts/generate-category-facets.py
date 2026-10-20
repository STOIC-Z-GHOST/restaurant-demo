"""
Generates the two category-banner textures used on the menu page:
public/images/categories/facets-dessert.svg and facets-drinks.svg.

Run from the project root (needs numpy + scipy):
    pip install numpy scipy
    python3 scripts/generate-category-facets.py

Tweak the params at the bottom (palette, n_points, bias, highlight_prob) and
re-run to regenerate. `bias="right"` keeps the left side (where the title
plate sits) calmer and ramps up busier/brighter toward the right; `bias=
"diagonal"` does the same but along a corner-to-corner sweep instead of pure
left-right, used for the drinks "light catching glass" look.
"""
import numpy as np
from scipy.spatial import Delaunay
import random


def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))


def rgb_to_hex(rgb):
    return "#%02x%02x%02x" % tuple(max(0, min(255, int(round(c)))) for c in rgb)


def mix(c1, c2, t):
    return tuple(c1[i] * (1 - t) + c2[i] * t for i in range(3))


def generate_facets(
    seed, width, height, n_points,
    shadow_colors, accent_colors, highlight_color,
    accent_prob_min, accent_prob_max, bias,
    highlight_prob, out_path,
):
    rng = random.Random(seed)

    cols = max(2, int(np.sqrt(n_points * width / height)))
    rows = max(2, int(n_points / cols) + 1)
    pts = []
    for r in range(rows + 1):
        for c in range(cols + 1):
            x = c / cols * width + rng.uniform(-width / cols * 0.42, width / cols * 0.42)
            y = r / rows * height + rng.uniform(-height / rows * 0.42, height / rows * 0.42)
            pts.append((x, y))

    border_n = 10
    for i in range(border_n + 1):
        x = i / border_n * width
        pts.append((x, 0))
        pts.append((x, height))
    for i in range(border_n + 1):
        y = i / border_n * height
        pts.append((0, y))
        pts.append((width, y))

    pts = np.array(pts)
    tri = Delaunay(pts)

    polys = []
    for simplex in tri.simplices:
        p0, p1, p2 = pts[simplex]
        cx, cy = (p0[0] + p1[0] + p2[0]) / 3, (p0[1] + p1[1] + p2[1]) / 3

        if bias == "right":
            t = min(1, max(0, cx / width)) ** 1.7
        elif bias == "diagonal":
            raw = min(1, max(0, (cx / width) * 0.7 + (1 - cy / height) * 0.35))
            t = raw ** 1.5
        else:
            t = 0.5

        accent_p = accent_prob_min + (accent_prob_max - accent_prob_min) * t
        hl_p = highlight_prob * (0.25 + 0.75 * t)

        roll = rng.random()
        if roll < hl_p:
            base = hex_to_rgb(highlight_color)
            variance = 0.15
        elif roll < hl_p + accent_p:
            base = hex_to_rgb(rng.choice(accent_colors))
            variance = 0.16
        else:
            base = hex_to_rgb(rng.choice(shadow_colors))
            variance = 0.1

        jt = rng.uniform(-variance, variance)
        if jt < 0:
            shaded = mix(base, (6, 4, 3), -jt * 1.6)
        else:
            shaded = mix(base, (255, 248, 235), jt * 0.7)

        color_hex = rgb_to_hex(shaded)
        pts_str = " ".join(f"{p[0]:.1f},{p[1]:.1f}" for p in (p0, p1, p2))
        polys.append(f'<polygon points="{pts_str}" fill="{color_hex}" />')

    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" '
        f'preserveAspectRatio="none">\n' + "\n".join(polys) + "\n</svg>"
    )
    with open(out_path, "w") as f:
        f.write(svg)
    print(f"wrote {out_path}: {len(polys)} facets")


if __name__ == "__main__":
    # dessert -- mostly dark espresso, colorful shards (gold/amber/wine/cream)
    # emerging more toward the right, echoing the reference's dark-field-
    # with-scattered-shards composition instead of a uniform mosaic
    generate_facets(
        seed=11,
        width=900, height=300,
        n_points=80,
        shadow_colors=["#150d08", "#1c130a", "#241608", "#120a06"],
        accent_colors=["#c9a66b", "#a8763f", "#6b2a2a", "#8a5a2a"],
        highlight_color="#f1e9d8",
        accent_prob_min=0.03, accent_prob_max=0.62,
        bias="right",
        highlight_prob=0.08,
        out_path="public/images/categories/facets-dessert.svg",
    )

    # drinks -- sparser still, more monochrome espresso/gold, brighter glints,
    # biased along a diagonal sweep like light catching a glass edge
    generate_facets(
        seed=29,
        width=900, height=300,
        n_points=48,
        shadow_colors=["#0f0904", "#150d08", "#1c130a"],
        accent_colors=["#c9a66b", "#a8763f"],
        highlight_color="#f5ecd8",
        accent_prob_min=0.02, accent_prob_max=0.55,
        bias="diagonal",
        highlight_prob=0.11,
        out_path="public/images/categories/facets-drinks.svg",
    )
