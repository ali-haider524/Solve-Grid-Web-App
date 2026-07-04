import { getToolBySlug, getToolPath, type ToolSlug } from "../lib/tools";
import { siteName, siteUrl } from "../lib/site";

type ToolStructuredDataProps = {
  currentTool: ToolSlug;
};

export default function ToolStructuredData({ currentTool }: ToolStructuredDataProps) {
  const tool = getToolBySlug(currentTool);

  if (!tool) {
    return null;
  }

  const toolUrl = `${siteUrl}${getToolPath(tool)}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: `${tool.name} | ${siteName}`,
        description: tool.description,
        url: toolUrl,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
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
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Tools",
            item: `${siteUrl}/tools`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: tool.name,
            item: toolUrl,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
