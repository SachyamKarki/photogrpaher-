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

const partners = [
  { name: "Toyota", file: "toyota.svg", id: "partner-toyota" },
  { name: "Ather", file: "ather.svg", id: "partner-ather" },
  { name: "NMA", file: "nma.png", id: "partner-nma" },
  { name: "NNMGA", file: "nnmga.png", id: "partner-nnmga" },
  { name: "Freedom Adventure Treks", file: "freedom-adventure.png", id: "partner-freedom-adventure" },
  { name: "Freedom Foundation Nepal", file: "freedom-foundation.png", id: "partner-freedom-foundation" },
];

async function localizeAll() {
  for (const partner of partners) {
    try {
      const imagePath = path.resolve(process.cwd(), `apps/web/public/content/partners/${partner.file}`);
      console.log(`Processing ${partner.name}...`);
      
      const imageAsset = await client.assets.upload("image", readFileSync(imagePath), {
        filename: partner.file,
      });

      const partnerDoc = {
        _type: "partner",
        name: partner.name,
        logo: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset._id,
          },
        },
      };

      await client.createOrReplace({
        _id: partner.id,
        ...partnerDoc,
      });

      console.log(`✓ ${partner.name} updated.`);
    } catch (error) {
      console.error(`✗ Error processing ${partner.name}:`, error);
    }
  }
}

localizeAll().catch(console.error);
