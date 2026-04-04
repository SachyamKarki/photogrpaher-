# Photographer Web App

Monorepo setup:

- `apps/web`: Next.js frontend
- `apps/studio`: Sanity Studio (CMS)

## Getting started

1. Copy env file: `cp .env.example .env` and fill values
2. Install deps: `npm install`
3. Start frontend: `npm run dev`
4. Start Sanity Studio: `npm run dev:studio`

## Sanity project

You need a Sanity project id + dataset:

- Create one at sanity.io (or via the Sanity CLI)
- Put the values in `.env`

If your dataset is private, set `SANITY_API_READ_TOKEN` in `.env` (see `.env.example`).

## Content model

- `Site Settings` (singleton) controls the homepage banner (image or video)
- `Categories` are featured on the homepage and have their own pages
- `Projects` are listed on the homepage and have a detail page

## Contact form

The contact form posts to `/api/contact` and (optionally) stores submissions in Sanity as `contactSubmission`.

- Set `SANITY_API_WRITE_TOKEN` in `.env` to enable saving submissions.

# photogrpaher-
