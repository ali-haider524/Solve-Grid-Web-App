import GuideArticle from "../../../components/GuideArticle";
import { createStaticPageMetadata } from "../../../lib/seo";

export const metadata = createStaticPageMetadata(
  "Plot Equations Online: One, Two or Multiple Functions",
  "Learn how to plot an equation online, graph two equations on the same axes, compare multiple functions, use tables and trace values, and estimate roots or intersections.",
  "/guides/plot-multiple-equations",
);

export default function PlotMultipleGuide() {
  return (
    <GuideArticle
      eyebrow="GRAPHING CALCULATOR GUIDE"
      title="How to plot one, two, or multiple equations on the same graph"
      description="Use this practical graphing guide when you need to plot an equation, graph two equations together, compare multiple functions, inspect a table of values, or estimate where curves cross. SolveGrid supports up to eight visible functions or vertical lines in one graphing workspace."
      slug="plot-multiple-equations"
      formula="Function: y = f(x)   |   Vertical line: x = c   |   Intersection: f(x) = g(x)"
      example="Plot y = x² − 4 and y = 2x + 1. The curves cross near (−1.449, −1.899) and (3.449, 7.899). Move the trace position or open the table near either x-value to compare both outputs."
      reference={{
        title: "Equation formats and what appears on the graph",
        description:
          "Use one entry for each relationship. The visible result depends on the expression, graph window, and angle mode.",
        columns: ["Task", "Example input", "What to expect"],
        rows: [
          {
            first: "Plot one equation",
            second: "y = 2x + 1",
            third: "A single straight line appears in the coordinate window.",
          },
          {
            first: "Graph two equations",
            second: "y = x² − 4 and y = 2x + 1",
            third: "Both curves appear together so roots, values, and intersections can be compared.",
          },
          {
            first: "Graph multiple functions",
            second: "Add one y = expression per line",
            third: "Each valid visible function is drawn on the same axes with its own equation entry.",
          },
          {
            first: "Plot a vertical line",
            second: "x = 3",
            third: "A vertical line is drawn through every point whose x-coordinate is 3.",
          },
          {
            first: "Enter the same equation twice",
            second: "y = x + 2 and y = x + 2",
            third: "The graphs overlap exactly, so they look like one line and share every point.",
          },
        ],
      }}
      steps={[
        {
          title: "Write the relationship in a supported graphing form",
          body: "To plot an equation as a function, enter y = followed by an expression in x, such as y = 2x + 1, y = x² − 4, or y = sin(x). For a vertical line, enter x = followed by a constant, such as x = 3.",
        },
        {
          title: "Add a separate line for every function you want to compare",
          body: "To graph two equations or several functions, keep each relationship in its own equation row. This makes it easier to hide, edit, or compare one function without rewriting the others.",
        },
        {
          title: "Check degrees or radians before plotting trigonometric functions",
          body: "For sin, cos, tan, and inverse trigonometric functions, choose the angle mode used by the question. A correct expression may still produce an unexpected graph when the calculator is using radians instead of degrees, or the other way around.",
        },
        {
          title: "Adjust the graph window until the important feature is visible",
          body: "Start with the default window, then zoom or set custom x and y limits. A graph may appear missing when its values are outside the current window, nearly flat because the scale is too wide, or cut off because the scale is too narrow.",
        },
        {
          title: "Use the table and trace controls instead of estimating only by eye",
          body: "Table view lists calculated values around the active trace position. Select an x-value and compare the y-values for each visible function to check points, signs, and nearby intersections more carefully.",
        },
        {
          title: "Estimate roots and intersections in the visible window",
          body: "A root or x-intercept occurs where a graph reaches y = 0. An intersection occurs where two functions have the same x-value and y-value. Analysis results are numerical estimates based on the current graph window, so zoom in when you need a closer approximation.",
        },
        {
          title: "Recognize overlapping or identical equations",
          body: "When the exact same equation is graphed twice, both curves occupy the same points and appear as one line. This is not a missing graph: the equations are equivalent and have infinitely many shared points.",
        },
        {
          title: "Confirm exact answers with a focused algebra tool",
          body: "Use the graph to understand shape and approximate locations. When the task requires exact roots, coefficient solutions, complex roots, or a system-of-equations method, continue with Equation Solver or Polynomial Solver.",
        },
      ]}
      faqs={[
        {
          question: "How do I plot an equation online?",
          answer: "Open the Graphing Calculator and enter the relationship in a supported form such as y = 2x + 1. Check the window limits, then use Graph, Table, Trace, or Analysis depending on what you need to inspect.",
        },
        {
          question: "How do I graph two equations on the same graph?",
          answer: "Enter each equation on a separate line. Keep both lines visible, then use the common graph window to compare their shapes and estimate any intersection points.",
        },
        {
          question: "Why do I see only one line when I graph the same equation twice?",
          answer: "Identical equations produce identical sets of points. Their graphs overlap exactly, so the two curves look like one line and share infinitely many points.",
        },
        {
          question: "How can I find where two equations intersect?",
          answer: "Look for crossing points in Graph view, then use Trace, Table, or Analysis to estimate the coordinates. For an exact algebraic result, solve f(x) = g(x) with an equation-solving method.",
        },
        {
          question: "Why is my equation not visible on the graph?",
          answer: "Check that the expression is valid, the equation is enabled, the angle mode is correct for trigonometry, and the x/y window includes the function values. Zooming out is often the fastest check.",
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
