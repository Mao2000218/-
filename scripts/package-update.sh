#!/bin/bash
# Package web assets for OTA hot update
# Usage: ./scripts/package-update.sh [version]
# Places output in update/ directory. Upload both files to your CDN.

set -e

VERSION="${1:-$(date +%Y%m%d%H%M%S)}"
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
echo "Upload these 2 files to your server:"
echo "  1. $UPDATE_DIR/version.json"
echo "  2. $UPDATE_DIR/update.zip"
echo ""
echo "Then set UPDATE_URL in the app to point to version.json"
