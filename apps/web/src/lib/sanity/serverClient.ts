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
      // Favor fresh published content over CDN latency so Studio edits show up promptly.
      useCdn: false,
    })
  : null;
