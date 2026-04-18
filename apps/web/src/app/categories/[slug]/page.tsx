import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { LogoMark } from "@/components/brand/LogoMark";
import { portfolioCategories, portfolioProjects } from "@/lib/portfolio/data";
import { urlFor } from "@/lib/sanity/image";
import { sanityServerClient } from "@/lib/sanity/serverClient";
import {
  CATEGORY_BY_SLUG_QUERY,
  PROJECTS_BY_CATEGORY_SLUG_QUERY,
} from "@/lib/sanity/queries";

type Category = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage?: SanityImageSource | string;
};

type ProjectListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: SanityImageSource | string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sanityEnabled = Boolean(sanityServerClient);

  let category: Category | null = null;
  if (sanityEnabled) {
    category = await sanityServerClient!.fetch<Category>(CATEGORY_BY_SLUG_QUERY, { slug });
  } else {
    const selection = portfolioCategories.find((c) => c.slug === slug);
    if (selection) {
      category = {
        _id: `portfolio:${selection.slug}`,
        title: selection.title,
        slug: selection.slug,
        description: selection.description,
      };
    }
  }

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: `${category.title} Photography`,
    description:
      category.description ||
      `Explore ${category.title} photography by RabinSon — professional photographer based in Nepal.`,
    openGraph: {
      title: `${category.title} Photography | RabinSon`,
      description:
        category.description ||
        `Browse ${category.title} photography from RabinSon's professional portfolio.`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const sanityEnabled = Boolean(sanityServerClient);

  let category: Category | null = null;
  let projects: ProjectListItem[] = [];

  if (sanityEnabled) {
    [category, projects] = await Promise.all([
      sanityServerClient!.fetch<Category>(CATEGORY_BY_SLUG_QUERY, { slug }),
      sanityServerClient!.fetch<ProjectListItem[]>(
        PROJECTS_BY_CATEGORY_SLUG_QUERY,
        { slug },
      ),
    ]);
  } else {
    const selection = portfolioCategories.find((c) => c.slug === slug);
    if (!selection) notFound();
    category = {
      _id: `portfolio:${selection.slug}`,
      title: selection.title,
      slug: selection.slug,
      description: selection.description,
      coverImage: selection.image,
    };
    projects = portfolioProjects
      .filter((p) => p.categorySlug === slug)
      .map((p) => ({
        _id: `portfolio:${p.slug}`,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        coverImage: p.coverImage,
      }));
  }

  if (!category?._id) notFound();

  const coverUrl = category.coverImage
    ? typeof category.coverImage === "string"
      ? category.coverImage
      : sanityEnabled
        ? urlFor(category.coverImage)?.width(2400).height(1200).url()
        : null
    : null;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-white">
              <LogoMark className="h-5 w-5" />
            </div>
            <div className="font-heading font-semibold tracking-tight">
              RabinSon Photography
            </div>
          </Link>
          <nav className="text-sm text-zinc-600">
            <Link className="hover:text-zinc-900" href="/gallery">
              Gallery
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-900">
          <div className="absolute inset-0">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={category.title}
                fill
                className="object-cover opacity-75"
                sizes="(max-width: 1024px) 100vw, 1200px"
                priority
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/10 to-zinc-950/40" />
          </div>

          <div className="relative px-6 py-16 sm:px-10 sm:py-20">
            <div className="max-w-2xl">
              <h1 className="font-heading mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {category.title}
              </h1>
              {category.description ? (
                <p className="mt-4 text-base leading-7 text-zinc-200 sm:text-lg">
                  {category.description}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const imageUrl = project.coverImage
              ? typeof project.coverImage === "string"
                ? project.coverImage
                : sanityEnabled
                  ? urlFor(project.coverImage)?.width(1200).height(900).url()
                  : null
              : null;

            return (
              <Link
                key={project._id}
                href={`/projects/${project.slug}`}
                className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:border-zinc-300 hover:shadow-sm"
              >
                <div className="relative aspect-[4/3] w-full bg-zinc-100">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover transition"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-zinc-500">
                      No cover image
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="font-medium tracking-tight">
                    {project.title}
                  </div>
                  {project.excerpt ? (
                    <p className="mt-2 line-clamp-2 text-sm text-zinc-600">
                      {project.excerpt}
                    </p>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
