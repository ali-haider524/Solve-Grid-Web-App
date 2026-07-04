import { getToolBySlug, getToolPath } from "../lib/tools";
import { siteName, siteUrl } from "../lib/site";

type ToolSchemaProps = { slug: string };

export default function ToolSchema({ slug }: ToolSchemaProps) {
  const tool = getToolBySlug(slug);

  if (!tool) {
    return null;
  }

  const pageUrl = `${siteUrl}${getToolPath(tool)}`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: tool.name,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web",
        isAccessibleForFree: true,
        description: tool.description,
        url: pageUrl,
        publisher: {
          "@type": "Organization",
          name: siteName,
          url: siteUrl,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: tool.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Tools", item: `${siteUrl}/tools` },
          { "@type": "ListItem", position: 3, name: tool.name, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
