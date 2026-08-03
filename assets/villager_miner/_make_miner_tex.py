"""
Generate va:villager_miner biome atlases for geometry.va_villager_miner /
villager_handle UV (64x64) — visually inspired by fv_miner_trader, distinct from clumper.

Clumper = leather apron + green vest + worker goggles.
Miner   = charcoal tunic + brown pants + miner cap/headlamp + belt pickaxe.
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageOps

ROOT = Path(r"C:\Users\rodrigo.cordeiro\projetos\personal\golems_addon")
CLUMPER_DIR = ROOT / "villager_soldiers/resource_pack/textures/entity/villager_clumper"
TRADER = ROOT / "villager_soldiers/resource_pack/textures/entity/fv_miner_trader.png"
OUT_DIR = ROOT / "villagers_addon/resource_pack/textures/entity/villager_miner"
ASSETS = ROOT / "assets/villager_miner"

BIOMES = ["plains", "desert", "jungle", "savanna", "snow", "swamp", "taiga"]

# Palette from fv_miner_trader language
GREY = (90, 90, 92, 255)
GREY_L = (130, 130, 132, 255)
GREY_D = (58, 58, 60, 255)
GREY_XL = (168, 168, 170, 255)
BROWN = (94, 63, 51, 255)
BROWN_D = (62, 43, 35, 255)
BROWN_L = (120, 85, 68, 255)
BELT = (70, 48, 38, 255)
BUCKLE = (200, 200, 205, 255)
PICK = (150, 150, 155, 255)
PICK_D = (100, 100, 105, 255)
LAMP = (220, 190, 90, 255)
SKIN_FALLBACK = (189, 139, 114, 255)


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
BACKPACK = (0, 47, 4 + 2 * 3 + 4, 3 + 14)  # accent cube region roughly


def put(px, x, y, c):
    if 0 <= x < 64 and 0 <= y < 64:
        px[x, y] = c


def fill_rect(px, rect, color, only_opaque=True, src=None):
    x0, y0, w, h = rect
    for y in range(y0, y0 + h):
        for x in range(x0, x0 + w):
            if only_opaque and src is not None and src[x, y][3] < 10:
                continue
            if only_opaque and src is None and px[x, y][3] < 10:
                continue
            put(px, x, y, color)


def fill_noise(px, rect, base, amp=12, src=None):
    x0, y0, w, h = rect
    for y in range(y0, y0 + h):
        for x in range(x0, x0 + w):
            if src is not None and src[x, y][3] < 10:
                continue
            if src is None and px[x, y][3] < 10:
                continue
            n = ((x * 17 + y * 31) % 5) - 2
            c = tuple(max(0, min(255, base[i] + n * (amp // 4))) for i in range(3)) + (255,)
            put(px, x, y, c)


def is_skinish(p):
    r, g, b, a = p
    if a < 200:
        return False
    return r > 140 and g > 90 and b > 70 and r >= g and abs(r - g) < 80


def preserve_face(px, src):
    """Keep villager face pixels (eyes/nose/skin) on head front mid."""
    fx, fy, fw, fh = HEAD["front"]
    for y in range(fy + 4, fy + fh):
        for x in range(fx, fx + fw):
            p = src[x, y]
            if is_skinish(p) or (p[1] > p[0] + 15 and p[1] > 50):  # eyes green
                put(px, x, y, p)
    # nose cube
    for y in range(0, 8):
        for x in range(24, 32):
            if src[x, y][3] > 0:
                put(px, x, y, src[x, y])


def biome_tint(name: str):
    """Multipliers (r,g,b) for clothing greys / browns."""
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


def paint_pickaxe(px, ax, ay):
    """Small pickaxe head on apron/belt right."""
    # handle
    put(px, ax, ay + 2, BROWN_D)
    put(px, ax, ay + 3, BROWN)
    # head
    for x in range(ax - 1, ax + 3):
        put(px, x, ay, PICK)
    put(px, ax - 1, ay + 1, PICK_D)
    put(px, ax + 2, ay + 1, PICK)


def make_miner(biome: str) -> Image.Image:
    clumper = Image.open(CLUMPER_DIR / f"{biome}.png").convert("RGBA")
    im = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    # start with clumper occupancy so transparent layout matches
    im.paste(clumper, (0, 0))
    px = im.load()
    src = clumper.load()
    m = biome_tint(biome)

    g, gl, gd, gxl = tint(GREY, m), tint(GREY_L, m), tint(GREY_D, m), tint(GREY_XL, m)
    br, brd, brl = tint(BROWN, m), tint(BROWN_D, m), tint(BROWN_L, m)
    belt = tint(BELT, m)

    # --- HEAD: miner cap (grey), keep face ---
    fill_noise(px, HEAD["top"], gd, src=src)
    fill_noise(px, HEAD["bottom"], g, src=src)
    for face in ("right", "left", "back"):
        fill_noise(px, HEAD[face], g, src=src)
    # front: cap band on top rows, then face preserved
    fx, fy, fw, fh = HEAD["front"]
    for y in range(fy, fy + 4):
        for x in range(fx, fx + fw):
            put(px, x, y, gd if y < fy + 2 else g)
    # headlamp strap
    for x in range(fx, fx + fw):
        put(px, x, fy + 3, GREY_D)
    put(px, fx + fw - 1, fy + 3, LAMP)  # lamp glow side
    put(px, fx + fw - 2, fy + 3, gxl)
    preserve_face(px, src)

    # --- HAT overlay: thin goggle frames + lamp (keep face readable under overlay) ---
    for face in HAT:
        fill_rect(px, HAT[face], (0, 0, 0, 0), only_opaque=False)
    hx, hy, hw, hh = HAT["front"]
    # trader-like hollow frames (2 squares)
    for x, y in [
        (hx + 1, hy + 4), (hx + 2, hy + 4), (hx + 1, hy + 5), (hx + 2, hy + 5),
        (hx + 5, hy + 4), (hx + 6, hy + 4), (hx + 5, hy + 5), (hx + 6, hy + 5),
    ]:
        put(px, x, y, gxl if y == hy + 4 else gd)
    # bridge
    put(px, hx + 3, hy + 4, g)
    put(px, hx + 4, hy + 4, g)
    # lamp plate on hat top / forehead rim
    for x in range(hx + 2, hx + 6):
        put(px, x, hy + 1, gd)
        put(px, x, hy + 2, g)
    put(px, hx + 3, hy + 2, LAMP)
    put(px, hx + 4, hy + 2, gxl)

    # --- BODY: charcoal tunic ---
    for face in BODY:
        fill_noise(px, BODY[face], g if face != "bottom" else gd, src=src)
    bx, by, bw, bh = BODY["front"]
    # V-neck skin
    for y in range(by, by + 3):
        for x in range(bx + 2, bx + bw - 2):
            if abs(x - (bx + bw // 2)) <= (y - by):
                # sample skin from clumper face if possible
                sp = src[8 + 3, 8 + 7]
                put(px, x, y, sp if is_skinish(sp) else SKIN_FALLBACK)
    # suspenders
    for y in range(by + 2, by + bh - 1):
        put(px, bx + 1, y, brd)
        put(px, bx + bw - 2, y, brd)
    # belt
    for x in range(bx, bx + bw):
        put(px, x, by + bh - 2, belt)
        put(px, x, by + bh - 1, belt)
    put(px, bx + bw // 2, by + bh - 2, BUCKLE)
    put(px, bx + bw // 2 - 1, by + bh - 2, gxl)

    # --- APRON slot: upper = charcoal tunic continuation; lower = brown pants ---
    # (geo apron is tall; paint like trader grey shirt + brown skirt, not clumper leather)
    for face in ("top", "bottom", "right", "left", "back"):
        fill_noise(px, APRON[face], br if face != "top" else g, src=src)
    ax, ay, aw, ah = APRON["front"]
    # upper half grey tunic
    for y in range(ay, ay + 9):
        for x in range(ax, ax + aw):
            n = ((x * 17 + y * 31) % 5) - 2
            c = tuple(max(0, min(255, g[i] + n * 2)) for i in range(3)) + (255,)
            put(px, x, y, c)
    # suspenders continue onto apron overlay
    for y in range(ay, ay + 8):
        put(px, ax + 1, y, brd)
        put(px, ax + aw - 2, y, brd)
    # lower brown pants first
    for y in range(ay + 10, ay + ah):
        for x in range(ax, ax + aw):
            n = ((x * 13 + y * 7) % 5) - 2
            c = tuple(max(0, min(255, br[i] + n * 2)) for i in range(3)) + (255,)
            put(px, x, y, c)
    # belt at mid
    for x in range(ax, ax + aw):
        put(px, x, ay + 8, belt)
        put(px, x, ay + 9, belt)
    put(px, ax + aw // 2, ay + 8, BUCKLE)
    put(px, ax + aw // 2 - 1, ay + 8, gxl)
    # pouch + pickaxe on belt line
    put(px, ax + 1, ay + 10, brl)
    put(px, ax + 2, ay + 10, brl)
    put(px, ax + 1, ay + 11, br)
    put(px, ax + 2, ay + 11, br)
    paint_pickaxe(px, ax + aw - 2, ay + 10)

    # backpack accent cube at 0,47 — grey frame like trader
    for y in range(47, 64):
        for x in range(0, 16):
            if src[x, y][3] > 0:
                # hollow frame vibe
                edge = x in (0, 1, 8, 9, 14, 15) or y in (47, 48, 60, 61)
                put(px, x, y, gxl if edge else gd)

    # --- ARMS: grey sleeves, skin hands ---
    for face in ARM:
        fill_noise(px, ARM[face], g, src=src)
    arx, ary, arw, arh = ARM["front"]
    for y in range(ary + arh - 3, ary + arh):
        for x in range(arx, arx + arw):
            sp = src[8 + 2, 8 + 8]
            put(px, x, y, sp if is_skinish(sp) else SKIN_FALLBACK)

    # --- LEGS: brown pants ---
    for face in LEG:
        fill_noise(px, LEG[face], brd if face == "bottom" else br, src=src)

    return im


def preview(tex: Image.Image, label: str, scale: int = 10) -> Image.Image:
    def face(rect):
        x0, y0, w, h = rect
        return tex.crop((x0, y0, x0 + w, y0 + h))

    W, H = 28, 42
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    head, hat = face(HEAD["front"]), face(HAT["front"])
    body, apron = face(BODY["front"]), face(APRON["front"])
    arm, leg = face(ARM["front"]), face(LEG["front"])
    ox = 10
    canvas.paste(head, (ox, 0), head)
    canvas.alpha_composite(hat, (ox, 0))
    canvas.paste(arm, (ox - 4, 10), arm)
    canvas.paste(arm, (ox + 8, 10), arm)
    canvas.paste(body, (ox, 10), body)
    canvas.alpha_composite(apron, (ox, 10))
    canvas.paste(leg, (ox, 30), leg)
    canvas.paste(leg, (ox + 4, 30), leg)
    nose = tex.crop((26, 2, 28, 6))
    canvas.alpha_composite(nose, (ox + 3, 6))
    big = canvas.resize((W * scale, H * scale), Image.NEAREST)
    out = Image.new("RGBA", (big.width + 40, big.height + 56), (18, 20, 24, 255))
    out.paste(big, (20, 36), big)
    ImageDraw.Draw(out).text((20, 10), label, fill=(220, 220, 220))
    return out


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    ASSETS.mkdir(parents=True, exist_ok=True)
    # copy trader ref
    (ASSETS / "ref_fv_miner_trader.png").write_bytes(TRADER.read_bytes())

    previews = []
    for biome in BIOMES:
        im = make_miner(biome)
        path = OUT_DIR / f"{biome}.png"
        im.save(path)
        im.save(ASSETS / f"miner_{biome}.png")
        print("wrote", path)
        previews.append(preview(im, f"va:villager_miner {biome}"))

    # strip of previews
    pw = max(p.width for p in previews)
    ph = sum(p.height for p in previews) + 8 * len(previews)
    strip = Image.new("RGBA", (pw, ph), (12, 14, 16, 255))
    y = 0
    for p in previews:
        strip.paste(p, (0, y), p)
        y += p.height + 8
    strip.save(ASSETS / "villager_miner_preview_strip.png")
    previews[0].save(ASSETS / "villager_miner_plains_preview.png")
    print("previews", ASSETS)


if __name__ == "__main__":
    main()
