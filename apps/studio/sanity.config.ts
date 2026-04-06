import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { deskStructure } from "./deskStructure";
import { schemaTypes } from "./schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
const apiVersion = process.env.SANITY_STUDIO_API_VERSION ?? "2024-01-01";

if (!projectId || !dataset) {
  throw new Error(
    "Missing SANITY_STUDIO_PROJECT_ID or SANITY_STUDIO_DATASET. Ensure the repo root .env is configured and the dev server is started with target environment variables.",
  );
}

export default defineConfig({
  name: "default",
  title: "Photographer Studio",
  projectId,
  dataset,
  plugins: [
    structureTool({ structure: deskStructure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
  },
});
