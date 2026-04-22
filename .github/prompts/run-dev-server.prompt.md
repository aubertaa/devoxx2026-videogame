---
description: 'Run the local Vite development server with hot module replacement to rapidly iterate and debug a Phaser game in the browser when starting development, testing hot-reload changes, or troubleshooting scenes.'
agent: 'agent'
---

# Run Development Server

Start the local Vite development server with hot module replacement for rapid game development iteration.

## When to Use

- Starting local development on the game
- Testing changes with hot reload
- Debugging game scenes in the browser

## Checkpoints

- Are dependencies installed (`npm install` completed)?
- Is port 5173 (Vite default) available?

## Steps

### 1. Start Development Server

Run the development server:

```bash
npm run dev
```

### 2. Access the Game

Open browser to the URL shown in terminal (typically http://localhost:5173).

### 3. Development Workflow

- Edit TypeScript/Vue files and see changes hot-reload
- Use browser DevTools for debugging Phaser scenes
- Check console for EventBus messages and scene transitions
