#!/bin/bash

# 🎮 Quick Model Setup Script
# This script helps you download and set up your first 3D model

echo "🎮 Fighter Game - 3D Model Setup"
echo "================================="

MODEL_DIR="./public/models/fighters"

# Create directory if it doesn't exist
mkdir -p "$MODEL_DIR"

echo ""
echo "📁 Model directory created: $MODEL_DIR"
echo ""

# Check if we have any models
MODEL_COUNT=$(find "$MODEL_DIR" -name "*.glb" | wc -l)

if [ "$MODEL_COUNT" -eq 0 ]; then
    echo "❌ No GLB models found in $MODEL_DIR"
    echo ""
    echo "🔽 To get started quickly:"
    echo "1. Visit: https://quaternius.com"
    echo "2. Download 'Ultimate Character Pack' (free)"
    echo "3. Extract and find GLB files"
    echo "4. Copy 1-2 GLB files to: $MODEL_DIR"
    echo "5. Rename them to: basic-warrior.glb, fire-warrior.glb, etc."
    echo ""
    echo "🚀 Alternative - Download a sample model:"
    echo "   curl -L 'https://models.readyplayer.me/64bfa15e0e72c63d7c3934b6.glb' -o '$MODEL_DIR/basic-warrior.glb'"
    echo ""
else
    echo "✅ Found $MODEL_COUNT GLB model(s):"
    find "$MODEL_DIR" -name "*.glb" -exec basename {} \;
    echo ""
    echo "🎮 To enable model loading:"
    echo "1. Edit: src/components/3d/GameScene3D.tsx"
    echo "2. Change: useModel={true} in Fighter3D component"
    echo "3. Restart: npm run dev"
fi

echo ""
echo "📖 For detailed instructions, see:"
echo "   ./public/models/MODEL_SETUP_GUIDE.md"
echo ""
echo "🔧 Test model loading with:"
echo "   npm run dev"
echo "   Open browser console and check for loading errors"