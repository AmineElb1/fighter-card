# Fighter Portraits - Upload Guide

## 📸 Benodigde Portrait Images

Upload de volgende 3 portrait afbeeldingen naar `/public/`:

### 1. Ninja Portrait
- **Bestandsnaam:** `ninja-portrait.png`
- **Locatie:** `/Users/amineelboujadaini/Desktop/Innovation/frontend-course/fighter-game/frontend/public/ninja-portrait.png`
- **Afmetingen:** Aanbevolen 300x400 pixels (3:4 ratio)
- **Format:** PNG (ondersteunt transparantie)

### 2. Ortiz Portrait
- **Bestandsnaam:** `ortiz-portrait.png`
- **Locatie:** `/Users/amineelboujadaini/Desktop/Innovation/frontend-course/fighter-game/frontend/public/ortiz-portrait.png`
- **Afmetingen:** Aanbevolen 300x400 pixels (3:4 ratio)
- **Format:** PNG (ondersteunt transparantie)

### 3. Boss Portrait
- **Bestandsnaam:** `boss-portrait.png`
- **Locatie:** `/Users/amineelboujadaini/Desktop/Innovation/frontend-course/fighter-game/frontend/public/boss-portrait.png`
- **Afmetingen:** Aanbevolen 300x400 pixels (3:4 ratio)
- **Format:** PNG (ondersteunt transparantie)

## 📋 Checklist

- [ ] Upload `ninja-portrait.png` naar `/public/`
- [ ] Upload `ortiz-portrait.png` naar `/public/`
- [ ] Upload `boss-portrait.png` naar `/public/`
- [ ] Test de fighter selection screen
- [ ] Controleer of alle portraits correct laden

## 🎨 Tips voor de Portraits

- Gebruik een **verticale oriëntatie** (portret formaat)
- **Hoogte 400px, breedte 300px** werkt perfect
- Zorg dat het **gezicht/hoofd** goed zichtbaar is in de bovenkant
- Gebruik een **contrasterende achtergrond** voor goede zichtbaarheid
- PNG format wordt aanbevolen voor transparantie

## 🔄 Fallback

Als een image niet gevonden wordt, toont de component automatisch een placeholder SVG met een "?" symbool. De game blijft gewoon werken!

## ✅ Wat is er veranderd

### Fighter Updates
1. **Steve** → hernoemd naar **Ninja**
2. **Boss** toegevoegd als derde fighter
3. Alle fighters hebben nu dezelfde stats (zoals gevraagd)
4. Element types (Fire, Earth, etc.) zijn verwijderd

### Fighter Roster
```
1. Ninja - Swift ninja warrior
2. Ortiz - Fierce brawler  
3. Boss  - Ultimate fighter
```

### Stats (allen gelijk voor nu)
- Attack: 80-90
- Defense: 75-85
- Speed: 75-85

### Card Decks
Elke fighter heeft zijn eigen 3 unieke cards:
- **Ninja:** Shadow Punch, Ninja Kick, Shadow Guard
- **Ortiz:** Quick Strike, Power Kick, Defensive Stance
- **Boss:** Boss Punch, Boss Kick, Boss Guard

Card textures:
- Ninja: `/ninjaPunch.png`, `/ninjaKick.png`, `/ninjaDefence.png`
- Ortiz: `/ortizPunch.png`, `/ortizKick.png`, `/ortizDefence.png`
- Boss: `/bossPunch.png`, `/bossKick.png`, `/bossDefence.png`

## 🚀 Na het uploaden

1. Vernieuw je browser (Cmd+R of F5)
2. Ga naar het start menu
3. Klik "Play Solo"
4. Je ziet nu je 3 fighters met de geüploade portraits!

## 💡 Snelle Upload via Terminal

Als je de images al hebt:
```bash
# Ga naar de public folder
cd /Users/amineelboujadaini/Desktop/Innovation/frontend-course/fighter-game/frontend/public

# Kopieer je images (pas paden aan naar jouw files)
cp ~/Downloads/ninja.png ./ninja-portrait.png
cp ~/Downloads/ortiz.png ./ortiz-portrait.png
cp ~/Downloads/boss.png ./boss-portrait.png
```

Of sleep de files gewoon in VS Code naar de `/public/` folder!
