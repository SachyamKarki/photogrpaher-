import { defineField, defineType } from "sanity";

export const projectType = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "category" }],
    }),
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
      name: "excerpt",
      title: "Short Description",
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
        defineField({
          name: "isFeatured",
          title: "Show in Featured Work (Home)",
          type: "boolean",
          description: "Checking this will display the image in the Bento Grid on the homepage.",
          initialValue: false,
        }),
        defineField({
          name: "featuredOrder",
          title: "Bento Grid Position",
          type: "number",
          description: "Optional (1-10). Explicitly lock this image to a specific slot in the Homepage Bento grid. Other featured images will shuffle around it.",
          validation: (Rule) => Rule.min(1).max(10).integer(),
        }),
      ],
    }),
    defineField({
      name: "gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
            defineField({
              name: "isFeatured",
              title: "Show in Featured Work (Home)",
              type: "boolean",
              description: "Checking this will display the image in the Bento Grid on the homepage.",
              initialValue: false,
            }),
            defineField({
              name: "featuredOrder",
              title: "Bento Grid Position",
              type: "number",
              description: "Optional (1-10). Explicitly lock this image to a specific slot in the Homepage Bento grid. Other featured images will shuffle around it.",
              validation: (Rule) => Rule.min(1).max(10).integer(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: { title: "title", media: "coverImage" },
  },
});
