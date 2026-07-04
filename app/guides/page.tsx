import type { Metadata } from "next";
import Link from "next/link";
import ToolHeader from "../../components/ToolHeader";
import SiteFooter from "../../components/SiteFooter";
import { guides } from "../../lib/guides";
import styles from "./guides.module.css";
export const metadata: Metadata = { title:"Calculator Guides – Formulas, Methods & Worked Examples", description:"Learn graphing, equations, matrices, statistics, unit conversion, finance, and age-calculation methods with concise guides linked to working SolveGrid calculators.", alternates:{canonical:"/guides"} };
export default function GuidesPage(){return <main id="main-content" className={styles.page}><ToolHeader/><section className={styles.hero}><p>CALCULATION GUIDES</p><h1>Learn the method, then use the tool.</h1><span>Short practical guides built around the formulas and workflows available in SolveGrid.</span></section><section className={styles.grid}>{guides.map((guide)=><Link className={styles.card} href={`/guides/${guide.slug}`} key={guide.slug}><span>GUIDE</span><h2>{guide.title}</h2><p>{guide.summary}</p><b>Read guide →</b></Link>)}</section><SiteFooter/></main>}
