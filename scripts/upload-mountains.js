const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@sanity/client');
const { basename } = require('path');

// Load environment variables
const envConfig = dotenv.parse(fs.readFileSync('./.env'));
const writeToken = envConfig.SANITY_API_WRITE_TOKEN;

if (!writeToken) {
    console.error('SANITY_API_WRITE_TOKEN is missing or empty in .env');
    process.exit(1);
}

const client = createClient({
    projectId: envConfig.NEXT_PUBLIC_SANITY_PROJECT_ID || '8gy5kmv3',
    dataset: envConfig.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: envConfig.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
    token: writeToken,
    useCdn: false
});

const TARGET_DIR = path.join(process.env.HOME, 'Downloads', 'mountains ');

// Normalize directory paths, as some of the ls commands showed a trailing space in the directory name
let targetDirectory = TARGET_DIR;
if(!fs.existsSync(targetDirectory)) {
    targetDirectory = path.join(process.env.HOME, 'Downloads', 'mountains');
    if(!fs.existsSync(targetDirectory)){
        console.error("Could not locate the mountains directory in Downloads.");
        process.exit(1);
    }
}
console.log(`Using directory: ${targetDirectory}`);


async function uploadAssets() {
    const files = fs.readdirSync(targetDirectory);
    // Ignore .psd, .CR3 and hidden files
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const imageFiles = files.filter(f => validExtensions.includes(path.extname(f).toLowerCase()));

    if (imageFiles.length === 0) {
        console.log("No valid images found.");
        return;
    }

    console.log(`Found ${imageFiles.length} valid images. Starting uploads...`);

    const imageRefs = [];
    for(let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const filePath = path.join(targetDirectory, file);
        try {
            console.log(`[${i+1}/${imageFiles.length}] Uploading ${file}...`);
            const assetInfo = await client.assets.upload('image', fs.createReadStream(filePath), {
                filename: file
            });
            imageRefs.push({
                _key: `key-${Math.random().toString(36).substring(7)}`,
                _type: 'image',
                alt: 'Mountain',
                asset: {
                    _type: "reference",
                    _ref: assetInfo._id
                }
            });
        } catch (e) {
            console.error(`Failed to upload ${file}: `, e.message);
        }
    }

    if (imageRefs.length === 0) {
        console.error("All uploads failed.");
        process.exit(1);
    }
    
    console.log("Uploads complete. Creating Category and Project documents...");

    // Create Category
    const categoryDoc = {
        _id: 'category-mountain-scripted',
        _type: 'category',
        title: 'Mountain',
        slug: { _type: 'slug', current: 'mountain' },
        description: 'Breathtaking landscapes and rugged terrains of the Himalayas.',
        featuredOnHome: true,
        homeOrder: 20, /* Put after automobile which is 10 in Sanity */
        coverImage: imageRefs[0]
    };
    
    await client.createOrReplace(categoryDoc);
    console.log(`Created/Updated Category: Mountain (ID: ${categoryDoc._id})`);

    // Create Project
    const projectDoc = {
        _id: 'project-mountain-scripted',
        _type: 'project',
        title: 'Mountain',
        slug: { _type: 'slug', current: 'mountain' },
        excerpt: 'High altitude endurance and vast open spaces.',
        category: {
            _type: 'reference',
            _ref: categoryDoc._id
        },
        coverImage: imageRefs[0],
        gallery: imageRefs,
        publishedAt: new Date().toISOString()
    };

    await client.createOrReplace(projectDoc);
    console.log(`Created/Updated Project: Mountain (ID: ${projectDoc._id}) with ${imageRefs.length} gallery images.`);

}

uploadAssets().then(() => {
    console.log('All done!');
}).catch(console.error);
