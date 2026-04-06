import { defineField, defineType } from "sanity";
import { MessageSquare } from "lucide-react";

export const reviewType = defineType({
  name: "review",
  title: "Testimonial / Review",
  type: "document",
  icon: MessageSquare as any,
  fields: [
    defineField({
      name: "author",
      title: "Author Name",
      type: "string",
      validation: (rule) => rule.required().warning("Required for credibility."),
    }),
    defineField({
      name: "role",
      title: "Role or Context",
      description: "E.g., 'Wedding Client' or 'Art Director, Vogue'",
      type: "string",
    }),
    defineField({
      name: "quote",
      title: "Testimonial Quote",
      type: "text",
      validation: (rule) => rule.required().min(10).max(500),
    }),
    defineField({
      name: "featured",
      title: "Featured on Homepage",
      description: "Turn this on to display this review in the main masonry grid on the homepage.",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "author",
      subtitle: "role",
    },
  },
});
