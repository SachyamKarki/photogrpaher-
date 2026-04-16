import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

async function uploadSevenSummit() {
  const imagePath = path.resolve(process.cwd(), "apps/web/public/content/partners/sevensummit.jpg");
  console.log(`Reading image from: ${imagePath}`);
  
  const imageAsset = await client.assets.upload("image", readFileSync(imagePath), {
    filename: "sevensummit_logo.jpg",
  });

  console.log(`Image uploaded. Asset ID: ${imageAsset._id}`);

  const partnerDoc = {
    _type: "partner",
    name: "Seven Summit Treks",
    logo: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: imageAsset._id,
      },
    },
    order: 4, // Next in order
  };

  const result = await client.createOrReplace({
    _id: "partner-seven-summit",
    ...partnerDoc,
  });

  console.log(`Partner document created/updated: ${result._id}`);
}

uploadSevenSummit().catch(err => {
  console.error("Upload failed:", err);
  process.exit(1);
});
