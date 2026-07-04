import type { Metadata } from "next";
import GuideArticle from "../../../components/GuideArticle";

export const metadata: Metadata = {
  title: "Runge-Kutta RK4 Method for Differential Equations",
  description: "Learn how classical fourth-order Runge-Kutta combines four slope estimates to approximate an ordinary differential equation, with a working online RK4 solver.",
  alternates: { canonical: "/guides/runge-kutta-rk4-method" },
};

export default function RungeKuttaGuide() {
  return (
    <GuideArticle
      eyebrow="NUMERICAL METHODS GUIDE"
      title="How the Runge–Kutta RK4 method improves an ODE estimate"
      description="Classical fourth-order Runge–Kutta, often called RK4, samples several slopes inside each interval. It is a practical fixed-step method for many smooth ordinary differential equations and two-state systems."
      slug="runge-kutta-rk4-method"
      formula="yₙ₊₁ = yₙ + h(k₁ + 2k₂ + 2k₃ + k₄) / 6"
      example="For y′ = −2y + sin(x), RK4 evaluates the slope at the start, two midpoint estimates, and the end of each step before combining them into the next y value."
      steps={[
        { title: "Set the model and initial values", body: "Enter the equation right-hand side, such as −2y + sin(x), along with x₀, y₀, final x, and step size." },
        { title: "Calculate the first slope", body: "k₁ is the slope at the beginning of the interval." },
        { title: "Sample two midpoint slopes", body: "k₂ and k₃ estimate the slope halfway through the step using updated state estimates." },
        { title: "Calculate the ending slope", body: "k₄ estimates the slope at the end of the step using the third provisional state." },
        { title: "Combine the weighted slopes", body: "RK4 combines the four estimates with greater weight on the midpoint slopes, then repeats for the full interval." },
      ]}
      toolLinks={[
        { label: "Differential Equations Lab", href: "/differential-equation-solver", description: "Run RK4, view the solution curve, inspect a phase plot, and compare numerical tables." },
        { label: "Statistics Calculator", href: "/statistics-calculator", description: "Summarize simulated or measured values after exporting or copying a numerical table." },
      ]}
    />
  );
}
