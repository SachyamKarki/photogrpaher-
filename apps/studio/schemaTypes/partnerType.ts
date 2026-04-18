import { defineField, defineType } from "sanity";

export const partnerType = defineType({
  name: "partner",
  title: "Industry Partner",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Partner Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Partner Logo",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "website",
      title: "Website URL",
      type: "url",
    }),
    defineField({
      name: "order",
      title: "Brand Position",
      type: "number",
      description: "Lower numbers appear first in the homepage brand carousel.",
      initialValue: 100,
      validation: (Rule) =>
        Rule.required().integer().min(1).warning("Use 1, 2, 3... to control the order clearly."),
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "logo",
      order: "order",
    },
    prepare({ title, media, order }) {
      return {
        title,
        media,
        subtitle: typeof order === "number" ? `Position ${order}` : "No position set",
      };
    },
  },
});
