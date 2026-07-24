# Frontend Lovable Cleanup Design

## Overview
The goal is to remove all proprietary Lovable wrappers and configurations from the TanStack Start frontend, converting it into a standard open-source Vite + React + TanStack Start setup. Finally, we will test the local frontend against our existing Spring Boot backend.

## Approach
We are using **Option A (Standard TanStack Start)** to preserve the Server-Side Rendering (SSR) capabilities and existing routing structure.

### 1. Dependency & File Cleanup
- **Remove Packages**: 
  - `@lovable.dev/vite-tanstack-config`
  - `lovable-tagger`
- **Remove Folders**: Delete the `.lovable` directory at the project root.
- **Remove Code**: 
  - Delete `src/lib/lovable-error-reporting.ts`.
  - Remove imports and usages of `lovable-error-reporting` from `src/routes/__root.tsx`.

### 2. Vite Reconfiguration
Rewrite `vite.config.ts` from scratch to drop `@lovable.dev/vite-tanstack-config`. The new configuration will explicitly declare the required plugins for a standard TanStack Start application:
- `@tanstack/react-start/plugin` (specifically `tanstackViteConfig` or standard start plugin depending on latest API)
- `@tailwindcss/vite` for styling.
- `vite-tsconfig-paths` for path alias resolution (`@/*`).

### 3. End-to-End Testing
- **Backend Setup**: The Spring Boot application (`portfolio-backend`) will be started on `localhost:8080`.
- **Frontend Setup**: Start the Vite dev server (`bun run dev` or `npm run dev`).
- **Validation**:
  - Open the frontend in the browser.
  - Trigger the Cmd+K command palette chat.
  - Send a message to verify that the chat streams from `http://localhost:8080/api/chat/stream`.
