"""One-shot font self-hosting: fetch the exact Google Fonts the site uses as
woff2 subsets into assets/fonts/ and write assets/fonts/fonts.css with local
URLs. Designed to run on GitHub Actions (.github/workflows/fetch-fonts.yml)
so no font bytes are downloaded to a dev machine.

Self-hosting removes the only third-party request the site makes: loading
fonts from fonts.googleapis.com/gstatic.com transmits every visitor's IP
address to Google without consent — a documented GDPR violation (Landgericht
München, 3 O 17493/20, 2022-01-20) and a direct contradiction of the site's
"no upload, no tracking" claim.
"""

import pathlib
import re
import urllib.request

# Superset of the families/axes referenced by index.html, scan.html, 404.html:
# Fraunces variable (opsz 9..144, wght 300..600 normal + italic 300..500),
# Inter variable wght 400..800 (scan uses 800), IBM Plex Mono static 400/500/600.
CSS_URL = (
    "https://fonts.googleapis.com/css2?"
    "family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..500"
    "&family=Inter:wght@400..800"
    "&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
)
UA = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/125.0 Safari/537.36"
}
# latin + latin-ext cover the site's English text; keep any other subset that
# contains the rupee sign U+20A8 so the ₨ symbol keeps its current rendering.
KEEP_SUBSETS = {"latin", "latin-ext"}
RUPEE = "20A8"


def fetch(url: str) -> bytes:
    return urllib.request.urlopen(
        urllib.request.Request(url, headers=UA), timeout=60
    ).read()


out_dir = pathlib.Path("assets/fonts")
out_dir.mkdir(parents=True, exist_ok=True)

css = fetch(CSS_URL).decode()
blocks = re.findall(r"/\*\s*([\w-]+)\s*\*/\s*(@font-face\s*\{[^}]*\})", css)

local_by_url: dict[str, str] = {}
kept: list[str] = []
for subset, block in blocks:
    if subset not in KEEP_SUBSETS:
        if RUPEE not in (re.search(r"unicode-range:\s*([^;]+);", block).group(1).upper()):
            continue
    family = re.search(r"font-family:\s*'([^']+)'", block).group(1)
    style = re.search(r"font-style:\s*(\w+)", block).group(1)
    weight = re.search(r"font-weight:\s*([\d ]+)", block).group(1).strip()
    src = re.search(r"url\((https://fonts\.gstatic\.com/[^)]+\.woff2)\)", block).group(1)
    name = f"{family.lower().replace(' ', '-')}-{style}-{weight.replace(' ', '-')}.woff2"
    if src not in local_by_url:
        (out_dir / name).write_bytes(fetch(src))
        local_by_url[src] = name
    kept.append(block.replace(src, local_by_url[src]))

(out_dir / "fonts.css").write_text("\n".join(kept) + "\n", encoding="utf-8")
print(f"wrote {len(local_by_url)} woff2 files, {len(kept)} @font-face blocks -> assets/fonts/fonts.css")
