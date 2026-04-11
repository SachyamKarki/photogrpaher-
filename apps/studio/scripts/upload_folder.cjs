/* eslint-disable no-console */

const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");

const { getCliClient } = require("@sanity/cli");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function titleize(input) {
  return String(input)
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

async function readJson(filePath) {
  try {
    const raw = await fsp.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeJson(filePath, value) {
  await fsp.mkdir(path.dirname(filePath), { recursive: true });
  await fsp.writeFile(filePath, JSON.stringify(value, null, 2));
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

async function listChildDirs(folderPath) {
  const entries = await fsp.readdir(folderPath, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => path.join(folderPath, e.name))
    .sort((a, b) => a.localeCompare(b));
}

async function ensureCategory(client, categorySlug, categoryTitle) {
  const existing = await client.fetch(
    '*[_type=="category" && slug.current==$slug][0]{_id}',
    { slug: categorySlug },
  );
  if (existing && existing._id) return existing._id;

  const created = await client.create({
    _type: "category",
    title: categoryTitle,
    slug: { _type: "slug", current: categorySlug },
    featuredOnHome: true,
    homeOrder: 10,
  });

  return created._id;
}

async function findExistingAssetByFilename(client, filename) {
  const existing = await client.fetch(
    '*[_type=="sanity.imageAsset" && originalFilename==$filename][0]{_id, originalFilename}',
    { filename },
  );
  return existing?._id ?? null;
}

function isRetryableSanityError(err) {
  if (!err || typeof err !== "object") return false;
  const status = err.statusCode ?? err?.response?.statusCode;
  return status === 502 || status === 503 || status === 504 || status === 429;
}

async function upsertProject(client, { projectSlug, projectTitle, categoryRef, coverAssetId, galleryAssetIds, replace }) {
  const existing = await client.fetch(
    '*[_type=="project" && slug.current==$slug][0]{_id}',
    { slug: projectSlug },
  );

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

  const base = {
    _type: "project",
    title: projectTitle,
    slug: { _type: "slug", current: projectSlug },
    category: { _type: "reference", _ref: categoryRef },
    publishedAt: new Date().toISOString(),
  };

  if (!existing || !existing._id) {
    const created = await client.create({
      ...base,
      ...(coverImage ? { coverImage } : null),
      gallery,
    });
    return created._id;
  }

  const patch = client.patch(existing._id).set({
    title: base.title,
    category: base.category,
    publishedAt: base.publishedAt,
    ...(replace ? { gallery } : null),
    ...(coverImage ? { coverImage } : null),
  });

  const committed = await patch.commit({ autoGenerateArrayKeys: true });
  return committed._id;
}

async function main() {
  const folderPath = getArg("--folder") ?? null;
  if (!folderPath) {
    throw new Error("Missing --folder <path> (pass args after `--`).");
  }

  const resolvedFolder = path.resolve(process.cwd(), folderPath);
  const categorySlug = getArg("--category") ?? "automobile";
  const replace = hasFlag("--replace");
  const overrideProjectTitle = getArg("--project-title");
  const overrideProjectSlug = getArg("--project-slug");
  const statePath =
    getArg("--state") ??
    path.join("/tmp", `sanity-upload-state.${slugify(overrideProjectSlug || categorySlug)}.json`);

  const client = getCliClient();

  const stat = await fsp.stat(resolvedFolder).catch(() => null);
  if (!stat || !stat.isDirectory()) throw new Error(`Folder not found: ${resolvedFolder}`);

  const categoryTitle = titleize(categorySlug);
  console.log(`Folder: ${resolvedFolder}`);
  console.log(`Category: ${categoryTitle} (${categorySlug})`);
  console.log(`State: ${statePath}`);

  const categoryRef = await ensureCategory(client, categorySlug, categoryTitle);

  const childDirs = await listChildDirs(resolvedFolder);
  const projects = [];

  for (const dir of childDirs) {
    const images = await listImagesRecursive(dir);
    if (images.length === 0) continue;
    projects.push({
      folder: dir,
      title: titleize(path.basename(dir)),
      slug: slugify(path.basename(dir)),
      images,
    });
  }

  if (projects.length === 0) {
    const images = await listImagesRecursive(resolvedFolder);
    if (images.length === 0) throw new Error("No images found in the folder.");
    const base = path.basename(resolvedFolder);
    projects.push({
      folder: resolvedFolder,
      title: overrideProjectTitle ? String(overrideProjectTitle) : titleize(base),
      slug: overrideProjectSlug ? slugify(String(overrideProjectSlug)) : slugify(base),
      images,
    });
  }

  const state =
    (await readJson(statePath)) ??
    ({
      version: 1,
      createdAt: new Date().toISOString(),
      folder: resolvedFolder,
      categorySlug,
      projects: {},
    });

  for (const project of projects) {
    console.log(`\nUploading project: ${project.title} (${project.slug})`);
    console.log(`- Source: ${project.folder}`);
    console.log(`- Images: ${project.images.length}`);

    state.projects[project.slug] ||= { title: project.title, slug: project.slug, assetsByFilename: {} };
    const assetsByFilename = state.projects[project.slug].assetsByFilename;

    const assetIds = [];
    for (const imagePath of project.images) {
      const filename = path.basename(imagePath);
      if (assetsByFilename[filename]) {
        process.stdout.write(`  • ${filename} ... `);
        console.log(`(cached) ${assetsByFilename[filename]}`);
        assetIds.push(assetsByFilename[filename]);
        continue;
      }

      const existingAssetId = await findExistingAssetByFilename(client, filename);
      if (existingAssetId) {
        assetsByFilename[filename] = existingAssetId;
        await writeJson(statePath, state);
        process.stdout.write(`  • ${filename} ... `);
        console.log(`(existing) ${existingAssetId}`);
        assetIds.push(existingAssetId);
        continue;
      }

      let attempt = 0;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        attempt += 1;
        try {
          process.stdout.write(`  • ${filename} ... `);
          const stream = fs.createReadStream(imagePath);
          const asset = await client.assets.upload("image", stream, {
            filename,
            contentType: contentTypeFor(imagePath),
          });
          assetsByFilename[filename] = asset._id;
          await writeJson(statePath, state);
          assetIds.push(asset._id);
          console.log(asset._id);
          break;
        } catch (err) {
          const retryable = isRetryableSanityError(err);
          const status = err?.statusCode ?? err?.response?.statusCode ?? "unknown";
          console.log(`failed (status=${status})`);
          if (!retryable || attempt >= 6) throw err;
          const backoffMs = Math.min(15_000, 800 * Math.pow(2, attempt));
          console.log(`    retrying in ${backoffMs}ms...`);
          await sleep(backoffMs);
        }
      }
    }

    const coverAssetId = assetIds[0] ?? null;
    const docId = await upsertProject(client, {
      projectSlug: project.slug,
      projectTitle: project.title,
      categoryRef,
      coverAssetId,
      galleryAssetIds: assetIds,
      replace,
    });

    console.log(`- Sanity doc: ${docId}`);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
