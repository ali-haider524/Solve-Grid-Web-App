import type { Metadata } from "next";
import GuideArticle from "../../../components/GuideArticle";

export const metadata: Metadata = {
  title: "Profit Margin vs Markup – Formula, Difference & Calculator",
  description:
    "Understand profit margin vs markup with formulas, a worked cost and selling price example, and a free profit and loss calculator.",
  alternates: { canonical: "/guides/profit-margin-vs-markup" },
};

export default function ProfitMarginGuide() {
  return (
    <GuideArticle
      eyebrow="PROFIT & MARGIN GUIDE"
      title="Profit margin vs markup: formula, difference, and example"
      description="Markup and profit margin both describe profit, but they use different base values. Markup compares profit with cost price; margin compares profit with selling price."
      slug="profit-margin-vs-markup"
      formula="profit = selling price − cost price; markup = profit ÷ cost × 100; margin = profit ÷ selling price × 100"
      example="If cost is 80 and selling price is 100, profit is 20. Markup is 20 ÷ 80 × 100 = 25%. Margin is 20 ÷ 100 × 100 = 20%."
      steps={[
        {
          title: "Find the profit or loss amount",
          body: "Subtract cost price from selling price. A positive result is profit. A negative result is loss.",
        },
        {
          title: "Calculate markup from cost price",
          body: "Divide profit by cost price and multiply by 100. Markup answers how much you added above cost.",
        },
        {
          title: "Calculate margin from selling price",
          body: "Divide profit by selling price and multiply by 100. Profit margin answers what percentage of revenue remains as profit before other costs.",
        },
        {
          title: "Do not treat markup and margin as the same number",
          body: "A 25% markup does not mean a 25% profit margin because the denominators are different. Markup uses cost, while margin uses selling price.",
        },
        {
          title: "Use the correct metric for pricing decisions",
          body: "Use markup when setting a price from cost. Use margin when comparing profitability across products, sales, or business reports.",
        },
      ]}
      toolLinks={[
        {
          label: "Profit, Loss & Margin Calculator",
          href: "/profit-loss-calculator",
          description: "Calculate profit, loss, markup, and margin from cost price and selling price.",
        },
        {
          label: "Percentage Calculator",
          href: "/percentage-calculator?mode=margin",
          description: "Use percentage workflows for margin, percentage change, and reverse percentage questions.",
        },
      ]}
    />
  );
}
