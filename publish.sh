#!/bin/bash
# Publishing script for JavaScript/TypeScript SDK

set -e

echo "📦 Publishing QRNG JavaScript SDK to npm"
echo "========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must run from sdks/javascript directory"
    exit 1
fi

# Clean and build
echo "🧹 Cleaning build directory..."
npm run clean

echo "📦 Installing dependencies..."
npm ci

echo "🔨 Building package..."
npm run build

# Dry run
echo "✅ Testing publish (dry run)..."
npm publish --dry-run

echo ""
echo "📋 Package ready for publishing!"
echo ""
read -p "Publish to npm? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "⬆️  Publishing to npm..."
    npm publish --access public
    
    echo ""
    echo "✅ Successfully published to npm!"
    echo "   Install: npm install @qrng/sdk"
    echo "   Verify: node -e \"const { QRNGClient } = require('@qrng/sdk'); console.log(QRNGClient);\""
else
    echo "❌ Aborted"
fi
