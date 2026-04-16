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
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first in the brand carousel.",
      initialValue: 100,
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "logo",
    },
  },
});
