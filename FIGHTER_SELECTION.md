# Fighter Selection Screen

## Overview
A Street Fighter-style character selection screen has been added to the game. Players can now choose their fighters before battle!

## Features

### Visual Design
- **Grid Layout**: Fighters displayed in a 3x2 grid (expandable)
- **Hover Effects**: Smooth animations and glow effects when hovering over fighters
- **Selection Indicators**: Visual feedback showing which fighter is selected for P1 and P2
- **Stats Display**: Attack, Defense, and Speed bars for each fighter
- **VS Screen**: Shows both selected fighters before battle starts

### Fighter Roster
Currently available:
1. **Ortiz** - Fire element fighter (Strong attacker)
2. **Steve** - Earth element ninja (Balanced fighter)
3. **Fighter 3-6** - Coming soon (locked)

### Game Flow
1. Start Menu → Click "Play Solo" or "Play Online"
2. **Fighter Selection Screen** (NEW!)
   - Player 1 selects their fighter
   - Player 2/Bot selects their fighter
   - Can't select the same fighter twice
   - Shows stats and descriptions on hover
3. Loading Screen → Assets load
4. Combat Arena → Fight begins!

### Controls
- **Click** on a fighter portrait to select
- **Hover** to see detailed stats
- **RESET** button to clear selections
- **START FIGHT** button appears when both fighters are selected
- **BACK** button to return to main menu

## Creating Fighter Portraits

A portrait generator tool is included at `/public/create-portraits.html`

### To create portraits:
1. Open `create-portraits.html` in your browser
2. The tool generates 3 canvas portraits:
   - Ortiz (Fire fighter with red gradient)
   - Steve/Ninja (Earth fighter with green gradient)
   - Placeholder (Coming soon with lock icon)
3. Click the download buttons to save as PNG
4. Place the PNG files in `/public/` folder

### Portrait Specifications
- Size: 300x400 pixels
- Format: PNG with transparency support
- Naming: `{fighter-id}-portrait.png`
  - `ortiz-portrait.png`
  - `ninja-portrait.png`
  - `placeholder-portrait.png`

## Adding New Fighters

### Step 1: Add Fighter Data
Edit `FighterSelection.tsx` and add to the `fighters` array:

```typescript
{
  id: 'new-fighter',
  name: 'Fighter Name',
  displayName: 'DISPLAY NAME',
  portrait: '/new-fighter-portrait.png',
  element: 'Water',
  stats: { attack: 80, defense: 70, speed: 75 },
  description: 'Fighter description',
  locked: false // Set to true if not ready
}
```

### Step 2: Create Fighter Model
Add fighter model files to `/public/models/fighters/`:
- `{fighter-name}_base.fbx`
- `{fighter-name}_idle.fbx`
- `{fighter-name}_punch.fbx`
- `{fighter-name}_kick.fbx`
- `{fighter-name}_block.fbx`
- `{fighter-name}_victory.fbx`
- `{fighter-name}_defeat.fbx`

### Step 3: Update GameStore
Add fighter mapping in `gameStore.ts` → `initializeGame` → `getFighterData`:

```typescript
'new-fighter': { 
  name: 'Fighter Name', 
  element: ElementType.WATER, 
  id: 'fighter3' 
}
```

### Step 4: Create Card Deck
Add card deck in `gameStore.ts` → `createFighterDeck`:

```typescript
if (fighterName === 'Fighter Name') {
  const cards: Omit<MoveCard3D, 'id' | 'element' | 'glowColor'>[] = [
    // 3 unique cards for this fighter
  ];
  return cards.map((card, index) => ({
    ...card,
    id: `fightername_card_${index}`,
    element,
    glowColor
  }));
}
```

## Styling

The selection screen uses:
- **Glassmorphism** for cards (backdrop blur)
- **Gradient backgrounds** for element types
- **Pulse animations** for selected fighters
- **Shimmer effects** on stat bars
- **Glow effects** on hover
- **Responsive design** for different screen sizes

### Color Scheme
- Fire: `#ff4444` → `#cc0000`
- Earth: `#44ff44` → `#00cc00`
- Water: `#4444ff` → `#0000cc`
- Lightning: `#ff44ff` → `#cc00cc`
- Shadow: `#444444` → `#111111`
- Light: `#ffffff` → `#cccccc`

## Technical Details

### Component Structure
```
FighterSelection.tsx
├── Fighter Grid (3x2 cards)
│   ├── FighterCard
│   │   ├── Portrait Image
│   │   ├── Name
│   │   ├── Element Badge
│   │   └── Player Indicator (P1/P2)
│   └── ...
├── Fighter Details Panel
│   ├── FighterInfo (hover view)
│   │   ├── Name
│   │   ├── Description
│   │   └── Stat Bars (Attack/Defense/Speed)
│   └── VS Screen (both selected)
└── Footer Controls
    ├── Selection Status
    ├── Reset Button
    └── Confirm Button
```

### State Management
- `player1Selection`: Currently selected fighter ID for P1
- `player2Selection`: Currently selected fighter ID for P2
- `hoveredFighter`: Fighter being hovered (shows details)
- `isPlayer1Turn`: Tracks whose turn it is in multiplayer

### Props
```typescript
interface FighterSelectionProps {
  onSelectionComplete: (p1: string, p2: string) => void;
  onBack: () => void;
  gameMode: 'solo' | 'multiplayer';
}
```

## Solo vs Multiplayer Mode

### Solo Mode
- Player selects P1 fighter
- Player selects opponent fighter for the bot
- Both selections visible at once

### Multiplayer Mode
- Player 1 selects first (only their selection visible)
- Player 2 selects second (both selections now visible)
- Sequential selection process

## Future Enhancements

Possible additions:
- [ ] Fighter preview animations
- [ ] Character voice lines on selection
- [ ] Fighter backstories/lore
- [ ] Custom color schemes per fighter
- [ ] Random fighter button
- [ ] Fighter unlock system
- [ ] Character customization (skins, colors)
- [ ] Tournament brackets
- [ ] Leaderboards by fighter

## Troubleshooting

### Images not loading
- Check that portrait files are in `/public/` folder
- Verify filenames match exactly (case-sensitive)
- Clear browser cache
- Check browser console for 404 errors

### Selection not working
- Check that fighter is not locked
- Verify IDs match between component and gameStore
- Can't select same fighter twice

### Styling issues
- Import CSS: `import './FighterSelection.css'`
- Check for CSS conflicts with global styles
- Verify backdrop-filter browser support

## Browser Compatibility

Tested on:
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

Note: Backdrop-filter requires modern browser support.
