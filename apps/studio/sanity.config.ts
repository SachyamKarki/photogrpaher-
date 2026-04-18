import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { deskStructure } from "./deskStructure";
import { schemaTypes } from "./schemaTypes";

const fallbackProjectId = "8gy5kmv3";
const fallbackDataset = "production";
const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? fallbackProjectId;
const dataset = process.env.SANITY_STUDIO_DATASET ?? fallbackDataset;
const apiVersion = process.env.SANITY_STUDIO_API_VERSION ?? "2024-01-01";

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
