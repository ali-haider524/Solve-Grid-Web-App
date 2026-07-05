import GuideArticle from "../../../components/GuideArticle";
import { createStaticPageMetadata } from "../../../lib/seo";

export const metadata = createStaticPageMetadata(
  "TI-84 Style Online Graphing Calculator Workflows",
  "Learn independent online graphing workflows for functions, tables, trace values, intersections, matrices, and statistics. SolveGrid is not affiliated with Texas Instruments.",
  "/guides/ti-84-style-graphing-workflows",
);

export default function TiStyleGraphingWorkflowsGuide() {
  return (
    <GuideArticle
      eyebrow="ONLINE GRAPHING WORKFLOW GUIDE"
      title="TI-84 style graphing workflows — independently online"
      description="Use an online graphing workflow for the tasks many students associate with a handheld graphing calculator: entering functions, adjusting a window, inspecting a table, tracing values, and checking intersections. SolveGrid is independent and not affiliated with Texas Instruments."
      slug="ti-84-style-graphing-workflows"
      formula="y = f(x)"
      example="Enter y = x² − 4 and y = 2x + 1, then inspect the graph and table to estimate their intersections."
      steps={[
        {
          title: "Enter one relationship per graph line",
          body: "Use a separate y = expression for each function you want to compare. An expression such as y = 2x + 1 is a line; y = x² − 4 is a parabola. The SolveGrid Graphing Calculator also accepts a vertical line such as x = 3.",
        },
        {
          title: "Set a useful graph window",
          body: "Choose x and y limits that include the important part of the functions. A window that is too wide can hide detail, while one that is too narrow can cut off roots or intersections.",
        },
        {
          title: "Use graph, table, and trace together",
          body: "The graph gives the overall shape. The table helps inspect exact input-output pairs, and trace values help check a particular x-coordinate before making a conclusion.",
        },
        {
          title: "Use a focused tool for the next method",
          body: "For coefficients or algebraic solutions, move to the Equation Solver. For matrices, statistics, or polynomial roots, use their dedicated workspaces instead of forcing every task into one graph screen.",
        },
      ]}
      toolLinks={[
        {
          label: "Graphing Calculator",
          href: "/graphing-calculator",
          description: "Plot up to eight equations, inspect tables, trace values, roots, and intersections.",
        },
        {
          label: "Equation Solver",
          href: "/equation-solver",
          description: "Solve linear, quadratic, cubic, and linear-system workflows with visible methods.",
        },
        {
          label: "Matrix Calculator",
          href: "/matrix-calculator",
          description: "Use dedicated matrix operations, RREF, inverse, rank, and system-solving methods.",
        },
      ]}
    />
  );
}
