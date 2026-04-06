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

## Deployment

### Frontend (apps/web)
The frontend is optimized for **Vercel**. When importing the repository on Vercel:
1. Set the **Framework Preset** to Next.js.
2. Set the **Root Directory** to `apps/web`.
3. Add the following Environment Variables in the project settings:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_READ_TOKEN` (if dataset is private)
   - `SANITY_API_WRITE_TOKEN` (if saving contact forms)

### Backend Studio (apps/studio)
The Sanity Studio can be deployed to Sanity's unified platform or Vercel:
- **Sanity Hosting (Recommended):** Run `npm run deploy` from the `apps/studio` directory. This is the simplest option.
- **Vercel:** Similarly to the frontend, you can deploy the studio to Vercel by setting the Root Directory to `apps/studio` and the Framework to Vite/Sanity. Add the variables `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET` to its Vercel project environment settings.

---
# photogrpaher-
