import "server-only";

import { createClient } from "@sanity/client";

import {
  isSanityConfigured,
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
} from "./config";

const token = process.env.SANITY_API_WRITE_TOKEN;

export const sanityWriteClient =
  isSanityConfigured && token
    ? createClient({
        projectId: sanityProjectId,
        dataset: sanityDataset,
        apiVersion: sanityApiVersion,
        token,
        useCdn: false,
      })
    : null;

