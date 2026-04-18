import type { StructureBuilder } from "sanity/structure";

export function deskStructure(S: StructureBuilder) {
  return S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site Settings"),
        ),
      S.divider(),
      S.documentTypeListItem("category").title("Categories"),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("partner").title("Industry Partners"),
      S.documentTypeListItem("review").title("Testimonials"),
      S.divider(),
      S.documentTypeListItem("contactSubmission").title("Contact Submissions"),
    ]);
}
