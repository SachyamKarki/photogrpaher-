import fs from "node:fs";
import path from "node:path";

import { getCliClient } from "@sanity/cli";

function getArg(flag: string) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return null;
  return process.argv[idx + 1] ?? null;
}

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function titleize(input: string) {
  return input
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function isImageFile(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp", ".gif", ".tif", ".tiff", ".avif"].includes(ext);
}

function contentTypeFor(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".tif" || ext === ".tiff") return "image/tiff";
  if (ext === ".avif") return "image/avif";
  return "application/octet-stream";
}

async function listImagesRecursive(folderPath: string) {
  const out: string[] = [];
  const entries = await fs.promises.readdir(folderPath, { withFileTypes: true });
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

async function listChildDirs(folderPath: string) {
  const entries = await fs.promises.readdir(folderPath, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => path.join(folderPath, e.name))
    .sort((a, b) => a.localeCompare(b));
}

async function ensureCategory(client: ReturnType<typeof getCliClient>, categorySlug: string, categoryTitle: string) {
  const existing = await client.fetch<{ _id?: string }>(
    '*[_type=="category" && slug.current==$slug][0]{_id}',
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
  return created._id as string;
}

async function upsertProject(
  client: ReturnType<typeof getCliClient>,
  {
    projectSlug,
    projectTitle,
    categoryRef,
    coverAssetId,
    galleryAssetIds,
    replace,
  }: {
    projectSlug: string;
    projectTitle: string;
    categoryRef: string;
    coverAssetId: string | null;
    galleryAssetIds: string[];
    replace: boolean;
  },
) {
  const existing = await client.fetch<{ _id?: string }>(
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

  if (!existing?._id) {
    const created = await client.create({
      ...base,
      ...(coverImage ? { coverImage } : null),
      gallery,
    });
    return created._id as string;
  }

  const patch = client.patch(existing._id).set({
    title: base.title,
    category: base.category,
    publishedAt: base.publishedAt,
    ...(replace ? { gallery } : null),
    ...(coverImage ? { coverImage } : null),
  });
  const committed = await patch.commit({ autoGenerateArrayKeys: true });
  return committed._id as string;
}

async function main() {
  const folderPath = getArg("--folder") ?? process.argv.find((a) => a.startsWith("/") || a.startsWith(".")) ?? null;
  if (!folderPath) {
    throw new Error("Missing --folder <path> (pass args after `--`).");
  }

  const resolvedFolder = path.resolve(process.cwd(), folderPath);
  const categorySlug = getArg("--category") ?? "automobile";
  const replace = hasFlag("--replace");
  const overrideProjectTitle = getArg("--project-title");
  const overrideProjectSlug = getArg("--project-slug");

  const client = getCliClient();

  const stat = await fs.promises.stat(resolvedFolder).catch(() => null);
  if (!stat || !stat.isDirectory()) throw new Error(`Folder not found: ${resolvedFolder}`);

  const categoryTitle = titleize(categorySlug);
  // eslint-disable-next-line no-console
  console.log(`Folder: ${resolvedFolder}`);
  // eslint-disable-next-line no-console
  console.log(`Category: ${categoryTitle} (${categorySlug})`);

  const categoryRef = await ensureCategory(client, categorySlug, categoryTitle);

  const childDirs = await listChildDirs(resolvedFolder);
  const projects: Array<{ folder: string; title: string; slug: string; images: string[] }> = [];

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

  for (const project of projects) {
    // eslint-disable-next-line no-console
    console.log(`\nUploading project: ${project.title} (${project.slug})`);
    // eslint-disable-next-line no-console
    console.log(`- Source: ${project.folder}`);
    // eslint-disable-next-line no-console
    console.log(`- Images: ${project.images.length}`);

    const assetIds: string[] = [];
    for (const imagePath of project.images) {
      const filename = path.basename(imagePath);
      process.stdout.write(`  • ${filename} ... `);
      const stream = fs.createReadStream(imagePath);
      const asset = await client.assets.upload("image", stream, {
        filename,
        contentType: contentTypeFor(imagePath),
      });
      assetIds.push(asset._id as string);
      // eslint-disable-next-line no-console
      console.log(asset._id);
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

    // eslint-disable-next-line no-console
    console.log(`- Sanity doc: ${docId}`);
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
