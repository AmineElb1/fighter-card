# 🐛 Troubleshooting - Zwart Scherm Fix

## Probleem: Scherm wordt zwart na refresh

### 🔍 Debug Stappen:

1. **Open Browser Console**
   - Chrome/Edge: `F12` of `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
   - Firefox: `F12` of `Cmd+Option+K` (Mac)
   - Kijk naar de Console tab voor errors

2. **Check for Errors**
   - Zoek naar rode error messages
   - Let op 404 errors (files not found)
   - Kijk naar WebGL errors

3. **Common Issues**:

#### ❌ WebGL Error
```
Error: WebGL not supported
```
**Fix**: Update je browser of check GPU settings

#### ❌ Model Loading Error
```
Error loading model: 404 Not Found
```
**Fix**: Model bestand bestaat niet of verkeerde path

#### ❌ Memory Error
```
Out of memory
```
**Fix**: Te grote models, comprimeer ze eerst

---

## 🔧 Quick Fixes

### Fix 1: Hard Refresh
```bash
# Mac
Cmd + Shift + R

# Windows/Linux  
Ctrl + Shift + R
```

### Fix 2: Clear Cache
```bash
# In browser console:
localStorage.clear();
sessionStorage.clear();
# Then refresh
```

### Fix 3: Restart Dev Server
```bash
# Stop server (Ctrl+C)
cd fighter-game/frontend
npm run dev
```

### Fix 4: Disable 3D Models Temporarily
Open `src/components/3d/GameScene3D.tsx` en vervang:
```typescript
import Fighter3D from './Fighter3D';  // ✅ Use this (placeholders)
// import Fighter3D from './Fighter3DWithModel';  // ❌ Comment this out
```

---

## 📊 Performance Check

### Check FPS in Console:
```javascript
// Run in browser console:
let lastTime = performance.now();
let frames = 0;
function checkFPS() {
  frames++;
  const now = performance.now();
  if (now >= lastTime + 1000) {
    console.log(`FPS: ${frames}`);
    frames = 0;
    lastTime = now;
  }
  requestAnimationFrame(checkFPS);
}
checkFPS();
```

**Verwachte FPS**: 60fps
**Minimum FPS**: 30fps
**Onder 30fps**: Models zijn te zwaar, optimaliseer ze

---

## 🎮 Model Issues

### Model te groot?
```bash
# Check model size:
ls -lh public/models/fighters/*.glb

# If > 10MB, it's too big!
```

### Optimize Large Models:
```bash
# Install gltf-pipeline
npm install -g gltf-pipeline

# Compress model
gltf-pipeline -i large-model.glb -o optimized-model.glb --draco.compressionLevel=7
```

---

## 🚨 Emergency: Switch to Safe Mode

Edit `src/store/gameStore.ts`, find `initializeGame` and add this at the top:
```typescript
// SAFE MODE: Simple rendering only
console.log('🔒 SAFE MODE ACTIVE');
return;
```

Dit disabled alle game logic en laat alleen de basic scene zien.

---

## 📝 Report Issue

Als het nog steeds niet werkt, stuur me:

1. **Browser Console Output** (copy/paste alle errors)
2. **Browser & Versie** (bijv. Chrome 119)
3. **Operating System** (Mac/Windows/Linux)
4. **Model File Sizes** (`ls -lh public/models/fighters/`)

---

## ✅ Verification Checklist

- [ ] Browser console open (F12)
- [ ] No red errors in console
- [ ] Models < 10MB each
- [ ] Internet connection active
- [ ] GPU acceleration enabled
- [ ] Latest browser version
- [ ] Dev server running (npm run dev)

**Als alles checked is en het nog steeds niet werkt, laat het me weten!** 🚀