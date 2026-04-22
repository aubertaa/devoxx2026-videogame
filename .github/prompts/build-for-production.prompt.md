---
description: 'Generate an optimized production build of a Phaser game with `npm run build` and verify it via `dist/` and `npx vite preview` to ensure deploy-ready, minified, and correctly behaving bundles when preparing for deployment, creating a distributable build, or testing production behavior.'
agent: 'agent'
---

# Build for Production

Create an optimized production build of the Phaser game for deployment.

## When to Use

- Preparing the game for deployment
- Creating a distributable build
- Testing production bundle behavior

## Checkpoints

- Are all development changes committed?
- Have you tested the game in development mode?

## Steps

### 1. Run Production Build

Execute the build command:

```bash
npm run build
```

### 2. Verify Build Output

Check the `dist/` directory for:
- Minified JavaScript bundles
- Optimized assets
- Index HTML file

### 3. Test Production Build

Serve the build locally to verify:

```bash
npx vite preview
```
