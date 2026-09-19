#!/usr/bin/env bash
# Download the Gala photos into public/gala so the page stops depending on
# Google Drive at request time. Run once from the repo root, then commit the
# files in public/gala.
#
#   bash scripts/fetch-gala-photos.sh
#
# The originals live in City Center's Drive and were shot by Boren Photos.
# Confirm City Center may publish them from its own domain before committing.
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p public/gala

fetch() {
  local id="$1" width="$2" name="$3"
  local url="https://lh3.googleusercontent.com/d/${id}=w${width}"
  echo "→ ${name}"
  curl -fsSL "$url" -o "public/gala/${name}"
  # Fail loudly if Drive returned an HTML error page instead of an image.
  file "public/gala/${name}" | grep -qi 'image' || {
    echo "   not an image — check sharing on ${id}" >&2
    exit 1
  }
}

fetch 1FXIA91WavmA3vEPLMRW_p9KjmPSP_9in 2200 hero.jpg
fetch 1DdB-i0Ky5jOlt2XADXY_BBrb_Ai9uvNV 1600 hero-support.jpg
fetch 1aJOtReJfkADBNpLbqSJ9VzzmS55q-24x 1600 detail.jpg
fetch 1FCPevUmzzT4HsVhXLvRysdxZCHtw-1iB 1600 evening-primary.jpg
fetch 1VnK8kaV4__D2qtKX7L9rF_JULqEmy2IR 1600 evening-secondary.jpg
fetch 12HbW3z3GAj_eM7osr6FcuWWEU2sGVsIf 1800 auction-atmosphere.jpg

echo
echo "Saved to public/gala:"
ls -lh public/gala
echo
echo "Next: npm run build, check /gala renders the hero, then commit public/gala."
