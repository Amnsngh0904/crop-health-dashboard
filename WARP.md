# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Framework: Next.js 14 (App Router) with React 18 and TypeScript
- Styling: Tailwind CSS v4 via PostCSS plugin
- Package manager: pnpm
- Deploy target: Vercel (project README references a live Vercel deployment)
- Minimum Node.js version: 18+
- Important build config (next.config.mjs):
  - ESLint errors are ignored during builds (eslint.ignoreDuringBuilds: true)
  - TypeScript errors are ignored during builds (typescript.ignoreBuildErrors: true)
  - Images are unoptimized (images.unoptimized: true)

Common commands
- Install dependencies
  ```bash path=null start=null
  pnpm install
  ```
- Start the dev server (defaults to port 3000)
  ```bash path=null start=null
  pnpm dev
  ```
  - Use a different port (example: 3001)
    ```bash path=null start=null
    pnpm dev -- -p 3001
    ```
- Build for production
  ```bash path=null start=null
  pnpm build
  ```
- Run the production server (after build)
  ```bash path=null start=null
  pnpm start
  ```
- Lint
  ```bash path=null start=null
  pnpm lint
  ```
- Type-check (useful because builds ignore TS errors)
  ```bash path=null start=null
  pnpm exec tsc --noEmit
  ```
- Clear Next.js build cache (useful for troubleshooting builds)
  ```bash path=null start=null
  rm -rf .next
  ```

Tests
- No test runner or test scripts are currently configured (no Jest/Vitest/Playwright/Cypress configs found; no test script in package.json). Add test tooling before expecting test commands (including running a single test).

High-level architecture and structure
- App Router structure (app/)
  - Routing and layouts live in the app/ directory (as described in README). Server Components are the default in Next.js App Router; Client Components should be marked with "use client" where needed.
- UI components (components/)
  - Reusable React components shared across routes.
- Utilities (lib/)
  - General-purpose helpers and shared logic for fetching, formatting, validation, etc.
- Static assets (public/)
  - Publicly served assets (images, icons, etc.).
- TypeScript configuration (tsconfig.json)
  - Path alias: "@/*" -> project root (import from '@/components/...' etc.).
  - Strict mode enabled; however, build does not fail on type errors due to Next.js config noted above.
- Styling pipeline
  - Tailwind CSS v4 is enabled via PostCSS (postcss.config.mjs uses '@tailwindcss/postcss'). No dedicated tailwind.config file is required for default usage in v4.
- Linting
  - Linting is available via Next.js' built-in ESLint integration (pnpm lint). Builds ignore ESLint errors per configuration; run lint explicitly to surface issues locally/CI.

Notable from README.md
- Live deployment: https://crop-health-dashboard-ten.vercel.app/
- Local setup: Node 18+, pnpm, and basic startup flow (install -> dev). The README includes troubleshooting tips for port conflicts and clearing caches.
