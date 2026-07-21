import {
  getCategoryPath,
  getToolBySlug,
  getToolPath,
  toolCategories,
} from "../lib/tools";
import { siteName, siteUrl } from "../lib/site";

type ToolSchemaProps = { slug: string };

export default function ToolSchema({ slug }: ToolSchemaProps) {
  const tool = getToolBySlug(slug);

  if (!tool) return null;

  const pageUrl = `${siteUrl}${getToolPath(tool)}`;
  const categoryInfo = toolCategories[tool.category];
  const categoryUrl = `${siteUrl}${getCategoryPath(tool.category)}`;
  const applicationId = `${pageUrl}#application`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        name: tool.title,
        description: tool.description,
        url: pageUrl,
        inLanguage: "en",
        isPartOf: { "@type": "WebSite", name: siteName, url: siteUrl },
        mainEntity: { "@id": applicationId },
      },
      {
        "@type": "WebApplication",
        "@id": applicationId,
        name: tool.name,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web",
        browserRequirements: "Requires a modern web browser with JavaScript enabled",
        isAccessibleForFree: true,
        description: tool.description,
        url: pageUrl,
        featureList: tool.features ?? tool.useCases,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        publisher: {
          "@type": "Organization",
          name: siteName,
          url: siteUrl,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
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
          {
            "@type": "ListItem",
            position: 2,
            name: "Tools",
            item: `${siteUrl}/tools`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: categoryInfo.label,
            item: categoryUrl,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: tool.name,
            item: pageUrl,
          },
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
