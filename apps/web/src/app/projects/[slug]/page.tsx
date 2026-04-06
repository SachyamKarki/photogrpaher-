import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { demoProjects } from "@/lib/demo/content";
import { urlFor } from "@/lib/sanity/image";
import { sanityServerClient } from "@/lib/sanity/serverClient";
import { PROJECT_BY_SLUG_QUERY } from "@/lib/sanity/queries";

type Project = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: SanityImageSource | string;
  gallery?: (SanityImageSource | string)[];
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const sanityEnabled = Boolean(sanityServerClient);

  let project: Project | null = null;

  if (sanityEnabled) {
    try {
      project = await sanityServerClient!.fetch<Project>(PROJECT_BY_SLUG_QUERY, {
        slug,
      });
    } catch {
      notFound();
    }
  } else {
    const demo = demoProjects.find((p) => p.slug === slug);
    if (!demo) notFound();
    project = {
      _id: `demo:${demo.slug}`,
      title: demo.title,
      slug: demo.slug,
      excerpt: demo.excerpt,
      coverImage: demo.coverImage,
      gallery: demo.gallery,
    };
  }

  if (!project?._id) notFound();

  const coverUrl = project.coverImage
    ? typeof project.coverImage === "string"
      ? project.coverImage
      : sanityEnabled
        ? urlFor(project.coverImage)?.width(2000).height(1500).url()
        : null
    : null;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          ← Back to projects
        </Link>

        <h1 className="font-heading mt-6 text-3xl font-semibold tracking-tight">
          {project.title}
        </h1>
        {project.excerpt ? (
          <p className="mt-3 max-w-2xl text-zinc-600">{project.excerpt}</p>
        ) : null}

        {coverUrl ? (
          <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
            <Image
              src={coverUrl}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 900px"
              priority
            />
          </div>
        ) : null}

        {project.gallery?.length ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {project.gallery.map((img, i) => {
              const url =
                typeof img === "string"
                  ? img
                  : sanityEnabled
                    ? urlFor(img)?.width(1600).height(1200).url()
                    : null;
              if (!url) return null;

              return (
                <div
                  key={`${project._id}:${i}`}
                  className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100"
                >
                  <Image
                    src={url}
                    alt={`${project.title} ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 450px"
                  />
                </div>
              );
            })}
          </div>
        ) : null}
      </main>
    </div>
  );
}
