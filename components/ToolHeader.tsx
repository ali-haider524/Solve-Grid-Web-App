"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  getCategoryPath,
  getToolPath,
  getToolsByCategory,
  type ToolCategory,
} from "../lib/tools";
import styles from "./ToolHeader.module.css";

type ToolHeaderProps = {
  active?: ToolCategory | "tools" | "guides" | "about";
};

const categoryLinks: Array<{ category: ToolCategory; label: string }> = [
  { category: "math", label: "Math & algebra" },
  { category: "engineering", label: "Scientific & engineering" },
  { category: "research", label: "Research labs" },
  { category: "everyday", label: "Everyday calculators" },
];

// The header surfaces the most-used tools only. Each category page still lists
// every workspace in that category.
const menuToolSlugsByCategory: Record<ToolCategory, string[]> = {
  math: [
    "graphing-calculator",
    "equation-solver",
    "polynomial-solver",
    "matrix-calculator",
    "statistics-calculator",
  ],
  engineering: ["scientific-calculator", "unit-converter"],
  research: [
    "differential-equation-solver",
    "symbolic-algebra",
    "optimization-lab",
    "circuit-analysis",
    "advanced-statistics",
  ],
  everyday: [
    "percentage-calculator",
    "compound-interest-calculator",
    "loan-calculator",
    "discount-calculator",
    "age-calculator",
  ],
};

function getMenuTools(category: ToolCategory) {
  const categoryTools = getToolsByCategory(category);

  return menuToolSlugsByCategory[category]
    .map((slug) => categoryTools.find((tool) => tool.slug === slug))
    .filter((tool): tool is (typeof categoryTools)[number] => Boolean(tool));
}

export default function ToolHeader({ active }: ToolHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCategoryPanel, setMobileCategoryPanel] =
    useState<ToolCategory | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (mobileCategoryPanel) {
          setMobileCategoryPanel(null);
        } else {
          setMobileOpen(false);
        }
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileCategoryPanel, mobileOpen]);

  const closeMobile = () => {
    setMobileCategoryPanel(null);
    setMobileOpen(false);
  };

  const openMobileMenu = () => {
    setMobileCategoryPanel(null);
    setMobileOpen((open) => !open);
  };

  const isGuidesPage = pathname === "/guides" || pathname.startsWith("/guides/");
  const selectedMobileCategory = mobileCategoryPanel
    ? categoryLinks.find((item) => item.category === mobileCategoryPanel)
    : undefined;
  const selectedMobileTools = mobileCategoryPanel
    ? getMenuTools(mobileCategoryPanel)
    : [];

  const navLinkClass = (isCurrent: boolean) =>
    isCurrent ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  const mobileLinkClass = (isCurrent: boolean, primary = false) =>
    [
      styles.mobileLink,
      primary ? styles.mobileLinkPrimary : "",
      isCurrent ? styles.mobileLinkActive : "",
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <header className={styles.header}>
      <a className={styles.skipLink} href="#main-content">
        Skip to main content
      </a>

      <div className={styles.inner}>
        <Link className={styles.brand} href="/" aria-label="SolveGrid home">
          <span className={styles.brandMark}>∑</span>
          <span>SolveGrid</span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {categoryLinks.map((item) => {
            const isCurrent = active === item.category;
            const menuTools = getMenuTools(item.category);

            return (
              <div className={styles.desktopCategory} key={item.category}>
                <Link
                  aria-current={isCurrent ? "page" : undefined}
                  className={navLinkClass(isCurrent)}
                  href={getCategoryPath(item.category)}
                >
                  <span>{item.label}</span>
                  <span aria-hidden="true" className={styles.navChevron}>
                    ⌄
                  </span>
                </Link>

                <div className={styles.desktopDropdown}>
                  <div className={styles.dropdownSurface}>
                    <p>{item.label}</p>

                    <div className={styles.dropdownLinks}>
                      {menuTools.map((tool) => (
                        <Link href={getToolPath(tool)} key={tool.slug}>
                          {tool.name}
                          <span aria-hidden="true">→</span>
                        </Link>
                      ))}
                    </div>

                    <Link
                      className={styles.dropdownViewAll}
                      href={getCategoryPath(item.category)}
                    >
                      View all {item.label} <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          <Link
            aria-current={isGuidesPage ? "page" : undefined}
            className={navLinkClass(isGuidesPage || active === "guides")}
            href="/guides"
          >
            Guides
          </Link>

          <Link
            aria-current={pathname === "/about" ? "page" : undefined}
            className={navLinkClass(pathname === "/about" || active === "about")}
            href="/about"
          >
            About
          </Link>
        </nav>

        <Link
          className={`${styles.action} ${
            active === "tools" || pathname === "/tools" ? styles.actionActive : ""
          }`}
          href="/tools"
        >
          All tools
        </Link>

        <button
          aria-controls="solvegrid-mobile-menu"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          className={styles.menuButton}
          onClick={openMobileMenu}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {mobileOpen ? (
        <div className={styles.mobileLayer} id="solvegrid-mobile-menu">
          <button
            aria-label="Close navigation"
            className={styles.mobileBackdrop}
            onClick={closeMobile}
            type="button"
          />

          <aside aria-label="SolveGrid navigation" className={styles.mobileDrawer}>
            <div className={styles.drawerTop}>
              <div>
                <span>MENU</span>
                <strong>Explore SolveGrid</strong>
              </div>

              <button aria-label="Close menu" onClick={closeMobile} type="button">
                ×
              </button>
            </div>

            <nav className={styles.mobileNav} aria-label="Mobile navigation">
              <Link
                className={mobileLinkClass(
                  active === "tools" || pathname === "/tools",
                  true,
                )}
                href="/tools"
                onClick={closeMobile}
              >
                <span>All tools</span>
                <b aria-hidden="true">→</b>
              </Link>

              {categoryLinks.map((item) => {
                const isCurrent = active === item.category;

                return (
                  <button
                    aria-current={isCurrent ? "page" : undefined}
                    className={`${styles.mobileCategoryCard} ${
                      isCurrent ? styles.mobileCategoryCardActive : ""
                    }`}
                    key={item.category}
                    onClick={() => setMobileCategoryPanel(item.category)}
                    type="button"
                  >
                    <span>{item.label}</span>
                    <b aria-hidden="true">→</b>
                  </button>
                );
              })}

              <Link
                aria-current={isGuidesPage ? "page" : undefined}
                className={mobileLinkClass(isGuidesPage || active === "guides")}
                href="/guides"
                onClick={closeMobile}
              >
                <span>Guides</span>
                <b aria-hidden="true">→</b>
              </Link>

              <Link
                aria-current={pathname === "/about" ? "page" : undefined}
                className={mobileLinkClass(pathname === "/about" || active === "about")}
                href="/about"
                onClick={closeMobile}
              >
                <span>About</span>
                <b aria-hidden="true">→</b>
              </Link>

              <Link
                className={mobileLinkClass(pathname === "/contact")}
                href="/contact"
                onClick={closeMobile}
              >
                <span>Contact</span>
                <b aria-hidden="true">→</b>
              </Link>
            </nav>

            {selectedMobileCategory && mobileCategoryPanel ? (
              <section
                aria-label={`${selectedMobileCategory.label} tools`}
                className={styles.mobileCategoryPanel}
              >
                <div className={styles.mobilePanelTop}>
                  <button
                    aria-label="Back to menu"
                    className={styles.mobilePanelBack}
                    onClick={() => setMobileCategoryPanel(null)}
                    type="button"
                  >
                    ←
                  </button>

                  <div>
                    <span>TOOLS</span>
                    <strong>{selectedMobileCategory.label}</strong>
                  </div>
                </div>

                <div className={styles.mobilePanelTools}>
                  {selectedMobileTools.map((tool) => (
                    <Link
                      href={getToolPath(tool)}
                      key={tool.slug}
                      onClick={closeMobile}
                    >
                      <span>{tool.name}</span>
                      <b aria-hidden="true">→</b>
                    </Link>
                  ))}
                </div>

                <Link
                  className={styles.mobilePanelViewAll}
                  href={getCategoryPath(mobileCategoryPanel)}
                  onClick={closeMobile}
                >
                  <span>View all {selectedMobileCategory.label}</span>
                  <b aria-hidden="true">→</b>
                </Link>
              </section>
            ) : null}
          </aside>
        </div>
      ) : null}
    </header>
  );
}
