#!/usr/bin/env bash
# Baixa capas (og:image) dos projetos Behance da Layane para public/images/projects/
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/images/projects"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

mkdir -p "$OUT"

fetch_cover() {
  local slug="$1"
  local url="$2"
  local out="$OUT/${slug}.jpg"

  echo "→ $slug"
  local html
  html=$(curl -sL -A "$UA" --max-time 30 "$url" || true)
  local img
  img=$(echo "$html" | grep -oE 'property="og:image" content="[^"]+"' | head -1 | sed 's/.*content="//;s/"$//')

  if [[ -z "$img" ]]; then
    echo "  ✗ og:image não encontrado"
    return 1
  fi

  curl -sL -A "$UA" --max-time 60 "$img" -o "$out"
  echo "  ✓ $out"
}

fetch_cover "desmenia-treasure-map" "https://www.behance.net/gallery/146168111/Desmenia-Treasure-Map"
fetch_cover "simbionte-fantasy-map" "https://www.behance.net/gallery/151649863/Simbionte-Fantasy-Map"
fetch_cover "meronte-fantasy-map" "https://www.behance.net/gallery/180469333/Meronte-Fantasy-Map"
fetch_cover "where-i-have-been" "https://www.behance.net/gallery/146171883/Where-I-Have-Been-Travel-Posters-Stickers"
fetch_cover "toscana-travel-map" "https://www.behance.net/gallery/179947649/Toscana-Travel-Map"
fetch_cover "lithgow-touristic-map" "https://www.behance.net/gallery/178592631/Lithgow-Touristic-Map"
fetch_cover "south-africa-sticker" "https://www.behance.net/gallery/181920727/South-Africa-Sticker"
fetch_cover "lets-be-friends-book-cover" "https://www.behance.net/gallery/156653943/Lets-Be-Friends-Book-Cover"
fetch_cover "hands-of-time-poster" "https://www.behance.net/gallery/150436491/Hands-of-Time-Poster"
fetch_cover "cowboy-camp-sticker" "https://www.behance.net/gallery/184251627/Cowboy-Camp-Sticker"
fetch_cover "vila-pattern" "https://www.behance.net/gallery/144405529/Vila-Pattern"

echo "Concluído."
