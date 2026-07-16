import type { Metadata } from "next";
import Link from "next/link";
import ToolHeader from "../../components/ToolHeader";
import SiteFooter from "../../components/SiteFooter";
import { guides } from "../../lib/guides";
import styles from "./guides.module.css";

export const metadata: Metadata = {
  title: "Calculator Guides – Graphing, Equations, Units, Matrices & Worked Examples",
  description:
    "Learn graphing workflows, equation solving, Gaussian elimination, matrix methods, scientific notation, unit conversion, statistics, finance formulas, and worked calculator examples.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="guides" />
      <section className={styles.hero}>
        <p>CALCULATION GUIDES</p>
        <h1>Learn the method, then use the tool.</h1>
        <span>
          Short practical guides built around the formulas, examples, notation
          rules, and workflows available in SolveGrid calculators.
        </span>
      </section>
      <section className={styles.grid} aria-label="SolveGrid calculation guides">
        {guides.map((guide) => (
          <Link className={styles.card} href={`/guides/${guide.slug}`} key={guide.slug}>
            <span>GUIDE</span>
            <h2>{guide.title}</h2>
            <p>{guide.summary}</p>
            <b>Read guide →</b>
          </Link>
        ))}
      </section>
      <SiteFooter />
    </main>
  );
}
