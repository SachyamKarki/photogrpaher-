# RabinSon Portfolio — Web Frontend

This directory contains the Next.js frontend for the RabinSon photography portfolio. It is designed with a focus on premium aesthetics, standard developer patterns, and high-performance image delivery.

## Architecture Overview

### `/src/app`
Uses the **Next.js App Router**.
- `(legal)`: Route group for Privacy, Terms, and Cookie policies.
- `api/`: Backend focus points (e.g., Contact form submission).
- `photo/[id]`: dynamic route for detailed photo viewing.
- `projects/`: Showcases specific collections of work.

### `/src/components`
Organized by feature area and responsibility:
- `ui/`: Independent, reusable building blocks (Buttons, Skeletons, Animations).
- `layout/`: Shared global components (Header, Footer, Scroll-to-Top).
- `home/`, `gallery/`, `contact/`: Feature-specific modules.

### `/src/lib`
Pure logic and external integrations:
- `sanity/`: All Sanity.io configuration, clients, and GROQ queries.
- `email/`: Nodemailer configuration and notification templates.
- `gallery/`: Image processing logic and bento-grid data curation.
- `portfolio/`: Fallback static data for development and offline states.

### `/src/types`
Centralized TypeScript definitions to ensure consistency across the codebase.

## Developer Guidelines

### Environment Variables
Sensitive data must NEVER be hardcoded. Use the `.env.example` as a template for your local `.env`.

### Styling
- **Tailwind CSS**: Primary styling engine.
- **Vanilla CSS**: Used in `globals.css` for low-level resets and high-end typographic scales.

### Component Naming
- Use **PascalCase** for component filenames and function names (e.g., `SiteFooter.tsx`).
- Use **camelCase** for library utilities and hooks.

---
*Built for excellence.*
