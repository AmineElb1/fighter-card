# 🥊 3D Card-Based Fighting Game Platform# React + TypeScript + Vite



> *Where strategy meets combat in an immersive 3D martial arts experience*This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



A real-time multiplayer 3D fighting game that combines tactical card gameplay with martial arts-inspired combat mechanics in stunning 3D environments. Challenge friends, build custom fighting decks, and engage in cinematic 3D battles using React Three Fiber technology.Currently, two official plugins are available:



## ✨ Features- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### 🎮 **Core 3D Gameplay**

- **3D Card-Based Combat System**: Strategic turn-based battles in immersive 3D environments## React Compiler

- **Real-Time 3D Multiplayer**: Challenge friends with synchronized 3D combat animations

- **3D Fighter Models**: Fully animated 3D characters with martial arts move setsThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

- **Interactive 3D Deck Building**: Manipulate and preview cards in 3D space

- **Cinematic Combat Engine**: Complex damage calculation with stunning 3D visual effects## Expanding the ESLint configuration

- **Physics-Based Interactions**: Realistic card throwing and impact reactions

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

### 🤝 **Social Features**

- **Friend System**: Connect with other fighters and build your combat network```js

- **Direct Challenges**: Send instant fight invitations to online friendsexport default defineConfig([

- **Challenge Queue**: Accept or decline incoming battle requests  globalIgnores(['dist']),

- **Spectator Mode**: Watch live matches between other players  {

- **Battle History**: Track your combat record against specific opponents    files: ['**/*.{ts,tsx}'],

    extends: [

### 🏆 **Progression & Competition**      // Other configs...

- **Fighter Progression**: Level up and unlock new abilities and move cards

- **Tournament System**: Participate in structured competitive events      // Remove tseslint.configs.recommended and replace with this

- **Leaderboards**: Climb the ranks and compete for top fighter status      tseslint.configs.recommendedTypeChecked,

- **Achievement System**: Unlock rewards for combat milestones and accomplishments      // Alternatively, use this for stricter rules

- **Skill-Based Matchmaking**: Face opponents of similar skill levels      tseslint.configs.strictTypeChecked,

      // Optionally, add this for stylistic rules

### 🎨 **3D User Experience**      tseslint.configs.stylisticTypeChecked,

- **Immersive 3D Environments**: Fully rendered 3D arenas with dynamic lighting

- **Fluid 3D Animations**: Smooth fighter movements and combat sequences      // Other configs...

- **Interactive 3D UI**: Spatial user interfaces that blend with the 3D world    ],

- **Cinematic Camera Work**: Dynamic camera angles during combat    languageOptions: {

- **Visual Effects**: Particle systems, shader effects, and post-processing      parserOptions: {

- **Cross-Platform 3D**: Optimized 3D rendering for desktop and mobile WebGL        project: ['./tsconfig.node.json', './tsconfig.app.json'],

        tsconfigRootDir: import.meta.dirname,

## 🚀 Technology Stack      },

      // other options...

### **Frontend**    },

- **React 18** - Modern component-based UI framework  },

- **TypeScript** - Type-safe JavaScript development])

- **React Three Fiber** - React renderer for Three.js 3D graphics```

- **Three.js** - WebGL-based 3D graphics library

- **@react-three/drei** - Useful helpers and abstractions for R3FYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

- **@react-three/cannon** - Physics engine for 3D interactions

- **@react-three/postprocessing** - Visual effects and post-processing```js

- **Vite** - Fast build tool with 3D asset pipeline support// eslint.config.js

- **Tailwind CSS** - Utility-first CSS for UI overlaysimport reactX from 'eslint-plugin-react-x'

- **Zustand** - Lightweight state management (including 3D state)import reactDom from 'eslint-plugin-react-dom'

- **React Query** - Server state synchronization

- **Socket.io Client** - Real-time WebSocket communicationexport default defineConfig([

  globalIgnores(['dist']),

### **Backend**  {

- **Node.js** - JavaScript runtime environment    files: ['**/*.{ts,tsx}'],

- **Fastify** - High-performance web framework    extends: [

- **TypeScript** - Type-safe backend development      // Other configs...

- **Socket.io** - Real-time bidirectional communication      // Enable lint rules for React

- **JWT** - Secure authentication tokens      reactX.configs['recommended-typescript'],

- **Bcrypt** - Password hashing and security      // Enable lint rules for React DOM

      reactDom.configs.recommended,

### **Database & Cache**    ],

- **PostgreSQL** - Primary relational database    languageOptions: {

- **Drizzle ORM** - Type-safe database toolkit      parserOptions: {

- **Redis** - Caching and session storage        project: ['./tsconfig.node.json', './tsconfig.app.json'],

- **Drizzle Kit** - Database migrations and management        tsconfigRootDir: import.meta.dirname,

      },

## 🛠️ Installation & Setup      // other options...

    },

### **Prerequisites**  },

- Node.js 18+ ])

- Docker and Docker Compose```

- PostgreSQL 15+
- Redis 7+

### **Quick Start**

```bash
# Option 1: Use root-level scripts (recommended)
npm run install-frontend    # Install frontend dependencies
npm run dev                 # Start development server

# Option 2: Navigate to frontend directory
cd frontend
npm install
npm run dev

# The application will be available at:
# Frontend: http://localhost:5173
```

### **3D Development Setup**

```bash
# Navigate to frontend directory
cd frontend

# Install 3D dependencies
npm install @react-three/fiber @react-three/drei @react-three/cannon three

# Install TypeScript types for Three.js
npm install -D @types/three

# Start development with 3D scene
npm run dev
```

## 🎯 Game Rules & Combat System

### **Basic Combat Flow**
1. **Match Setup**: Two players join a 3D arena with their selected fighter and deck
2. **Turn Structure**: Players alternate turns in 3D space, each starting with 3 energy points
3. **3D Card Play**: Select and throw move cards in 3D space (each card costs energy)
4. **3D Damage Resolution**: Combat engine calculates damage with 3D visual effects
5. **Victory Condition**: First player to reduce opponent's health to 0 wins with cinematic victory sequence

### **Fighting Styles**
- **🥋 Karate**: Balanced offense and defense with precision 3D strikes
- **🥊 Boxing**: High-damage 3D punches with strong counter abilities
- **🦵 Muay Thai**: Powerful 3D kicks and knee strikes with clinch moves
- **🤼 Wrestling**: 3D grappling moves and ground control techniques
- **🗡️ Mixed Martial Arts**: Versatile 3D style combining multiple disciplines

## 🏗️ Project Structure

```
fighter-game/
├── frontend/               # React TypeScript frontend
│   ├── src/               # Source code
│   │   ├── components/    # Reusable UI components
│   │   │   ├── 3d/       # React Three Fiber components
│   │   │   └── ui/       # Traditional React components
│   │   ├── pages/        # Page components and routing
│   │   ├── hooks/        # Custom React hooks
│   │   ├── store/        # Zustand state management
│   │   ├── services/     # API and WebSocket services
│   │   ├── types/        # TypeScript type definitions
│   │   └── utils/        # Utility functions
│   ├── public/           # Public assets
│   ├── package.json      # Frontend dependencies
│   └── vite.config.ts    # Vite configuration
├── backend/               # Node.js TypeScript backend (to be implemented)
├── docs/                 # Documentation and architecture
├── assets/              # 3D models, textures, and static assets
├── README.md            # Project documentation
└── TODO.md             # Development roadmap
```

## 🤝 Contributing

We welcome contributions from the fighting game and web development communities!

## 📈 Roadmap

See our [TODO.md](./TODO.md) for detailed feature planning and development roadmap.

### **Current Status: 3D MVP Development**
- ✅ 3D Architecture and project planning
- 🚧 React Three Fiber environment setup
- 📋 3D combat mechanics
- 📋 Real-time 3D multiplayer
- 📋 3D deck building system

---

**Ready to fight in 3D?** Challenge friends, master your deck, and become the ultimate digital martial artist! 🥋⚔️