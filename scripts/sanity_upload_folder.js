#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const { createClient } = require("@sanity/client");

// Load env from repo root when available, so users don't need to manually export vars.
try {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  const dotenv = require("dotenv");
  dotenv.config({ path: path.resolve(__dirname, "..", ".env") });
  dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });
} catch {
  // optional dependency
}

function usage() {
  console.log(
    [
      "Usage:",
      "  node scripts/sanity_upload_folder.js <folderPath> [--category <slug>] [--replace] [--project-title <title>] [--project-slug <slug>]",
      "",
      "Environment:",
      "  NEXT_PUBLIC_SANITY_PROJECT_ID",
      "  NEXT_PUBLIC_SANITY_DATASET",
      "  NEXT_PUBLIC_SANITY_API_VERSION (optional)",
      "  SANITY_API_WRITE_TOKEN",
      "",
      "Notes:",
      "  - If <folderPath> contains subfolders with images, each subfolder becomes a Sanity `project`.",
      "  - Otherwise, the folder itself becomes a single `project`.",
    ].join("\n"),
  );
}

function getArg(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return null;
  return process.argv[idx + 1] ?? null;
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function slugify(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function titleize(input) {
  return input
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function isImageFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp", ".gif", ".tif", ".tiff", ".avif"].includes(ext);
}

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".tif" || ext === ".tiff") return "image/tiff";
  if (ext === ".avif") return "image/avif";
  return "application/octet-stream";
}

async function listImagesShallow(folderPath) {
  const entries = await fsp.readdir(folderPath, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile())
    .map((e) => path.join(folderPath, e.name))
    .filter(isImageFile)
    .sort((a, b) => a.localeCompare(b));
  const dirs = entries
    .filter((e) => e.isDirectory())
    .map((e) => path.join(folderPath, e.name))
    .sort((a, b) => a.localeCompare(b));
  return { files, dirs };
}

async function listImagesRecursive(folderPath) {
  const out = [];
  const entries = await fsp.readdir(folderPath, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(folderPath, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await listImagesRecursive(full)));
    } else if (entry.isFile() && isImageFile(full)) {
      out.push(full);
    }
  }
  out.sort((a, b) => a.localeCompare(b));
  return out;
}

async function ensureCategory(client, categorySlug, categoryTitle) {
  const existing = await client.fetch(
    '*[_type=="category" && slug.current==$slug][0]{_id, title, "slug": slug.current}',
    { slug: categorySlug },
  );

  if (existing?._id) return existing._id;

  const created = await client.create({
    _type: "category",
    title: categoryTitle,
    slug: { _type: "slug", current: categorySlug },
    featuredOnHome: true,
    homeOrder: 10,
  });

  return created._id;
}

async function upsertProject(client, { projectSlug, projectTitle, categoryRef, coverAssetId, galleryAssetIds, replace }) {
  const existing = await client.fetch(
    '*[_type=="project" && slug.current==$slug][0]{_id, title, "slug": slug.current}',
    { slug: projectSlug },
  );

  const docBase = {
    _type: "project",
    title: projectTitle,
    slug: { _type: "slug", current: projectSlug },
    category: { _type: "reference", _ref: categoryRef },
    publishedAt: new Date().toISOString(),
  };

  const coverImage = coverAssetId
    ? {
        _type: "image",
        asset: { _type: "reference", _ref: coverAssetId },
        alt: projectTitle,
      }
    : undefined;

  const gallery = galleryAssetIds.map((assetId) => ({
    _type: "image",
    asset: { _type: "reference", _ref: assetId },
    alt: projectTitle,
  }));

  if (!existing?._id) {
    const created = await client.create({
      ...docBase,
      ...(coverImage ? { coverImage } : null),
      gallery,
    });
    return created._id;
  }

  const patch = client.patch(existing._id).set({
    title: projectTitle,
    category: docBase.category,
    publishedAt: docBase.publishedAt,
    ...(replace ? { gallery } : null),
    ...(coverImage ? { coverImage } : null),
  });

  const committed = await patch.commit({ autoGenerateArrayKeys: true });
  return committed._id;
}

async function main() {
  const folderPath = process.argv[2];
  if (!folderPath || folderPath.startsWith("-")) {
    usage();
    process.exit(1);
  }

  const resolvedFolder = path.resolve(process.cwd(), folderPath);
  const categorySlug = getArg("--category") ?? "automobile";
  const overrideProjectTitle = getArg("--project-title");
  const overrideProjectSlug = getArg("--project-slug");
  const replace = hasFlag("--replace");

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01";
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId || !dataset || !token) {
    console.error("Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.");
    process.exit(1);
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  const stat = await fsp.stat(resolvedFolder).catch(() => null);
  if (!stat || !stat.isDirectory()) {
    console.error(`Folder not found: ${resolvedFolder}`);
    process.exit(1);
  }

  const categoryTitle = titleize(categorySlug);
  console.log(`Sanity: ${projectId}/${dataset} (apiVersion=${apiVersion})`);
  console.log(`Folder: ${resolvedFolder}`);
  console.log(`Category: ${categoryTitle} (${categorySlug})`);

  const categoryRef = await ensureCategory(client, categorySlug, categoryTitle);

  const { files: rootImages, dirs } = await listImagesShallow(resolvedFolder);

  const projectInputs = [];
  for (const dir of dirs) {
    const images = await listImagesRecursive(dir);
    if (images.length === 0) continue;
    projectInputs.push({
      folder: dir,
      title: titleize(path.basename(dir)),
      slug: slugify(path.basename(dir)),
      images,
    });
  }

  if (projectInputs.length === 0 && rootImages.length > 0) {
    const base = path.basename(resolvedFolder);
    projectInputs.push({
      folder: resolvedFolder,
      title: overrideProjectTitle ? String(overrideProjectTitle) : titleize(base),
      slug: overrideProjectSlug ? slugify(String(overrideProjectSlug)) : slugify(base),
      images: rootImages,
    });
  }

  if (projectInputs.length === 0) {
    console.error("No images found in the folder (jpg/png/webp/etc).");
    process.exit(1);
  }

  const results = {
    sanity: { projectId, dataset, apiVersion, categorySlug, categoryRef },
    projects: [],
    generatedAt: new Date().toISOString(),
  };

  for (const project of projectInputs) {
    console.log(`\nUploading project: ${project.title} (${project.slug})`);
    console.log(`- Source: ${project.folder}`);
    console.log(`- Images: ${project.images.length}`);

    const assetIds = [];
    for (const imagePath of project.images) {
      const filename = path.basename(imagePath);
      process.stdout.write(`  • ${filename} ... `);
      const stream = fs.createReadStream(imagePath);
      const asset = await client.assets.upload("image", stream, {
        filename,
        contentType: contentTypeFor(imagePath),
      });
      assetIds.push(asset._id);
      console.log(asset._id);
    }

    const coverAssetId = assetIds[0] ?? null;
    const projectIdInSanity = await upsertProject(client, {
      projectSlug: project.slug,
      projectTitle: project.title,
      categoryRef,
      coverAssetId,
      galleryAssetIds: assetIds,
      replace,
    });

    results.projects.push({
      title: project.title,
      slug: project.slug,
      folder: project.folder,
      sanityProjectDocId: projectIdInSanity,
      assetIds,
    });

    console.log(`- Sanity doc: ${projectIdInSanity}`);
  }

  const outPath = path.join(process.cwd(), "scripts", `sanity-upload-results.${Date.now()}.json`);
  await fsp.writeFile(outPath, JSON.stringify(results, null, 2));
  console.log(`\nWrote: ${outPath}`);
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
