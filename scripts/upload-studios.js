const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@sanity/client');

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

const targetDirectory = path.join(process.env.HOME, 'Downloads', 'studio portraits');

if(!fs.existsSync(targetDirectory)){
    console.error(`Could not locate the directory: ${targetDirectory}`);
    process.exit(1);
}

console.log(`Using directory: ${targetDirectory}`);

async function uploadAssets() {
    const files = fs.readdirSync(targetDirectory);
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
                alt: 'Studio Portrait',
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
        _id: 'category-studio-portraits-scripted',
        _type: 'category',
        title: 'Studio Portraits',
        slug: { _type: 'slug', current: 'studio-portraits' },
        description: 'Intimate and carefully crafted studio shots focusing on lighting and expression.',
        featuredOnHome: true,
        homeOrder: 30, // Places it cleanly after Automobile (10) and Himalayas (20)
        coverImage: imageRefs[0] // Set cover to first image
    };
    
    await client.createOrReplace(categoryDoc);
    console.log(`Created/Updated Category: Studio Portraits (ID: ${categoryDoc._id})`);

    // Create Project
    const projectDoc = {
        _id: 'project-studio-portraits-scripted',
        _type: 'project',
        title: 'Studio Portraits',
        slug: { _type: 'slug', current: 'studio-portraits' },
        excerpt: 'Intimate and carefully crafted studio shots focusing on lighting and expression.',
        category: {
            _type: 'reference',
            _ref: categoryDoc._id
        },
        coverImage: imageRefs[0],
        gallery: imageRefs,
        publishedAt: new Date().toISOString()
    };

    await client.createOrReplace(projectDoc);
    console.log(`Created/Updated Project: Studio Portraits (ID: ${projectDoc._id}) with ${imageRefs.length} gallery images.`);

}

uploadAssets().then(() => {
    console.log('All done!');
}).catch(console.error);
