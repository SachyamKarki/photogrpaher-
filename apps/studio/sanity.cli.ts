import { defineCliConfig } from "sanity/cli";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(here, "../..", ".env") });

const fallbackProjectId = "8gy5kmv3";
const fallbackDataset = "production";
const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? fallbackProjectId;
const dataset = process.env.SANITY_STUDIO_DATASET ?? fallbackDataset;

export default defineCliConfig({
  api: { projectId, dataset },
  studioHost: "robinson-photography",
});
