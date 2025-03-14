# Idle Ant Farm v2

A modern idle/incremental game built with Vue 3, TypeScript, and Tailwind CSS. Manage your ant colony, upgrade your production, and evolve to become the ultimate ant civilization!

## Features

- **Vue 3** with [Pinia](https://pinia.vuejs.org/) for state management and [vue-router](https://router.vuejs.org/) for routing
- **TypeScript** for type safety and better developer experience
- **Tailwind CSS** with the official `typography` plugin and automatic icons using [@egoist/tailwindcss-icons](https://github.com/egoist/tailwindcss-icons)
- **break_infinity.js** for handling large numbers common in idle games
- **Offline progress** calculation and persistence
- **Comprehensive tooling** including TypeScript, PostCSS, ESLint, Biome, Prettier, and EditorConfig
- **Full testing setup** with Vitest (components) and Playwright (e2e)

## Game Features

### Core Mechanics

- **Colony Lifecycle**: The game operates on a natural cycle system, with each foraging cycle advancing your colony's growth.
- **Resource management**: Gather food and materials to expand your colony and support your ant population.
- **Ant Hierarchy**: From worker ants to entire colonies, each level of your ant society has unique roles and capabilities.
- **Evolution System**: Evolve your colony through metamorphosis to gain evolution points and permanent genetic adaptations.

### Ant Hierarchy

The game features a multi-tiered ant society:

- **Worker Ants**: Basic resource gatherers that forage for food
- **Nurseries**: Produce worker ants automatically through egg hatching
- **Queen Chambers**: Higher-tier production centers where new queens develop
- **Colonies**: Top-tier expansion that represents entire new ant settlements

Each tier:

- Requires resources to establish and expand
- Produces either resources or lower-tier ants
- Can be enhanced through specialized adaptations
- Features unique growth mechanics based on ant biology

### Adaptation System

Two types of adaptations enhance your colony:

1. **Colony Adaptations**:

   - Specific to each ant type
   - Developed through specialized training and experience
   - Provide multipliers to foraging efficiency or other bonuses
   - Ant specialization unlocks new adaptation possibilities

2. **Evolutionary Adaptations**:
   - Permanent genetic changes purchased with evolution points
   - Persist through metamorphosis cycles
   - Provide powerful species-wide improvements
   - Strategically enhance different aspects of colony life

### Metamorphosis System

The evolution system allows you to reset your progress for permanent benefits:

- **Foraging Cycles**: Complete natural cycles of gathering and growth to progress toward colony metamorphosis
- **Evolution Points (EP)**: Earned when evolving, representing genetic improvements to your ant species
- **Adaptation Requirements**: Evolution requirements increase with each metamorphosis following natural selection principles
- **Strategic Metamorphosis**: Decide when to trigger metamorphosis based on diminishing returns of your current colony

### Colony Mathematics

The game uses sophisticated biological models:

- **Resource Scaling**: `cost = baseCost * (growthRate ^ currentLevel)` - representing the increasing difficulty of supporting larger populations
- **Foraging Efficiency**: Base production modified by multiple factors including ant adaptations and evolutionary traits
- **Genetic Advancement**: Evolution points calculated based on food gathered, foraging cycles completed, and colony size
- **Hibernation Calculations**: Simulates colony advancement during periods of inactivity, with configurable settings

### Colony Memory

- **Pheromone Trails**: Colony state is automatically preserved every minute through chemical signals
- **Genetic Memory**: Export and import colony data as encoded information
- **Hibernation Progress**: Calculate and apply progress made while the colony was dormant
- **Colony Management**: Reset colony, manage settings, and backup colony data

## Development

### Debug Mode

The game includes a debug mode for development purposes. In debug mode, you can:

- Adjust game speed (0.5x to 100x) to speed up testing
- Access additional debugging features

Debug mode is enabled by default in the development environment and disabled in production.

### Environment Variables

The following environment variables can be configured:

- `VITE_DEBUG_MODE`: Set to "true" to enable debug mode
- `VITE_VERSION`: The current version of the game

### Prerequisites

- Node.js (v18+)
- pnpm (recommended) or npm

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

### Project Structure

- `src/components/` - Reusable Vue components
- `src/pages/` - Page components (routes)
- `src/stores/` - Pinia stores for state management
  - `gameStore.ts` - Core colony lifecycle and foraging cycle management
  - `generatorStore.ts` - Ant hierarchy definitions and production logic
  - `generatorUpgradeStore.ts` - Colony adaptation system
  - `prestigeStore.ts` - Metamorphosis and evolution mechanics
  - `saveSystem.ts` - Colony memory functionality and hibernation progress
- `src/utils/` - Utility functions, including decimal handling
- `src/assets/` - Static assets and global CSS
- `src/layouts/` - Layout components

## Credits

This project is built on the [Vite + Vue 3 + TypeScript + Tailwind Starter](https://github.com/Uninen/vite-ts-tailwind-starter) template by [Uninen](https://twitter.com/uninen).

## License

[MIT License](./LICENSE)
