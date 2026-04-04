import "server-only";

import { createClient } from "@sanity/client";

import {
  isSanityConfigured,
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
} from "./config";

const token = process.env.SANITY_API_READ_TOKEN;

export const sanityServerClient = isSanityConfigured
  ? createClient({
      projectId: sanityProjectId,
      dataset: sanityDataset,
      apiVersion: sanityApiVersion,
      token,
      useCdn: !token && process.env.NODE_ENV === "production",
    })
  : null;

