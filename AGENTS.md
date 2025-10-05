# Repository Guidelines

## Project Structure & Module Organization
The Nuxt app lives in `app/`, where `app.vue` bootstraps shared layout and routing. Create feature areas inside `app/components`, `app/pages`, and `app/composables` to keep view logic, routed pages, and reusable hooks separated. Static files (icons, fonts, manifest) belong in `public/`. Project-wide settings live in `nuxt.config.ts`, `tsconfig.json`, and `eslint.config.mjs`; update them alongside structural changes and never commit the generated `.nuxt/` directory.

## Build, Test, and Development Commands
Run `pnpm install` after cloning to sync dependencies. Start the hot-reload dev server with `pnpm dev`. Produce an optimized bundle via `pnpm build`, then validate it locally with `pnpm preview`. Use `pnpm generate` when exporting a static site for edge/CDN hosting. Re-run `pnpm install` if dependencies change in pull requests.

## Coding Style & Naming Conventions
Prefer `<script setup lang="ts">` in Vue single-file components with 2-space indentation. Name Vue files with `PascalCase.vue`, composables as `useThing.ts`, and utility modules in `camelCase.ts`. Keep stateful logic inside composables rather than components. Run `pnpm eslint .` before pushing; the config extends `@nuxt/eslint` and aligns with the repository TypeScript settings.

## Testing Guidelines
Author interaction and rendering tests under `tests/` using `*.spec.ts`. Leverage `@nuxt/test-utils` with Vitest runners by executing `pnpm nuxi test`. Cover core todo scenarios—creation, filtering, persistence—to prevent regressions. Introduce minimal fixtures under `tests/fixtures` and document edge cases directly in the test descriptions for clarity.

## Commit & Pull Request Guidelines
Write small, focused commits using the imperative mood, e.g., `feat: add priority selector`. Reference issue IDs when applicable and avoid bundling unrelated changes. Pull requests should describe intent, list manual or automated checks (`pnpm dev`, `pnpm nuxi test`, `pnpm eslint .`), and include screenshots or GIFs for UI tweaks. Keep branches rebased on `main` and confirm lint/tests locally before requesting review.

## Environment & Configuration Tips
Store secrets in `.env` files ignored by Git, and update `.env.example` with safe defaults whenever you add configuration keys. Restart `pnpm dev` after editing TypeScript config or env files to refresh generated types. For deployment, verify that runtime environment variables are mirrored in the hosting platform.
