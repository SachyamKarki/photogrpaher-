# Project Architecture Protocol

This document outlines the standard file and folder organization protocols used across the **Rabinson Photography** monorepo. All developers checking into this project must follow these architectural conventions to guarantee code readability, scalability, and ease of onboarding.

## 🏗 High-Level Monorepo Architecture

The project leverages a standard monorepo structure.

```text
/
├── apps/
│   ├── web/        # Next.js 14+ Frontend
│   └── studio/     # Sanity V3 Headless CMS
├── .env            # SINGLE SOURCE OF TRUTH for environment variables
├── package.json    # Root scripts and workspace config
└── turbo.json      # (If applicable) Build orchestration
```

### Protocol Standards
- **Monorepo Separation of Concerns**: Do not mix CMS logic with Web Frontend logic. The `studio` strictly handles schema definitions, and the `web` strictly handles query execution and view logic.
- **Single Source of Truth for Environment Secrets**: All `.env` variables exist ONLY at the root (`/.env`). **Do not create `.env` files inside `apps/web` or `apps/studio`** unless explicitly creating an isolated CI pipeline.

---

## 🌐 Next.js Frontend Framework (`apps/web/src`)

We adhere to the official **Next.js App Router (13+)** conventions paired with a **Feature-Driven Component Architecture**.

```text
apps/web/src/
├── app/                  # Next.js App Router & Server routes
│   ├── (legal)/          # Grouped legal pages (TOS, Privacy)
│   ├── about/            # Example structural page route
│   └── page.tsx          # Root server component
├── components/           # UI Components co-located by Feature Domain
│   ├── brand/            # Partner logos, branding UI
│   ├── contact/          # WhatsApp + NodeMailer forms
│   ├── gallery/          # Masonry layers & lightbox logic
│   ├── home/             # Strict Home-page layout segments
│   ├── layout/           # Sitewide structural layout (Nav/Footer)
│   └── ui/               # Reusable primitive blocks (Buttons/Skeletons)
├── lib/                  # Extracted business logic & API gateways
│   ├── email/            # Nodemailer transport configurations
│   ├── gallery/          # Image fetching & processing pipelines
│   ├── portfolio/        # Static data & static fallback models
│   └── sanity/           # CMS Configs & Queries
└── types/                # Sitewide shared TypeScript `.d.ts` schemas
```

### Protocol Standards
1. **Component Bucket Coherence**: A component must only be placed in `components/ui` if it is totally generic (e.g., `Reveal.tsx` or `Skeleton.tsx`). Feature-heavy views belong in their domain bucket (e.g., `components/gallery`).
2. **Server/Client Boundaries**: All pages in `app/` are Server Components by default. Keep them stateless logic hubs to fetch data. Move all interactive/React-state heavy things out into `components/` and use `"use client"`.
3. **No 'Any' Types allowed ("Vibe Coding")**: Generic/loose typing is banned. Use the standardized types located in `src/types/` when mapping UI properties. 

---

## 🖌 Headless CMS Framework (`apps/studio`)

The backend CMS relies on **Sanity.io v3**.

```text
apps/studio/
├── schemaTypes/          # Data schemas for structured CMS content
│   └── index.ts          # Central export map
├── deskStructure.ts      # UI layout mapping for the CMS Admin panel
└── sanity.config.ts      # Core CMS registration & plugin injection
```

### Protocol Standards
- **Schema Extensibility**: Any new component/page data type required in `apps/web` must first be structurally modeled here under `schemaTypes/`. 
- **Type Regeneration**: If you change a schema, always verify `apps/web/src/types/` accurately reflects those changes on the frontend for TS type-safety.

---

## 🧹 Maintenance & Logging Protocol

To maintain production stability:
- Local caches (`.next`, `.npm-cache`, `.npm-logs`) should be purged periodically when tracking phantom deployment/build issues. 
- Leave `console.log()` statements completely out of committed frontend logic files to maintain absolute performance and prevent data leaking. 

*(Maintained continuously to reflect core architecture.)*
