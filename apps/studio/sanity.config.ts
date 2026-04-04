import { visionTool } from "@sanity/vision";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { deskStructure } from "./deskStructure";
import { schemaTypes } from "./schemaTypes";

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(here, "../..", ".env") });

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
const apiVersion = process.env.SANITY_STUDIO_API_VERSION ?? "2024-01-01";

if (!projectId || !dataset) {
  throw new Error(
    "Missing SANITY_STUDIO_PROJECT_ID or SANITY_STUDIO_DATASET. Create a .env file at the repo root (or set env vars) and try again.",
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
