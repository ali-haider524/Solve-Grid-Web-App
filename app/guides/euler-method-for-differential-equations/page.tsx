import type { Metadata } from "next";
import GuideArticle from "../../../components/GuideArticle";

export const metadata: Metadata = {
  title: "Euler Method for Differential Equations",
  description: "Learn how Euler's method estimates a first-order differential equation from an initial condition and fixed step size, then test it in SolveGrid's numerical ODE lab.",
  alternates: { canonical: "/guides/euler-method-for-differential-equations" },
};

export default function EulerMethodGuide() {
  return (
    <GuideArticle
      eyebrow="NUMERICAL METHODS GUIDE"
      title="How Euler's method estimates a differential equation"
      description="Euler's method advances an initial value problem one fixed step at a time by using the current slope. It is simple, transparent, and useful for checking how step size affects a numerical approximation."
      slug="euler-method-for-differential-equations"
      formula="yₙ₊₁ = yₙ + h · f(xₙ, yₙ)"
      example="For y′ = y with y(0) = 1 and h = 0.1, Euler's method uses the current value of y as the slope, then repeats the update across the selected x interval."
      steps={[
        { title: "Write the initial value problem", body: "Start with a right-hand side such as y′ = f(x, y), an initial x value, and an initial y value." },
        { title: "Choose a fixed step size", body: "The step h controls how far the method advances at each update. Smaller steps usually improve accuracy but require more calculations." },
        { title: "Evaluate the current slope", body: "At the current point, calculate f(xₙ, yₙ). This is the slope used for the next local estimate." },
        { title: "Update the state", body: "Add h multiplied by the slope to yₙ, move x forward by h, and repeat until the final x value is reached." },
        { title: "Check the approximation", body: "Compare a smaller step size or a higher-order method such as Heun or RK4 before relying on the result." },
      ]}
      toolLinks={[
        { label: "Differential Equations Lab", href: "/differential-equation-solver", description: "Run Euler, Improved Euler, or RK4 with custom initial conditions and step size." },
        { label: "Graphing Calculator", href: "/graphing-calculator", description: "Plot related functions and inspect the behavior suggested by the numerical model." },
      ]}
    />
  );
}
