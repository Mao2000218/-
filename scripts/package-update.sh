#!/bin/bash
# Package web assets for OTA hot update
# Usage: ./scripts/package-update.sh [version]
# Places output in update/ directory. Upload both files to your CDN.

set -e

VERSION="${1:-v26.5.4}"
DIST_DIR="dist"
UPDATE_DIR="update"

echo "=== FitTrack OTA Update Packager ==="
echo "Version: $VERSION"

# Build web assets
echo "Building web assets..."
npm run build

# Create update directory
rm -rf "$UPDATE_DIR"
mkdir -p "$UPDATE_DIR"

# Copy version info into dist
cat > "$UPDATE_DIR/version.json" <<EOF
{
  "version": "$VERSION",
  "buildTime": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "url": "update.zip"
}
EOF

# Create zip
echo "Creating update package..."
cd "$DIST_DIR"
zip -r "../$UPDATE_DIR/update.zip" ./*
cd ..

SIZE=$(du -b "$UPDATE_DIR/update.zip" | cut -f1)
echo "Package size: $SIZE bytes"

# Update version.json with size
python3 -c "
import json
with open('$UPDATE_DIR/version.json') as f:
    d = json.load(f)
d['size'] = $SIZE
with open('$UPDATE_DIR/version.json', 'w') as f:
    json.dump(d, f, indent=2)
" 2>/dev/null || true

echo ""
echo "=== Done ==="
echo "Files created in update/ directory:"
echo "  1. $UPDATE_DIR/version.json"
echo "  2. $UPDATE_DIR/update.zip"
echo ""
echo "Next: git add update/ && git commit -m 'OTA update' && git push"
echo "CDN URL: https://cdn.jsdelivr.net/gh/Mao2000218/-@main/update/version.json"
