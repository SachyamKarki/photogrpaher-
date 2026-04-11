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
};

export function HomeCategories({ categories }: Props) {
  const router = useRouter();

  const handleCategoryClick = (slug: string) => {
    router.push(`/gallery?category=${slug}`);
  };

  return (
    <div>
      <CategoriesShowcase 
        categories={categories} 
        onCategoryClick={handleCategoryClick} 
      />
    </div>
  );
}
