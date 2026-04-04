import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "coverImage",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "featuredOnHome",
      title: "Featured On Homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "homeOrder",
      title: "Homepage Order",
      type: "number",
      initialValue: 10,
      hidden: ({ document }) => !document?.featuredOnHome,
    }),
  ],
  preview: {
    select: { title: "title", media: "coverImage" },
  },
});

