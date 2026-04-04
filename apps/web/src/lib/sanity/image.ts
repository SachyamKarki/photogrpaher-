import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { sanityDataset, sanityProjectId } from "./config";

const builder =
  sanityProjectId && sanityDataset
    ? imageUrlBuilder({ projectId: sanityProjectId, dataset: sanityDataset })
    : null;

export function urlFor(source: SanityImageSource) {
  return builder ? builder.image(source) : null;
}
