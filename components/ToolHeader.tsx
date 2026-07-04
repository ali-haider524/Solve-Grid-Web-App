"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  getCategoryPath,
  getToolPath,
  getToolsByCategory,
  toolCategories,
  type ToolCategory,
} from "../lib/tools";
import styles from "./ToolHeader.module.css";

type ToolHeaderProps = {
  active?: ToolCategory | "tools" | "guides" | "about";
};

const categories = Object.keys(toolCategories) as ToolCategory[];
const desktopToolLimit = 6;

function getInitialCategory(active?: ToolHeaderProps["active"]): ToolCategory {
  return active && categories.includes(active as ToolCategory)
    ? (active as ToolCategory)
    : "math";
}

function getMenuDescription(
  tool: ReturnType<typeof getToolsByCategory>[number],
) {
  return tool.features?.[0] ?? tool.useCases[0] ?? tool.summary;
}

export default function ToolHeader({ active }: ToolHeaderProps) {
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>(
    getInitialCategory(active),
  );
  const desktopMenuRef = useRef<HTMLDivElement>(null);

  const selectedCategoryInfo = toolCategories[selectedCategory];
  const selectedTools = getToolsByCategory(selectedCategory);
  const visibleDesktopTools = selectedTools.slice(0, desktopToolLimit);

  useEffect(() => {
    if (!desktopOpen) {
      return;
    }

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!desktopMenuRef.current?.contains(event.target as Node)) {
        setDesktopOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDesktopOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [desktopOpen]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  const closeDesktop = () => setDesktopOpen(false);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className={styles.header}>
      <a className={styles.skipLink} href="#main-content">
        Skip to main tool
      </a>

      <div className={styles.inner}>
        <Link className={styles.brand} href="/" aria-label="SolveGrid home">
          <span className={styles.brandMark}>∑</span>
          <span>SolveGrid</span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary navigation">
          <div className={styles.toolsExplorer} ref={desktopMenuRef}>
            <button
              aria-controls="solvegrid-tools-explorer"
              aria-expanded={desktopOpen}
              className={`${styles.toolsTrigger} ${
                desktopOpen || active === "tools" ? styles.toolsTriggerActive : ""
              }`}
              onClick={() => setDesktopOpen((open) => !open)}
              type="button"
            >
              Tools
              <span
                aria-hidden="true"
                className={`${styles.chevron} ${
                  desktopOpen ? styles.chevronOpen : ""
                }`}
              >
                ⌄
              </span>
            </button>

            {desktopOpen ? (
              <div
                className={styles.explorerPanel}
                id="solvegrid-tools-explorer"
              >
                <div className={styles.explorerHeader}>
                  <div>
                    <p>TOOL NAVIGATOR</p>
                    <strong>Choose a calculator by the problem you want to solve.</strong>
                  </div>
                  <Link href="/tools" onClick={closeDesktop}>
                    All tools <span aria-hidden="true">→</span>
                  </Link>
                </div>

                <div className={styles.explorerBody}>
                  <div
                    className={styles.categoryTabs}
                    aria-label="Calculator categories"
                  >
                    {categories.map((category) => (
                      <button
                        aria-pressed={selectedCategory === category}
                        className={
                          selectedCategory === category
                            ? `${styles.categoryTab} ${styles.categoryTabActive}`
                            : styles.categoryTab
                        }
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        type="button"
                      >
                        <span
                          className={`${styles.categoryMarker} ${styles[
                            `marker${category[0].toUpperCase()}${category.slice(1)}`
                          ]}`}
                        />
                        <span>{toolCategories[category].label}</span>
                        <small>{getToolsByCategory(category).length}</small>
                      </button>
                    ))}
                  </div>

                  <section
                    aria-label={selectedCategoryInfo.label}
                    className={styles.menuTools}
                  >
                    <div className={styles.menuToolsHeading}>
                      <div>
                        <p>{selectedCategoryInfo.label.toUpperCase()}</p>
                        <span>{selectedCategoryInfo.description}</span>
                      </div>
                      <Link
                        href={getCategoryPath(selectedCategory)}
                        onClick={closeDesktop}
                      >
                        View category →
                      </Link>
                    </div>

                    <div className={styles.menuToolGrid}>
                      {visibleDesktopTools.map((tool) => (
                        <Link
                          className={styles.menuToolLink}
                          href={getToolPath(tool)}
                          key={tool.slug}
                          onClick={closeDesktop}
                        >
                          <span className={styles.menuToolIcon}>{tool.icon}</span>
                          <span className={styles.menuToolCopy}>
                            <strong>{tool.name}</strong>
                            <small>{getMenuDescription(tool)}</small>
                          </span>
                          <b aria-hidden="true">→</b>
                        </Link>
                      ))}
                    </div>

                    {selectedTools.length > desktopToolLimit ? (
                      <Link
                        className={styles.moreToolsLink}
                        href={getCategoryPath(selectedCategory)}
                        onClick={closeDesktop}
                      >
                        See all {selectedTools.length} {selectedCategoryInfo.label.toLowerCase()} →
                      </Link>
                    ) : null}
                  </section>
                </div>
              </div>
            ) : null}
          </div>

          <Link
            className={
              active === "research"
                ? `${styles.navLink} ${styles.navLinkActive}`
                : styles.navLink
            }
            href="/research-tools"
          >
            Research labs
          </Link>
          <Link
            className={
              active === "guides"
                ? `${styles.navLink} ${styles.navLinkActive}`
                : styles.navLink
            }
            href="/guides"
          >
            Guides
          </Link>
          <Link
            className={
              active === "about"
                ? `${styles.navLink} ${styles.navLinkActive}`
                : styles.navLink
            }
            href="/about"
          >
            About
          </Link>
        </nav>

        <Link className={styles.action} href="/tools">
          Browse tools
        </Link>

        <button
          aria-controls="solvegrid-mobile-menu"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          className={styles.menuButton}
          onClick={() => setMobileOpen((open) => !open)}
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
          <aside
            aria-label="SolveGrid navigation"
            className={styles.mobileDrawer}
          >
            <div className={styles.drawerTop}>
              <div>
                <span>TOOL NAVIGATOR</span>
                <strong>Open the calculator that matches your problem.</strong>
              </div>
              <button onClick={closeMobile} type="button">
                Close <span aria-hidden="true">×</span>
              </button>
            </div>

            <Link
              className={styles.drawerAllTools}
              href="/tools"
              onClick={closeMobile}
            >
              <span>⌁</span>
              <span>
                <strong>Browse all calculators</strong>
                <small>Compare every SolveGrid workspace in one place.</small>
              </span>
              <b aria-hidden="true">→</b>
            </Link>

            {categories.map((category, index) => (
              <details
                className={styles.drawerCategory}
                key={category}
                open={active === category || (!active && index === 0)}
              >
                <summary>
                  <span>
                    <strong>{toolCategories[category].label}</strong>
                    <small>{toolCategories[category].description}</small>
                  </span>
                  <b aria-hidden="true">⌄</b>
                </summary>

                <div>
                  {getToolsByCategory(category).map((tool) => (
                    <Link
                      href={getToolPath(tool)}
                      key={tool.slug}
                      onClick={closeMobile}
                    >
                      <span className={styles.drawerToolIcon}>{tool.icon}</span>
                      <span>
                        <strong>{tool.name}</strong>
                        <small>{getMenuDescription(tool)}</small>
                      </span>
                    </Link>
                  ))}
                  <Link
                    className={styles.drawerCategoryLink}
                    href={getCategoryPath(category)}
                    onClick={closeMobile}
                  >
                    View all {toolCategories[category].label} →
                  </Link>
                </div>
              </details>
            ))}

            <div className={styles.drawerUtilityLinks}>
              <Link href="/research-tools" onClick={closeMobile}>
                Research labs
              </Link>
              <Link href="/guides" onClick={closeMobile}>
                Guides
              </Link>
              <Link href="/about" onClick={closeMobile}>
                About
              </Link>
              <Link href="/contact" onClick={closeMobile}>
                Contact
              </Link>
            </div>
          </aside>
        </div>
      ) : null}
    </header>
  );
}
