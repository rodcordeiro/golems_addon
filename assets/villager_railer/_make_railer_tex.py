"""Surgical railer desert atlas from clumper desert (64x64 UV preserved)."""
from pathlib import Path
from PIL import Image, ImageDraw

CLUMPER = Path(
    r"C:\Users\rodrigo.cordeiro\projetos\personal\golems_addon"
    r"\villager_soldiers\resource_pack\textures\entity\villager_clumper\desert.png"
)
OUT = Path(
    r"C:\Users\rodrigo.cordeiro\projetos\personal\golems_addon"
    r"\villagers_addon\resource_pack\textures\entity\villager_railer\desert.png"
)
DEBUG = Path(
    r"C:\Users\rodrigo.cordeiro\projetos\personal\golems_addon"
    r"\assets\villager_railer\_debug_grid.png"
)
ASSETS_COPY = Path(
    r"C:\Users\rodrigo.cordeiro\projetos\personal\golems_addon"
    r"\assets\villager_railer\villager_railer_desert.png"
)

STEEL = (138, 147, 159, 255)
STEEL_D = (90, 99, 110, 255)
STEEL_L = (190, 198, 208, 255)
CAP = (58, 38, 28, 255)
CAP_L = (78, 52, 36, 255)
LEATHER = (74, 48, 34, 255)
RED = (194, 59, 44, 255)
RED_L = (235, 95, 72, 255)
WOOD = (110, 76, 48, 255)
WOOD_D = (78, 52, 32, 255)


def put(px, x, y, c):
    if 0 <= x < 64 and 0 <= y < 64:
        px[x, y] = c


def is_metal(p):
    r, g, b, a = p
    return (
        a > 200
        and abs(r - g) < 22
        and abs(g - b) < 22
        and 85 <= r <= 210
    )


def is_sandy(p):
    r, g, b, a = p
    return a > 200 and r > 150 and g > 115 and b < 140 and r >= g


def main():
    base = Image.open(CLUMPER).convert("RGBA")
    im = base.copy()
    px = im.load()
    bp = base.load()

    # 1) Leather workman's cap: darken sandy headwear on head top/sides (y0-12, known head cells)
    for y in range(0, 12):
        for x in range(8, 32):
            if is_sandy(bp[x, y]):
                put(px, x, y, CAP if y < 4 else CAP_L)

    # Short brim just above eyes on front face (eyes at ~10,14 and 13,14)
    for x in range(8, 16):
        if bp[x, 12][3] > 0:
            put(px, x, 12, CAP)

    # 2) Steel goggles around eyes (keep eyes green but darkened as lenses)
    eyes = [(10, 14), (13, 14)]
    for x, y in eyes:
        er, eg, eb, _ = bp[x, y]
        put(px, x, y, (max(8, er // 4), max(28, eg * 2 // 3), max(8, eb // 4), 255))
    # frame
    for x in range(9, 15):
        put(px, x, 13, STEEL)
        put(px, x, 15, STEEL_D)
    put(px, 9, 14, STEEL)
    put(px, 11, 14, STEEL)  # bridge
    put(px, 12, 14, STEEL)
    put(px, 14, 14, STEEL)

    # 3) Head accessory metal (x39-48,y7-12) -> steel plates with rail hash
    for y in range(6, 14):
        for x in range(38, 50):
            if is_metal(bp[x, y]) or (bp[x, y][3] > 200 and is_metal(px[x, y])):
                if y % 2 == 0:
                    put(px, x, y, STEEL_D)
                else:
                    put(px, x, y, STEEL_L if x % 3 else STEEL)

    # 4) Arm/shoulder metal patches anywhere y16-35 -> rail-marked steel
    for y in range(16, 36):
        for x in range(0, 64):
            if is_metal(bp[x, y]):
                put(px, x, y, STEEL_D if (y % 2 == 0) else (STEEL if x % 3 else STEEL_L))

    # 5) Redstone gem on belt — dark brown band around y36-40 mid apron top
    # Prefer opaque brown near center of apron straps area
    gem = (28, 38)
    put(px, gem[0], gem[1], RED_L)
    for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        x, y = gem[0] + dx, gem[1] + dy
        if bp[x, y][3] > 0:
            put(px, x, y, RED)

    # 6) Replace ONLY hammer metal on lower-right apron (typical hammer ~x32-40,y44-52)
    hammer = [
        (x, y)
        for y in range(42, 56)
        for x in range(30, 44)
        if is_metal(bp[x, y])
    ]
    print("hammer pixels", len(hammer), hammer[:20])
    if hammer:
        for x, y in hammer:
            put(px, x, y, LEATHER)  # clear to apron
        xs = sorted(p[0] for p in hammer)
        ys = sorted(p[1] for p in hammer)
        cx = xs[len(xs) // 2]
        y0, y1 = ys[0], ys[-1]
        # compact lever (max 8 px tall)
        y0 = max(y0, y1 - 7)
        for y in range(y0, y1 + 1):
            put(px, cx, y, WOOD if y % 2 == 0 else WOOD_D)
        for x in range(cx - 1, cx + 2):
            put(px, x, y1, STEEL)
        put(px, cx, y0, RED_L)
        put(px, cx, y0 + 1, RED)
        print("lever", cx, y0, y1)
    else:
        # paint small lever into empty-ish apron right pocket area
        cx, y0, y1 = 36, 46, 52
        for y in range(y0, y1 + 1):
            put(px, cx, y, WOOD)
        for x in range(cx - 1, cx + 2):
            put(px, x, y1, STEEL)
        put(px, cx, y0, RED_L)
        print("lever fallback", cx)

    # 7) Shin steel bands on sandy lower legs
    for y in (54, 55):
        for x in range(16, 48):
            if is_sandy(bp[x, y]) or (
                bp[x, y][3] > 200 and bp[x, y][0] > 130 and bp[x, y][1] > 100
            ):
                put(px, x, y, STEEL if x % 2 == 0 else STEEL_D)

    # 8) Tiny redstone dust stains on pouches (sandy pockets on apron)
    for y in range(44, 52):
        for x in range(16, 48):
            r, g, b, a = bp[x, y]
            if a > 200 and 145 < r < 210 and 105 < g < 175 and b < 115:
                if (x + 3 * y) % 19 == 0:
                    put(px, x, y, RED)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    im.save(OUT)
    ASSETS_COPY.write_bytes(OUT.read_bytes())
    print("saved", OUT)

    big = im.resize((640, 640), Image.NEAREST)
    d = ImageDraw.Draw(big)
    for i in range(0, 641, 80):
        d.line([(i, 0), (i, 640)], fill=(220, 40, 40, 160))
        d.line([(0, i), (640, i)], fill=(220, 40, 40, 160))
    for i in range(0, 641, 10):
        d.line([(i, 0), (i, 640)], fill=(60, 60, 60, 50))
        d.line([(0, i), (640, i)], fill=(60, 60, 60, 50))
    big.save(DEBUG)


if __name__ == "__main__":
    main()
