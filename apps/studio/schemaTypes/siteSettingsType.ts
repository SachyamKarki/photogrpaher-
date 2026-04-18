import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      initialValue: "Capturing moments, crafting stories.",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      rows: 2,
      initialValue:
        "A clean, professional portfolio powered by Next.js and Sanity.",
    }),
    defineField({
      name: "heroMediaType",
      title: "Hero Media Type",
      type: "string",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
          { title: "None", value: "none" },
        ],
        layout: "radio",
      },
      initialValue: "image",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ document }) => document?.heroMediaType !== "image",
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "heroVideo",
      title: "Hero Video (mp4/webm)",
      type: "file",
      options: {
        accept: "video/*",
      },
      hidden: ({ document }) => document?.heroMediaType !== "video",
    }),
    defineField({
      name: "servicesTitle",
      title: "Services Title",
      type: "string",
      initialValue: "What we do",
    }),
    defineField({
      name: "servicesIntro",
      title: "Services Intro",
      type: "text",
      rows: 2,
      initialValue:
        "A premium photography experience—from planning to delivery—tailored to your story.",
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", type: "string" }),
            defineField({
              name: "description",
              type: "text",
              rows: 2,
            }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
      initialValue: [
        {
          title: "Pre-shoot planning",
          description:
            "Guidance on locations, styling, schedules, and shot lists so the day flows smoothly.",
        },
        {
          title: "Professional capture",
          description:
            "A calm, directed shoot with an editorial approach and attention to light and detail.",
        },
        {
          title: "Retouch & delivery",
          description:
            "Careful color grading and retouching with a beautiful online gallery and print-ready exports.",
        },
      ],
    }),
    defineField({
      name: "aboutTitle",
      title: "About Page Title",
      type: "string",
      initialValue: "The Vision Behind the Frames.",
    }),
    defineField({
      name: "aboutBody",
      title: "About Intro",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "aboutLongBody",
      title: "About Long Body",
      type: "array",
      of: [{ type: "text", rows: 4 }],
    }),
    defineField({
      name: "aboutPrinciples",
      title: "Working Style Principles",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "availabilityNote",
      title: "Availability Note",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "logo",
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
      name: "email",
      type: "string",
    }),
    defineField({
      name: "instagram",
      type: "url",
    }),
    defineField({
      name: "instagramLinks",
      title: "Instagram Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "url", type: "url", validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        },
      ],
    }),
    defineField({
      name: "facebook",
      type: "url",
    }),
    defineField({
      name: "whatsapp",
      type: "url",
    }),
    defineField({
      name: "phoneNumber",
      title: "Phone Number",
      type: "string",
    }),
    defineField({
      name: "locationLine",
      title: "Location Line",
      type: "string",
    }),
    defineField({
      name: "partnerOrder",
      title: "Brand Carousel Order",
      description:
        "Drag partners into the exact order you want for the homepage brand carousel.",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "partner" }],
        },
      ],
      options: {
        sortable: true,
      },
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
