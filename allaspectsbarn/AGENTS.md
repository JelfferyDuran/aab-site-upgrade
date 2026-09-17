<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# All Aspects at the Barn — project rules

The canonical production application is this `allaspectsbarn/` Next.js app. Root-level legacy HTML/CSS files are historical reference only unless a task explicitly says otherwise.

Before substantial work:

1. Read `README.md` for architecture and verification commands.
2. Read `NEXT.md` for the current prioritized execution queue.
3. Read the repository-root `HANDOFF.md` when project history or deployment context matters.
4. Use the version-matched Next.js docs required by the managed block above.

Architecture rules:

- Prefer Server Components. Add `"use client"` only at the smallest interactive boundary.
- Do not import `src/data/products.json` into a Client Component. Catalog data belongs behind `src/lib/catalog.ts` and the `/api/products` query boundary.
- Stable business identity belongs in `src/lib/site.ts`; do not duplicate phone, email, address, social URLs, or canonical origin across components.
- Preserve AAB's real indigo brand system and real photography. Inspiration may inform layout rhythm, never client identity or copied expressive assets.
- Product pages and routes are high-volume data-driven surfaces. Treat slug stability and product-image integrity as compatibility requirements.
- Avoid adding dependencies for effects that CSS or existing project dependencies can handle.
- Respect `prefers-reduced-motion` for all non-essential motion.

Verification rules:

- Normal iteration: `npm run check:quick`.
- Before a PR is considered ready: `npm run check`.
- Before deployment or changes to routing/data/build configuration: `npm run build`.
- Never silence type, lint, content-integrity, or build failures just to make CI green; fix the source problem.

Handoff rule:

When a meaningful architectural decision changes, update `README.md`, `NEXT.md`, or root `HANDOFF.md` in the same change so the next agent does not have to rediscover it.
