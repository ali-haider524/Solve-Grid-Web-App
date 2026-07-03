export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="/">
          <span className="brand-mark">∑</span>
          <span>SolveGrid</span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#tools">Tools</a>
          <a href="#how-it-works">How it works</a>
          <a href="#learn">Learn</a>
        </nav>

        <a className="header-button" href="#tools">
          Start solving
        </a>
      </header>

      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">FREE ONLINE MATH & ENGINEERING WORKSPACE</p>

          <h1>
            Solve problems.
            <span> See the math clearly.</span>
          </h1>

          <p className="hero-description">
            Graph equations, solve scientific calculations, work with matrices,
            and use practical engineering tools — directly in your browser.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="#tools">
              Explore free tools <span>→</span>
            </a>

            <a className="secondary-button" href="#how-it-works">
              See how it works
            </a>
          </div>

          <div className="hero-points">
            <span>✓ No installation</span>
            <span>✓ Works on mobile</span>
            <span>✓ Free core tools</span>
          </div>
        </div>

        <div className="hero-preview" aria-label="Calculator preview">
          <div className="preview-topbar">
            <span className="preview-dot dot-one" />
            <span className="preview-dot dot-two" />
            <span className="preview-dot dot-three" />
            <span className="preview-title">Scientific Calculator</span>
          </div>

          <div className="calculator-screen">
            <span className="screen-label">EXPRESSION</span>
            <p>sin(30°) + √81</p>
            <span className="screen-label result-label">RESULT</span>
            <h2>9.5</h2>
          </div>

          <div className="keypad">
            {["sin", "cos", "tan", "√", "7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ".", "=", "+"].map(
              (key) => (
                <button
                  className={key === "=" ? "key key-equals" : "key"}
                  key={key}
                  type="button"
                >
                  {key}
                </button>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="tools-section" id="tools">
        <div className="section-heading">
          <p className="eyebrow">CORE TOOLS</p>
          <h2>Everything needed for everyday math work.</h2>
          <p>
            Start with the right tool, get accurate results, and understand the
            calculation instead of fighting a small physical screen.
          </p>
        </div>

        <div className="tool-grid">
          <article className="tool-card featured-card">
            <div className="tool-icon">⌁</div>
            <h3>Graphing Studio</h3>
            <p>
              Plot equations, inspect points, build tables, and understand
              curves visually.
            </p>
            <span>Coming first →</span>
          </article>

          <article className="tool-card">
            <div className="tool-icon">√</div>
            <h3>Scientific Calculator</h3>
            <p>
              Fractions, powers, trigonometry, logarithms, roots, and more.
            </p>
            <span>Coming soon →</span>
          </article>

          <article className="tool-card">
            <div className="tool-icon">x²</div>
            <h3>Equation Solver</h3>
            <p>
              Solve algebraic equations with clear answer steps and graphs.
            </p>
            <span>Coming soon →</span>
          </article>

          <article className="tool-card">
            <div className="tool-icon">[ ]</div>
            <h3>Matrix & Vector Tool</h3>
            <p>
              Calculate determinants, inverses, multiplication, and vectors.
            </p>
            <span>Coming soon →</span>
          </article>
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div>
          <p className="eyebrow">BUILT FOR CLARITY</p>
          <h2>A modern workspace, not a copied calculator.</h2>
        </div>

        <div className="how-list">
          <div>
            <span>01</span>
            <p>Choose a calculator or engineering tool.</p>
          </div>
          <div>
            <span>02</span>
            <p>Enter your equation, values, units, or data.</p>
          </div>
          <div>
            <span>03</span>
            <p>Get readable answers, graphs, and useful explanations.</p>
          </div>
        </div>
      </section>

      <section className="learn-section" id="learn">
        <p className="eyebrow">LEARN WHILE YOU SOLVE</p>
        <h2>Built for students, engineers, tutors, and curious problem-solvers.</h2>
      </section>

      <footer>
        <p>© 2026 SolveGrid. Independent online math and engineering tools.</p>
      </footer>
    </main>
  );
}