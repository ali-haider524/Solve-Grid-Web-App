import GuideArticle from "../../../components/GuideArticle";
import { createStaticPageMetadata } from "../../../lib/seo";

export const metadata = createStaticPageMetadata(
  "How to Plot Multiple Equations on One Graph",
  "Learn how to plot and compare multiple equations online, use graph tables and trace values, estimate roots and intersections, and choose a useful graph window.",
  "/guides/plot-multiple-equations",
);

export default function PlotMultipleGuide() {
  return (
    <GuideArticle
      eyebrow="GRAPHING CALCULATOR GUIDE"
      title="How to plot multiple equations on one graph"
      description="Plotting two or more equations in the same coordinate window makes it easier to compare shapes, test a value, estimate roots, and see where functions intersect. SolveGrid lets you enter up to eight functions or vertical lines, then switch between graph, table, trace, and analysis views."
      slug="plot-multiple-equations"
      formula="Examples: y = 2x + 1, y = x² − 4, y = sin(x), x = 3"
      example="Plot y = x² − 4 and y = 2x + 1. In the default window, the curves meet at approximately (−1.449, −1.899) and (3.449, 7.899). Use the table near either x-value to see both outputs converge."
      steps={[
        {
          title: "Enter one relationship per equation line",
          body: "Use y = followed by an expression for a function, such as y = 2x + 1 or y = sqrt(x). Add another line for each function you want to compare. To draw a vertical line, use x = followed by a number, for example x = 3.",
        },
        {
          title: "Check the angle mode before graphing trigonometry",
          body: "For sin, cos, tan, and inverse trigonometric functions, choose degrees or radians to match the question. A graph can look unfamiliar when the expression is correct but the angle mode is wrong.",
        },
        {
          title: "Choose a graph window that reveals the important feature",
          body: "Use the default window as a starting point. Zoom in to inspect nearby roots or intersections, zoom out to compare overall behaviour, or set the x and y limits manually when a curve is outside the visible area.",
        },
        {
          title: "Use Table and Trace to inspect values",
          body: "Table view lists calculated values around the current trace position. Click or tap the graph, or move the trace slider, to select an x-value and compare the visible y-values without estimating only by eye.",
        },
        {
          title: "Use Analysis for approximate roots and intersections",
          body: "Analysis estimates x-intercepts for each visible function and crossing points for visible pairs. These values depend on the current graph window and numerical sampling, so treat them as useful approximations rather than a symbolic proof.",
        },
        {
          title: "Confirm an important algebraic answer",
          body: "When a question asks for an exact root, coefficient solution, or higher-degree polynomial root, use the Equation Solver or Polynomial Solver after using the graph to understand the likely answer and check its reasonableness.",
        },
      ]}
      toolLinks={[
        {
          label: "Graphing Calculator",
          href: "/graphing-calculator",
          description: "Plot up to eight equations, inspect value tables, trace x-values, and estimate roots and intersections.",
        },
        {
          label: "Equation Solver",
          href: "/equation-solver",
          description: "Solve linear, quadratic, cubic, and simultaneous-equation workflows when you need an algebraic result.",
        },
        {
          label: "Polynomial Solver",
          href: "/polynomial-solver",
          description: "Find real and complex numerical roots for coefficient-based polynomials from degree 1 through 10.",
        },
      ]}
    />
  );
}
