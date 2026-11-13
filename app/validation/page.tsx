import Link from "next/link";
import LegalPage from "../../components/LegalPage";
import { createStaticPageMetadata } from "../../lib/seo";
import { siteUrl } from "../../lib/site";
import { validationReference, validationRows, validationRunDate } from "../../lib/validation-results";
import styles from "./validation.module.css";

export const metadata = createStaticPageMetadata(
  "Calculator Validation: SolveGrid vs SciPy Reference Values",
  "How SolveGrid statistics calculators are checked: every test re-run on fixed datasets and compared with independent SciPy and NumPy reference values.",
  "/validation",
);

const toolLinks: Record<string, string> = {
  "Welch t-test": "/t-test-calculator",
  "Student's t-test": "/t-test-calculator",
  "Paired t-test": "/t-test-calculator",
  "One-sample t-test": "/t-test-calculator",
  "One-way ANOVA": "/one-way-anova-calculator",
  "Chi-square independence": "/chi-square-calculator",
  "Pearson correlation": "/correlation-calculator",
  "Spearman correlation": "/correlation-calculator",
  "Kendall's tau": "/correlation-calculator",
  "Mann-Whitney U": "/mann-whitney-u-test-calculator",
  "Wilcoxon signed-rank": "/wilcoxon-signed-rank-test-calculator",
  "Kruskal-Wallis": "/kruskal-wallis-test-calculator",
  "Friedman test": "/friedman-test-calculator",
  "Shapiro-Wilk": "/shapiro-wilk-test-calculator",
  "Cronbach's alpha": "/cronbach-alpha-calculator",
  "McDonald's omega": "/cronbach-alpha-calculator",
  "Linear regression": "/linear-regression-calculator",
  "McNemar (exact)": "/mcnemar-test-calculator",
  "p value calculator": "/p-value-calculator",
  "Confidence interval (mean)": "/confidence-interval-calculator",
  "Confidence interval (proportion)": "/confidence-interval-calculator",
  "Margin of error": "/margin-of-error-calculator",
  "Fisher's exact test": "/fishers-exact-test-calculator",
  "Two-way ANOVA (Type III)": "/two-way-anova-calculator",
  "Repeated-measures ANOVA": "/repeated-measures-anova-calculator",
  "Logistic regression": "/logistic-regression-calculator",
  "Kendall's W": "/kendalls-w-calculator",
  "Fleiss' kappa": "/fleiss-kappa-calculator",
  "ANCOVA": "/ancova-calculator",
  "One-way MANOVA": "/manova-calculator",
  "Factor analysis (EFA)": "/factor-analysis-calculator",
};

const show = (v: number) => (Math.abs(v) < 0.001 && v !== 0 ? v.toExponential(4) : Number(v.toPrecision(7)).toString());
const runLabel = new Date(`${validationRunDate}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default function ValidationPage() {
  const passed = validationRows.filter((row) => row.ok).length;
  const maxDiff = Math.max(...validationRows.map((row) => Math.abs(row.solvegrid - row.reference)));
  const tests = new Set(validationRows.map((row) => row.test)).size;
  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${siteUrl}/validation#dataset`,
    name: "SolveGrid statistics calculator validation results",
    description: `${validationRows.length} numerical checks across ${tests} statistical tests comparing SolveGrid's browser calculations with independent reference implementations in ${validationReference}. ${passed} of ${validationRows.length} checks matched; largest absolute difference ${maxDiff.toExponential(1)}.`,
    url: `${siteUrl}/validation`,
    dateModified: validationRunDate,
    creator: { "@id": `${siteUrl}/#organization` },
    publisher: { "@id": `${siteUrl}/#organization` },
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
    keywords: ["statistics calculator validation", "SciPy", "NumPy", "t-test", "ANOVA", "chi-square", "Cronbach's alpha", "factor analysis"],
    measurementTechnique: "Re-computation of each statistic on fixed datasets with SciPy and NumPy; agreement within 0.1% relative tolerance",
    variableMeasured: [...new Set(validationRows.map((row) => row.test))],
  };
  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
    <LegalPage
      path="/validation"
      eyebrow="VALIDATION"
      title="Calculator Validation Against Reference Software"
      description="Every statistics calculator is re-run on fixed datasets and compared with independent reference values from SciPy and NumPy, the scientific Python libraries used in research."
      updated={runLabel}
      sections={[
        {
          title: "How the check works",
          paragraphs: [
            "The same calculation code that runs in your browser is run on fixed example datasets. Each result is then recomputed with a separate reference implementation in Python using SciPy and NumPy, and the two answers are compared.",
            "A result passes when the two values agree to within 0.1% (0.5% for the Mann-Whitney normal approximation and 2% for the Shapiro-Wilk p value, which both software packages approximate). In practice the largest difference in this run was far smaller than that, as the table shows.",
          ],
        },
        {
          title: "What this does and does not show",
          paragraphs: [
            "The check confirms the formulas and numerical routines give the same answers as widely used reference software on these datasets. It does not check that a test suits your data or design: see each calculator's assumptions and the statistical test chooser for that.",
            "The datasets, the SolveGrid runner and the Python reference script are kept in the site's source code (scripts/validation) so the check can be repeated after any change.",
          ],
        },
      ]}
    >
      <section>
        <h2>Results of the latest run</h2>
        <p>
          Run on {runLabel} against {validationReference}. {passed} of {validationRows.length} checks across {tests} tests passed. The largest absolute
          difference was {maxDiff.toExponential(1)}.
        </p>
        <div className={styles.summary}>
          <span>{passed}/{validationRows.length} checks passed</span>
          <span>{tests} statistical tests</span>
          <span>Max difference {maxDiff.toExponential(1)}</span>
        </div>
        <div className={styles.tableWrap}>
          <table>
            <caption className={styles.caption}>SolveGrid results compared with SciPy reference values</caption>
            <thead>
              <tr>
                <th scope="col">Test</th>
                <th scope="col">Quantity</th>
                <th scope="col">SolveGrid</th>
                <th scope="col">Reference</th>
                <th scope="col">Result</th>
              </tr>
            </thead>
            <tbody>
              {validationRows.map((row) => (
                <tr key={`${row.test}-${row.label}`}>
                  <td>{toolLinks[row.test] ? <Link href={toolLinks[row.test]}>{row.test}</Link> : row.test}</td>
                  <td>{row.label}</td>
                  <td>{show(row.solvegrid)}</td>
                  <td>{show(row.reference)}</td>
                  <td className={row.ok ? styles.pass : styles.fail}>{row.ok ? "Match" : "Differs"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          These validation results are licensed under{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/" rel="license noopener" target="_blank">
            Creative Commons Attribution 4.0 (CC BY 4.0)
          </a>
          . You may reuse them with credit to SolveGrid and a link to this page.
        </p>
      </section>
    </LegalPage>
    </>
  );
}
