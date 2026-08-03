"""
Generate va:villager_railer biome atlases for geometry.villager_handle UV (64x64).
Rail theme on clumper structure: leather apron + steel + redstone, distinct from miner grey tunic.
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(r"C:\Users\rodrigo.cordeiro\projetos\personal\golems_addon")
CLUMPER_DIR = ROOT / "villager_soldiers/resource_pack/textures/entity/villager_clumper"
OUT_DIR = ROOT / "villagers_addon/resource_pack/textures/entity/villager_railer"
ASSETS = ROOT / "assets/villager_railer"

BIOMES = ["plains", "desert", "jungle", "savanna", "snow", "swamp", "taiga"]

STEEL = (138, 147, 159, 255)
STEEL_D = (90, 99, 110, 255)
STEEL_L = (190, 198, 208, 255)
CAP = (52, 34, 24, 255)
CAP_L = (78, 52, 36, 255)
LEATHER = (74, 48, 34, 255)
LEATHER_D = (42, 26, 18, 255)
RED = (194, 59, 44, 255)
RED_L = (235, 95, 72, 255)
WOOD = (110, 76, 48, 255)
WOOD_D = (78, 52, 32, 255)
GOGGLE = (22, 28, 36, 255)


def box_faces(u, v, w, h, d):
    return {
        "top": (u + d, v, w, d),
        "bottom": (u + d + w, v, w, d),
        "right": (u, v + d, d, h),
        "front": (u + d, v + d, w, h),
        "left": (u + d + w, v + d, d, h),
        "back": (u + d + 2 * d, v + d, w, h),
    }


HEAD = box_faces(0, 0, 8, 10, 8)
HAT = box_faces(32, 0, 8, 10, 8)
BODY = box_faces(16, 20, 8, 12, 6)
APRON = box_faces(16, 38, 8, 20, 6)
LEG = box_faces(0, 22, 4, 12, 4)
ARM = box_faces(44, 22, 4, 12, 4)


def biome_tint(name: str):
    return {
        "plains": (1.0, 1.0, 1.0),
        "desert": (1.25, 1.1, 0.85),
        "jungle": (0.9, 1.05, 0.85),
        "savanna": (1.15, 1.0, 0.9),
        "snow": (1.15, 1.2, 1.25),
        "swamp": (0.85, 0.95, 0.8),
        "taiga": (0.95, 1.0, 1.05),
    }[name]


def tint(c, m):
    return tuple(max(0, min(255, int(c[i] * m[i]))) for i in range(3)) + (c[3],)


def put(px, x, y, c):
    if 0 <= x < 64 and 0 <= y < 64:
        px[x, y] = c


def fill(px, rect, c):
    x0, y0, w, h = rect
    for y in range(y0, y0 + h):
        for x in range(x0, x0 + w):
            put(px, x, y, c)


def is_skinish(p):
    r, g, b, a = p
    return a > 200 and r > 140 and g > 90 and b > 70 and r >= g


def paint_rail_hash(px, rect, steel, steel_d, steel_l):
    x0, y0, w, h = rect
    for y in range(y0, y0 + h):
        for x in range(x0, x0 + w):
            if px[x, y][3] < 10:
                continue
            if (y - y0) % 3 == 0:
                put(px, x, y, steel_d)
            elif (x - x0) % 2 == 0:
                put(px, x, y, steel)
            else:
                put(px, x, y, steel_l)


def make_railer(biome: str) -> Image.Image:
    clumper = Image.open(CLUMPER_DIR / f"{biome}.png").convert("RGBA")
    im = clumper.copy()
    px = im.load()
    src = clumper.load()
    m = biome_tint(biome)

    steel, steel_d, steel_l = tint(STEEL, m), tint(STEEL_D, m), tint(STEEL_L, m)
    cap, cap_l = tint(CAP, m), tint(CAP_L, m)
    leather, leather_d = tint(LEATHER, m), tint(LEATHER_D, m)
    red, red_l = RED, RED_L  # redstone stays saturated
    wood, wood_d = tint(WOOD, m), tint(WOOD_D, m)

    # --- HEAD: leather work cap ---
    fill(px, HEAD["top"], cap)
    fx, fy, fw, fh = HEAD["front"]
    for y in range(fy, fy + 4):
        for x in range(fx, fx + fw):
            put(px, x, y, cap if y < fy + 2 else cap_l)
    # goggles
    for x in range(fx, fx + fw):
        put(px, x, fy + 4, steel)
        put(px, x, fy + 6, steel_d)
    put(px, fx + 1, fy + 5, GOGGLE)
    put(px, fx + 2, fy + 5, GOGGLE)
    put(px, fx + 5, fy + 5, GOGGLE)
    put(px, fx + 6, fy + 5, GOGGLE)
    put(px, fx + 3, fy + 5, steel)
    put(px, fx + 4, fy + 5, steel)
    put(px, fx + 1, fy + 5, (20, 70, 40, 255))
    put(px, fx + 6, fy + 5, (20, 70, 40, 255))
    # restore lower face skin / nose from clumper
    for y in range(fy + 7, fy + fh):
        for x in range(fx, fx + fw):
            put(px, x, y, src[x, y])
    for y in range(0, 8):
        for x in range(24, 32):
            if src[x, y][3] > 0:
                put(px, x, y, src[x, y])

    # --- HAT: steel goggle mount ---
    hx, hy, hw, hh = HAT["front"]
    for y in range(hy, hy + 4):
        for x in range(hx, hx + hw):
            if src[x, y][3] > 0 or True:
                put(px, x, y, steel if y == hy + 3 else cap)
    for x in range(hx + 1, hx + hw - 1):
        put(px, x, hy + 5, GOGGLE)
        put(px, x, hy + 4, steel_l)
        put(px, x, hy + 6, steel)

    # --- BODY: keep clumper greens/tans mostly; add redstone gem on waist ---
    bx, by, bw, bh = BODY["front"]
    gx, gy = bx + bw // 2, by + bh - 2
    put(px, gx, gy, red_l)
    for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        put(px, gx + dx, gy + dy, red)

    # --- APRON: leather + lever (railer signature) ---
    # deepen apron leather slightly while keeping structure
    ax, ay, aw, ah = APRON["front"]
    for y in range(ay, ay + ah):
        for x in range(ax, ax + aw):
            p = src[x, y]
            if p[3] < 10:
                continue
            # push brown leather tones
            r, g, b, a = p
            if r > g and r > 50:
                put(px, x, y, (
                    max(0, min(255, int(r * 0.85 * m[0]))),
                    max(0, min(255, int(g * 0.8 * m[1]))),
                    max(0, min(255, int(b * 0.75 * m[2]))),
                    255,
                ))
    # lever on right
    lx = ax + aw - 2
    for y in range(ay + 6, ay + 16):
        put(px, lx, y, wood if y % 2 == 0 else wood_d)
    for x in range(lx - 1, lx + 2):
        put(px, x, ay + 16, steel)
        put(px, x, ay + 17, steel_d)
    put(px, lx, ay + 5, red_l)
    put(px, lx, ay + 6, red)
    put(px, ax + 1, ay + 10, red)
    put(px, ax + 2, ay + 14, red)

    # --- ARMS: steel cuff + rail hash ---
    arx, ary, arw, arh = ARM["front"]
    for y in range(ary + arh - 4, ary + arh):
        for x in range(arx, arx + arw):
            put(px, x, y, steel_d if (y - ary) % 2 == 0 else steel)
    paint_rail_hash(px, (arx, ary + 2, arw, 3), steel, steel_d, steel_l)

    # --- LEGS: shin steel ---
    lx0, ly0, lw, lh = LEG["front"]
    for y in range(ly0 + lh - 5, ly0 + lh - 2):
        for x in range(lx0, lx0 + lw):
            put(px, x, y, steel if x % 2 == 0 else steel_d)

    return im


def preview(tex: Image.Image, label: str, scale: int = 10) -> Image.Image:
    def face(rect):
        x0, y0, w, h = rect
        return tex.crop((x0, y0, x0 + w, y0 + h))

    W, H = 28, 42
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ox = 10
    head, hat = face(HEAD["front"]), face(HAT["front"])
    body, apron = face(BODY["front"]), face(APRON["front"])
    arm, leg = face(ARM["front"]), face(LEG["front"])
    canvas.paste(head, (ox, 0), head)
    canvas.alpha_composite(hat, (ox, 0))
    canvas.paste(arm, (ox - 4, 10), arm)
    canvas.paste(arm, (ox + 8, 10), arm)
    canvas.paste(body, (ox, 10), body)
    canvas.alpha_composite(apron, (ox, 10))
    canvas.paste(leg, (ox, 30), leg)
    canvas.paste(leg, (ox + 4, 30), leg)
    canvas.alpha_composite(tex.crop((26, 2, 28, 6)), (ox + 3, 6))
    big = canvas.resize((W * scale, H * scale), Image.NEAREST)
    out = Image.new("RGBA", (big.width + 40, big.height + 56), (18, 20, 24, 255))
    out.paste(big, (20, 36), big)
    ImageDraw.Draw(out).text((20, 10), label, fill=(220, 220, 220))
    return out


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    ASSETS.mkdir(parents=True, exist_ok=True)
    previews = []
    for biome in BIOMES:
        im = make_railer(biome)
        path = OUT_DIR / f"{biome}.png"
        im.save(path)
        im.save(ASSETS / f"railer_{biome}.png")
        print("wrote", path)
        previews.append(preview(im, f"va:villager_railer {biome}"))

    pw = max(p.width for p in previews)
    ph = sum(p.height for p in previews) + 8 * len(previews)
    strip = Image.new("RGBA", (pw, ph), (12, 14, 16, 255))
    y = 0
    for p in previews:
        strip.paste(p, (0, y), p)
        y += p.height + 8
    strip.save(ASSETS / "villager_railer_preview_strip.png")
    previews[BIOMES.index("desert")].save(ASSETS / "villager_railer_desert_preview.png")
    previews[BIOMES.index("plains")].save(ASSETS / "villager_railer_plains_preview.png")
    print("strip", ASSETS / "villager_railer_preview_strip.png")


if __name__ == "__main__":
    main()
