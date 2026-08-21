# Chess clock

A desktop chess clock built with React, TypeScript, and Tauri.

---

## Features
- two-player chess clock
- preset and custom time controls
- optional Fischer increment
- pause and resume buttons
- timeout handling
- low-time precision with visual feedback
- keyboard controls
- native desktop window controls
- responsive window sizing

## Controls
- `A` - white finishes their move
- `L` - black finishes their move
- `Space` - pause/resume

## Time controls
The clock includes multiple presets:

- `1+0`
- `3+0`
- `3+2`
- `5+0`
- `5+3`
- `10+0`
- `15+10`

There is also the option to configure custom time controls with a starting time and a Fischer increment.

## Tech stack
- React
- TypeScript
- Vite
- Tauri
- Rust

## Development
Install dependencies:
```bash
npm install
```

Run the dektop app in development:
```bash
npm run tauri dev
```

Build the desktop app:
```bash
npm run tauri build
```