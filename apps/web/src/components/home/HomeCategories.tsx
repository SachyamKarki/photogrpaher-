"use client";

import { useRouter } from "next/navigation";
import { CategoriesShowcase } from "./CategoriesShowcase";

type Category = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string | null;
};

type Props = {
  categories: Category[];
  title?: string;
  subtitle?: string;
  sectionClassName?: string;
  headingContainerClassName?: string;
};

export function HomeCategories({
  categories,
  title,
  subtitle,
  sectionClassName,
  headingContainerClassName,
}: Props) {
  const router = useRouter();

  const handleCategoryClick = (slug: string) => {
    router.push(`/gallery?category=${slug}`);
  };

  return (
    <div>
      <CategoriesShowcase 
        categories={categories} 
        onCategoryClick={handleCategoryClick}
        title={title}
        subtitle={subtitle}
        sectionClassName={sectionClassName}
        headingContainerClassName={headingContainerClassName}
      />
    </div>
  );
}
