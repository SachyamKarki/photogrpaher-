const { createClient } = require("@sanity/client");
const { readFileSync } = require("fs");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

async function uploadPartner() {
  const imagePath = path.resolve(process.cwd(), "peliot_nobg.png");
  console.log(`Reading image from: ${imagePath}`);
  
  const imageAsset = await client.assets.upload("image", readFileSync(imagePath), {
    filename: "pelliot_logo.png",
  });

  console.log(`Image uploaded. Asset ID: ${imageAsset._id}`);

  const partnerDoc = {
    _type: "partner",
    name: "Pelliot",
    logo: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: imageAsset._id,
      },
    },
    order: 1, // Featured brand
  };

  const result = await client.createOrReplace({
    _id: "partner-pelliot",
    ...partnerDoc,
  });

  console.log(`Partner document created/updated: ${result._id}`);
}

uploadPartner().catch(err => {
  console.error("Upload failed:", err);
  process.exit(1);
});
