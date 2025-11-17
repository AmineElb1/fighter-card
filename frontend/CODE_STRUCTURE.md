# 📁 Code Structure - Fighter Game

> **Opgeschoonde en geoptimaliseerde project structuur**  
> Alle ongebruikte componenten zijn verwijderd voor betere onderhoudbaarheid.

---

## 🎯 Project Overzicht

Dit is een **turn-based 3D fighting game** gebouwd met React, TypeScript, Three.js en React Three Fiber. Het spel bevat een volledig werkend combat systeem met kaarten, animaties en health management.

---

## 📂 Directory Structuur

```
frontend/src/
├── components/
│   ├── 3d/                    # 3D Game Components
│   │   ├── CardHand.tsx       # ✅ Card display en selectie
│   │   ├── CardHand.css       # ✅ Card styling
│   │   ├── CombatArena.tsx    # ✅ 3D Arena met ring en omgeving
│   │   ├── Fighter3D.tsx      # ✅ Fallback fighter (placeholder boxes)
│   │   ├── FighterFBXAnimated.tsx  # ✅ Main fighter component met FBX models
│   │   ├── GameScene3D.tsx    # ✅ Main 3D scene met Canvas, lighting, physics
│   │   ├── LoadingBox.tsx     # ✅ Loading indicator box
│   │   └── LoadingFallback.tsx # ✅ Loading fallback component
│   │
│   ├── ui/                    # 2D UI Components
│   │   ├── CombatController.tsx  # ✅ Turn management en combat flow
│   │   └── CombatController.css  # ✅ Combat UI styling
│   │
│   └── ErrorBoundary.tsx      # ✅ Error handling wrapper
│
├── store/
│   └── gameStore.ts           # ✅ Zustand state management (combat logic)
│
├── types/
│   └── game.ts                # ✅ TypeScript interfaces en types
│
├── App.tsx                    # ✅ Root app component
├── App.css                    # ✅ Global app styles
├── main.tsx                   # ✅ React entry point
└── index.css                  # ✅ Global CSS reset en base styles
```

---

## 🗑️ Verwijderde Bestanden (Cleanup)

De volgende bestanden zijn **verwijderd** omdat ze niet meer gebruikt worden:

### Oude Component Versies
- ❌ `AnimatedFighter.tsx` - Vervangen door FighterFBXAnimated
- ❌ `Fighter3DWithModel.tsx` - Oude implementatie
- ❌ `FighterFBX.tsx` - Vervangen door FighterFBXAnimated
- ❌ `ArenaModel.tsx` - Niet geïmporteerd, geen functie

### Debug Tools
- ❌ `AnimationTestMenu.tsx` - Animation tester (niet meer nodig)
- ❌ `AnimationTestMenu.css` - Styling voor tester

### Ongebruikte Utilities
- ❌ `hooks/useModels.ts` - Custom hook die nergens gebruikt wordt
- ❌ `assets/react.svg` - Default Vite logo
- ❌ `hooks/` folder - Compleet verwijderd (was leeg na cleanup)
- ❌ `assets/` folder - Compleet verwijderd (was leeg na cleanup)

---

## 🎮 Component Verantwoordelijkheden

### **3D Components**

#### `GameScene3D.tsx` - Main Scene Controller
- Canvas setup met camera en lighting
- Physics world initialization
- Fighter instantiation (Ortiz & Ninja)
- Arena rendering
- UI overlay orchestration

#### `FighterFBXAnimated.tsx` - Fighter Component
- FBX model loading met animations
- Animation playback (punch, kick, block, idle, defeat, victory)
- Health bar rendering boven fighter
- Combat action response (speelt animaties op basis van cards)
- Y-offset berekening voor correct ground placement

#### `Fighter3D.tsx` - Fallback Fighter
- Simple box geometry als placeholder
- Gebruikt wanneer FBX models niet beschikbaar zijn
- Health bar en naam label

#### `CombatArena.tsx` - Arena/Ring
- Boxing ring met ropes en posts
- Floor platform
- Basic physics boundary
- Ambient environment

#### `CardHand.tsx` - Card Display
- Toont 3 cards per fighter
- Card selection met hover effects
- Displays card type (⚔️ Attack / 🛡️ Defense)
- Shows damage/block values en stamina cost
- Visual feedback voor selected card

#### `LoadingBox.tsx` & `LoadingFallback.tsx`
- Loading states tijdens model loading
- Suspense fallback components

---

### **UI Components**

#### `CombatController.tsx` - Combat Management
- **Turn management**: Houdt bij wie er aan de beurt is
- **Phase tracking**: Card Selection → Combat → Resolution → Victory
- **Target selection**: UI voor het kiezen van opponent bij attack cards
- **Health display**: Toont health bars van beide fighters
- **Action buttons**: "Play Card", "End Turn", etc.
- **Victory screen**: Toont winnaar wanneer health = 0

---

### **State Management**

#### `gameStore.ts` - Zustand Store
**Game State:**
- Player data (2 fighters)
- Current turn & active player
- Game phase (card_selection, combat, resolution, victory)
- Arena configuration

**Combat Logic:**
- `playCard()` - Play attack or defense card
- `processCombatActions()` - Calculate damage with defense reduction
- `updateFighterHealth()` - Health management
- `setFighterAnimation()` - Trigger animations
- `endTurn()` - Clear defense buffs en switch players

**Fighter Animations:**
- Tracks current animation per fighter
- Defense state tracking (blocking reduces damage)

**Card System:**
- 3 cards per fighter:
  - Quick Strike (punch, 20 dmg)
  - Power Kick (kick, 35 dmg)
  - Defensive Stance (block, -15 dmg reduction)

---

### **Type Definitions**

#### `game.ts` - TypeScript Interfaces
- `Fighter3D` - Fighter properties (health, position, deck, animations)
- `MoveCard3D` - Card properties met **type** field ('attack' | 'defense')
- `CombatAction3D` - Action data voor combat processing
- `GameState3D` - Complete game state
- `GamePhase` - Phase enum
- Supporting types voor arena, lighting, effects, etc.

---

## 🎯 Game Flow

### 1️⃣ **Card Selection Phase**
- Active player selects a card from hand (bottom of screen)
- CombatController shows "Select a Card" message

### 2️⃣ **Target Selection** (Attack cards only)
- If attack card: CombatController shows target selection overlay
- Player clicks opponent to attack
- If defense card: plays immediately (no target needed)

### 3️⃣ **Combat Phase**
- `playCard()` creates a `CombatAction3D`
- `processCombatActions()` executes the action:
  - **Attack**: Triggers attacker animation, calculates damage (minus defense if active), updates health
  - **Defense**: Triggers block animation, stores defense value for next incoming attack
- Animation plays for 2 seconds

### 4️⃣ **Resolution Phase**
- "End Turn" button appears
- Player clicks to switch to opponent
- Defense buffs are cleared (only last 1 turn)

### 5️⃣ **Victory Phase**
- Triggered when a fighter's health reaches 0
- Defeat animation plays for loser
- Victory screen shows winner

---

## 🔧 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Three.js** - 3D graphics
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - 3D helpers (OrbitControls, Environment, etc.)
- **@react-three/cannon** - Physics engine
- **Zustand** - State management
- **Vite** - Build tool

---

## 📝 Ontwikkeling

### Run Development Server
```bash
cd frontend
npm run dev
```

### Build for Production
```bash
npm run build
```

### Type Check
```bash
npm run type-check
```

---

## 🎨 Styling Conventions

- **3D Components**: Geen CSS nodig (Three.js materials)
- **UI Components**: Dedicated `.css` files met component naam
- **Global Styles**: `index.css` voor resets en base styles
- **App Styles**: `App.css` voor layout en ui-overlay

---

## 🚀 Toekomstige Uitbreidingen

Mogelijke features (niet geïmplementeerd):
- More fighters met unieke animaties
- More card types (special abilities, combos)
- Sound effects en music
- Multiplayer over network
- Tournament mode
- Fighter customization
- Advanced AI opponent

---

**Last Updated:** 17 November 2025  
**Status:** ✅ Production Ready - Opgeschoond en geoptimaliseerd
