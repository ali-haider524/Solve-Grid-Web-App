import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import ToolHeader from "../components/ToolHeader";
import { getFeaturedTools, tools } from "../lib/tools";

export default function Home() {
  const featuredTools = getFeaturedTools(6);
  return (
    <main id="main-content" className="home-page">
      <ToolHeader />
      <section className="hero">
        <div className="hero-content"><p className="eyebrow">FREE ONLINE MATH, ENGINEERING, RESEARCH & EVERYDAY TOOLS</p><h1>Solve problems.<span> See the math clearly.</span></h1><p className="hero-description">Graph equations, solve algebra, convert units, work with matrices, run numerical models, calculate percentages, and use practical tools directly in your browser.</p><div className="hero-actions"><Link className="primary-button" href="/tools">Explore all tools <span>→</span></Link><Link className="secondary-button" href="/graphing-calculator">Open graphing studio</Link></div><div className="hero-points"><span>✓ No installation</span><span>✓ Works on mobile</span><span>✓ Free core tools</span></div></div>
        <div className="hero-preview" aria-label="Calculator preview"><div className="preview-topbar"><span className="preview-dot dot-one"/><span className="preview-dot dot-two"/><span className="preview-dot dot-three"/><span className="preview-title">SolveGrid workspace</span></div><div className="calculator-screen"><span className="screen-label">EXPRESSION</span><p>sqrt(81) + 3²</p><span className="screen-label result-label">RESULT</span><h2>18</h2></div><div className="keypad">{["sin","cos","tan","√","7","8","9","÷","4","5","6","×","1","2","3","−","0",".","=","+"].map((key,index)=><span className={key === "=" ? "key key-equals" : "key"} key={`${key}-${index}`}>{key}</span>)}</div></div>
      </section>
      <section className="tools-section" id="tools"><div className="section-heading"><p className="eyebrow">CONNECTED TOOL PLATFORM</p><h2>Choose the right calculator, then move naturally to the next step.</h2><p>Each tool is built for a specific problem and includes useful links to related calculators, examples, and clear explanations.</p></div><div className="tool-grid tool-grid-expanded">{featuredTools.map((tool)=><Link className={`tool-card ${tool.slug === "graphing-calculator" ? "featured-card" : ""}`} href={`/${tool.slug}`} key={tool.slug}><div className="tool-icon">{tool.icon}</div><h3>{tool.name}</h3><p>{tool.summary}</p><span>Open tool →</span></Link>)}</div><div className="home-directory-link"><Link href="/tools">Browse all {tools.length} free tools →</Link></div></section>
      <section className="how-section" id="how-it-works"><div><p className="eyebrow">BUILT FOR CLARITY</p><h2>A connected workspace, not a copied calculator.</h2></div><div className="how-list"><div><span>01</span><p>Choose a purpose-built calculator.</p></div><div><span>02</span><p>Enter values, equations, measurements, or data.</p></div><div><span>03</span><p>Use related tools to graph, verify, convert, or explore further.</p></div></div></section>
      <section className="research-spotlight"><div><p className="eyebrow">RESEARCH & SIMULATION LABS</p><h2>Numerical modelling deserves a dedicated workspace.</h2><p>Explore controlled numerical methods for differential equations, then connect graphs, matrices, and statistics to the rest of the investigation.</p></div><Link href="/research-tools">Explore research labs →</Link></section>
      <section className="learn-section" id="learn"><p className="eyebrow">MADE FOR REAL PROBLEMS</p><h2>Students, engineers, tutors, professionals, and anyone who needs a clear answer.</h2></section>
      <SiteFooter />
    </main>
  );
}
