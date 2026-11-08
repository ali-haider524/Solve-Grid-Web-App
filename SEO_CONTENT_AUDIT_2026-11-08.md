# SolveGrid content audit: intent, E-E-A-T, answer-first and competitor gaps (8 Nov 2026)

## 1. Intent match (format on page one vs our format)

| Query type | What Google ranks | Our page | Match |
|---|---|---|---|
| "X calculator" (t-test, ANOVA, chi-square, sample size, SD…) | Working calculators with steps | Calculator page with method notes | Yes |
| "X formula" / "how to calculate X" | Formula + worked example + steps | Guide with formula box, worked example, numbered steps | Yes |
| "which statistical test should I use" | Decision table / flowchart articles (UCLA, Scribbr, statsandr) | Guide with decision table + separate interactive chooser | Yes |
| "how to report X APA" | Template + example sentence | APA guides with copy-ready templates | Yes |
| "X interpretation table" / "slovin table" | Tables | Table guides | Yes |
| "what is X" | Definition first, then depth | Every guide opens with a one-sentence definition | Yes |

No page has the wrong format for its keyword.

## 2. Answer in the first 100 words (checked on all 72 content pages)

- **Guides (28/28):** the first sentence answers the query directly (definition, formula or rule), followed by the byline and a worked example.
- **Calculators:** the lead says what you get, and "What is X?" follows straight after the tool. For calculator queries the tool itself is the answer, so this is correct.
- **Fixed:** `/statistics-calculator` opened with generic copy ("built for class assignments … business reports"). It now opens with the definition of standard deviation.
- **Thin pages (fewer than 400 words):** symbolic-algebra (79), differential-equation-solver (147), circuit-analysis (226), unit-converter (267), optimization-lab (330), polynomial-solver (388). These are math and engineering, outside the thesis focus. Expand next, starting with optimization-lab (48 impressions, position 68).

## 3. E-E-A-T

- **Experience / original evidence:** /validation shows 89 of 89 results matching SciPy reference values, on fixed datasets anyone can rerun. No competitor in the top 5 publishes this.
- **Expertise:** named author (Talha, software engineer and web developer) on every guide. Calculator pages now also show a byline, an updated date and a link to the validation results. Method notes cite primary sources (Welch 1947, Cohen 1988, Royston 1995, …).
- **Authoritativeness:** this is the weak spot, and it comes from links and mentions, not on-page work. Continue librarian and university outreach (backlink targets doc).
- **Trust:** contact email, privacy policy, methodology and limitations pages, HTTPS, no fabricated reviews or ratings.

## 4. Competitor gaps added (refresh first: pages that already earn impressions)

| Page | Top results cover | They miss, so we added |
|---|---|---|
| /guides/standard-deviation-formula (97 impressions) | calculator.net, BYJU'S, Khan, CalculatorSoup: definition, sample vs population, discrete and grouped formulas | Frequency-table SD with a Likert example; grouped-data SD worked to the answer; shortcut formula checked against the main example; Excel, Sheets, SPSS and Casio/TI equivalents; copy-paste formula text (top autocomplete: "standard deviation formula excel", "copy and paste") |
| /guides/choose-a-statistical-test (64 impressions) | UCLA table, Scribbr, statsandr flowchart: variable types, parametric vs non-parametric | Thesis research questions mapped to tests; five mistakes panels catch; minimum N per test at 80% power (64 per group, 159, 84, 88, computed); SPSS menu paths |
| /guides/slovin-formula-sample-size | Statology, Statistics How To, StatStudyHub: definition, history, examples, limitations | Margin of error from Slovin's formula (reverse formula + example; autocomplete "slovin formula how to get margin of error"); how to cite it (autocomplete "slovin's formula citation"); copy-paste versions |
| /statistics-calculator | calculator.net, CalculatorSoup: formula + calculator | Three worked examples that match the calculator's modes (raw, Likert frequency table, grouped); "is my SD high or low" for Likert data |

All numbers in the new sections were recomputed (NumPy, and SciPy noncentral distributions for power).

## 5. Content brief template for the next pages

1. **Define:** primary keyword (from SEO_KEYWORD_MAP.md), confirmed intent (look at page one), the one job the page must do.
2. **Research:** headings and coverage of the top 5 results, plus autocomplete and People Also Ask for the keyword.
3. **Outline:** answer-first intro (first sentence answers the query), then H2/H3s mapped to People Also Ask questions.
4. **Specify:** a worked example with real numbers, at least one thing competitors do not have, 3–5 internal links (calculator, prerequisite, next step), and a citation for any claim.
5. **Review:** intent, structure, recomputed numbers, links, and no padding or synonym swaps.

Next refresh queue: optimization-lab, guides/engineering-notation-and-scientific-notation (59 impressions), guides/matrix-inverse-and-determinant (42), differential-equation-solver (34), then the Likert, Cronbach and t-test pages once they start earning impressions.
