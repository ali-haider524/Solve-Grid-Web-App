import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import ToolHeader from "../components/ToolHeader";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main id="main-content" className={styles.page}>
      <ToolHeader active="tools" />
      <section className={styles.card}>
        <p>404 · PAGE NOT FOUND</p>
        <h1>That calculator page is not available.</h1>
        <span>
          Use the tool directory to find a live SolveGrid calculator, graphing workspace,
          converter, solver, or guide. If you followed an old link, browse the current tool directory.
        </span>
        <div>
          <Link href="/tools">Browse all tools</Link>
          <Link href="/guides">Browse guides</Link>
          <Link href="/">Back to home</Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
