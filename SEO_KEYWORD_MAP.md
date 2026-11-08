# SolveGrid keyword map (one primary keyword per URL)

Last reviewed: 2026-11-08. Source of truth for titles, H1s and internal anchor text.

## Rules

- Every URL owns ONE primary keyword. It goes in the title, the H1, the first sentence and the internal links that point to the page.
- No other URL may use another page's primary keyword in its title, H1 or keyword list. Link to the owner instead.
- Calculators own the tool intent ("X calculator"). Guides own the learning intent ("X formula", "how to report X", "X table", "X interpretation").
- Hubs own the list intent ("all X calculators"). The homepage owns the brand and "statistics calculators for thesis".
- Before adding a page, search this file. If the keyword already has an owner, improve that page instead.

## Hierarchy (how the sitemap and breadcrumbs are ordered)

```
Home  /  — brand, statistics calculators for thesis
├── All tools index  /tools
├── Research statistics & survey tools  /research-statistics
│   ├── /statistical-test-chooser
│   ├── /sample-size-calculator
│   ├── /t-test-calculator
│   ├── /one-way-anova-calculator
│   ├── /statistics-calculator
│   ├── /cronbach-alpha-calculator
│   ├── /likert-scale-calculator
│   ├── /chi-square-calculator
│   ├── /correlation-calculator
│   ├── /linear-regression-calculator
│   ├── /power-analysis-calculator
│   ├── /mann-whitney-u-test-calculator
│   ├── /shapiro-wilk-test-calculator
│   ├── /effect-size-calculator
│   ├── /cohens-kappa-calculator
│   ├── /wilcoxon-signed-rank-test-calculator
│   ├── /kruskal-wallis-test-calculator
│   ├── /intraclass-correlation-calculator
│   ├── /sobel-test-calculator
│   ├── /friedman-test-calculator
│   ├── /p-value-calculator
│   ├── /confidence-interval-calculator
│   ├── /margin-of-error-calculator
│   ├── /two-way-anova-calculator
│   ├── /repeated-measures-anova-calculator
│   ├── /mcnemar-test-calculator
│   ├── /fishers-exact-test-calculator
│   ├── /logistic-regression-calculator
│   ├── /ancova-calculator
│   ├── /factor-analysis-calculator
│   ├── /kendalls-w-calculator
│   ├── /fleiss-kappa-calculator
│   ├── /manova-calculator
├── Math & algebra tools  /math-calculators
│   ├── /graphing-calculator
│   ├── /equation-solver
│   ├── /polynomial-solver
│   ├── /matrix-calculator
├── Scientific & engineering tools  /engineering-calculators
│   ├── /scientific-calculator
│   ├── /unit-converter
├── Research & simulation labs  /research-tools
│   ├── /differential-equation-solver
│   ├── /symbolic-algebra
│   ├── /optimization-lab
│   ├── /circuit-analysis
├── Guides index  /guides
│   ├── /guides/pearson-r-interpretation-table
│   ├── /guides/frequency-and-percentage-formula
│   ├── /guides/statistical-treatment-of-data
│   ├── /guides/slovin-sample-size-table
│   ├── /guides/plot-multiple-equations
│   ├── /guides/linear-quadratic-cubic-equation-solver
│   ├── /guides/polynomial-roots-and-complex-roots
│   ├── /guides/ti-84-style-graphing-workflows
│   ├── /guides/gaussian-elimination-for-linear-systems
│   ├── /guides/matrix-inverse-and-determinant
│   ├── /guides/matrix-methods-for-linear-systems
│   ├── /guides/standard-deviation-formula
│   ├── /guides/engineering-notation-and-scientific-notation
│   ├── /guides/unit-conversion-formulas
│   ├── /guides/engineering-unit-conversion
│   ├── /guides/euler-method-for-differential-equations
│   ├── /guides/runge-kutta-rk4-method
│   ├── /guides/symbolic-algebra-simplification
│   ├── /guides/graphical-linear-programming-method
│   ├── /guides/two-node-nodal-analysis
│   ├── /guides/choose-a-statistical-test
│   ├── /guides/slovin-formula-sample-size
│   ├── /guides/likert-scale-interpretation
│   ├── /guides/how-to-report-anova-apa
│   ├── /guides/how-to-report-t-test-apa
│   ├── /guides/how-to-report-chi-square-apa
│   ├── /guides/how-to-report-regression-apa
│   ├── /guides/how-to-report-correlation-apa
└── Trust: /about /methodology /validation /contact /privacy-policy /terms-of-use /disclaimer
```

## Hubs

| URL | Primary keyword | Must not target |
|---|---|---|
| `/` | SolveGrid; statistics calculators for thesis | any single calculator name |
| `/research-statistics` | research statistics calculators (full list) | statistics calculators for thesis (→ home) |
| `/math-calculators` | math calculators online | equation solver (→ tool) |
| `/engineering-calculators` | engineering calculators online | scientific calculator online (→ tool) |
| `/research-tools` | numerical research tools | — |
| `/tools` | all calculators index | statistics calculators for thesis (→ home) |
| `/guides` | statistics guides with worked examples | — |

## Calculators

| URL | Primary keyword | Secondary keywords |
|---|---|---|
| `/scientific-calculator` | scientific calculator online | engineering calculator, engineering calculator online, engineer calculator, engineering notation calculator |
| `/graphing-calculator` | online graphing calculator | graphing calculator online, ti-84 online alternative, ti-84 style graphing calculator, graph equations online |
| `/equation-solver` | equation solver | online equation solver, engineering equation solver online, linear equation solver, quadratic equation solver |
| `/polynomial-solver` | polynomial roots calculator | roots calculator polynomial, polynomial solver, find polynomial roots, root of polynomial calculator |
| `/matrix-calculator` | matrix calculator | matrix reducer calculator, matrix reduction calculator, matrix rank calculator with steps, matrix rank calculator |
| `/statistics-calculator` | standard deviation calculator | descriptive statistics calculator, sample standard deviation calculator, population standard deviation calculator, variance calculator |
| `/unit-converter` | unit converter | online unit converter, engineering unit converter, metric unit converter, imperial unit converter |
| `/differential-equation-solver` | differential equation solver | ordinary differential equation solver, runge kutta calculator, rk4 solver, euler method calculator |
| `/symbolic-algebra` | symbolic algebra calculator | simplify expression calculator, derivative calculator, algebraic equivalence checker, symbolic differentiation online |
| `/optimization-lab` | optimization problem solver | optimization problem calculator, optimization solver calculator, linear programming solver, linear programming calculator |
| `/circuit-analysis` | circuit analysis calculator | dc circuit analysis calculator, nodal analysis calculator, node voltage calculator, resistor network calculator |
| `/sample-size-calculator` | sample size calculator | slovin formula calculator, taro yamane sample size calculator, yamane formula, cochran formula calculator |
| `/cronbach-alpha-calculator` | cronbach alpha calculator | cronbach's alpha calculator, cronbach alpha online, reliability test calculator, alpha if item deleted |
| `/likert-scale-calculator` | likert scale calculator | weighted mean calculator likert scale, likert scale weighted mean calculator, likert scale mean and standard deviation, likert data analysis calculator |
| `/statistical-test-chooser` | statistical test chooser | statistical test selector, statistical test decision tree, statistical test flowchart, statistical test for comparing two groups |
| `/chi-square-calculator` | chi square test calculator | chi square calculator, chi square test of independence calculator, chi square goodness of fit calculator, cramers v calculator |
| `/mann-whitney-u-test-calculator` | mann whitney u test calculator | mann whitney calculator, wilcoxon rank sum test calculator, mann whitney u test vs t test, what is mann whitney u test |
| `/shapiro-wilk-test-calculator` | shapiro wilk test calculator | shapiro wilk test online, normality test calculator, test for normality online, normality assumption violated shapiro wilk |
| `/cohens-kappa-calculator` | cohen's kappa calculator | cohen kappa calculator, inter rater reliability calculator, weighted kappa calculator, cohen kappa interpretation |
| `/effect-size-calculator` | effect size calculator | cohen's d calculator, hedges g calculator, eta squared calculator, partial eta squared from f |
| `/wilcoxon-signed-rank-test-calculator` | wilcoxon signed rank test calculator | wilcoxon test calculator, wilcoxon signed rank test online, paired non parametric test, wilcoxon vs mann whitney |
| `/kruskal-wallis-test-calculator` | kruskal wallis test calculator | kruskal wallis h test calculator, kruskal wallis calculator online, dunn test calculator, non parametric anova calculator |
| `/intraclass-correlation-calculator` | intraclass correlation calculator | icc calculator, icc calculator online free, inter rater reliability icc, test retest reliability calculator |
| `/sobel-test-calculator` | sobel test calculator | sobel test online, mediation analysis calculator, indirect effect calculator, aroian test |
| `/t-test-calculator` | t test calculator | independent t test calculator, paired t test calculator, one sample t test calculator, welch t test calculator |
| `/one-way-anova-calculator` | one way anova calculator | anova calculator, tukey hsd calculator, anova post hoc test calculator, welch anova calculator |
| `/correlation-calculator` | correlation calculator | correlation coefficient calculator, pearson correlation calculator, spearman correlation calculator, spearman rank correlation calculator |
| `/linear-regression-calculator` | linear regression calculator | multiple regression calculator, multiple linear regression calculator, regression analysis calculator, simple linear regression calculator |
| `/friedman-test-calculator` | friedman test calculator | friedman test online, non parametric repeated measures anova, friedman post hoc test, how to report friedman test |
| `/mcnemar-test-calculator` | mcnemar test calculator | mcnemar test online, exact mcnemar test, paired proportions test, before after chi square test |
| `/power-analysis-calculator` | power analysis calculator | sample size calculator power analysis, a priori power analysis, g power alternative online, sample size for t test |
| `/p-value-calculator` | p value calculator | p value from t, p value from z score, p value from f statistic, chi square p value calculator |
| `/confidence-interval-calculator` | confidence interval calculator | 95 confidence interval calculator, confidence interval for mean, confidence interval for proportion, wilson score interval calculator |
| `/margin-of-error-calculator` | margin of error calculator | survey margin of error, margin of error formula, margin of error for sample size, calculate margin of error |
| `/fishers-exact-test-calculator` | fisher exact test calculator | fisher's exact test online, fisher exact test 2x2, exact test small sample, fisher exact vs chi square |
| `/two-way-anova-calculator` | two way anova calculator | two-way anova online, two factor anova calculator, anova with interaction, type iii sum of squares |
| `/repeated-measures-anova-calculator` | repeated measures anova calculator | within subjects anova calculator, repeated measures anova online, greenhouse geisser correction, mauchly test of sphericity |
| `/logistic-regression-calculator` | logistic regression calculator | binary logistic regression online, odds ratio logistic regression, nagelkerke r square, logistic regression spss alternative |
| `/kendalls-w-calculator` | kendall's w calculator | kendall coefficient of concordance, inter-rater agreement ranking, kendall w online, how to interpret kendall's w |
| `/fleiss-kappa-calculator` | fleiss kappa calculator | fleiss' kappa online, inter-rater reliability multiple raters, kappa for more than two raters, fleiss kappa interpretation |
| `/ancova-calculator` | ancova calculator | one way ancova online, analysis of covariance calculator, adjusted means calculator, pretest posttest ancova |
| `/manova-calculator` | manova calculator | one way manova online, pillai's trace calculator, wilks lambda calculator, multivariate analysis of variance |
| `/factor-analysis-calculator` | factor analysis calculator | exploratory factor analysis online, efa calculator, kmo and bartlett test calculator, varimax rotation calculator |

## Guides

| URL | Primary keyword | Secondary keywords | Leave to (owner) |
|---|---|---|---|
| `/guides/pearson-r-interpretation-table` | pearson r interpretation table | correlation strength table, interpret correlation coefficient | correlation calculator (→ tool) |
| `/guides/frequency-and-percentage-formula` | frequency and percentage formula | percentage formula thesis, profile of respondents | — |
| `/guides/statistical-treatment-of-data` | statistical treatment of data | statistical treatment of data in thesis, sample write-up | — |
| `/guides/slovin-sample-size-table` | slovin table | slovin sample size table, sample size table by population | slovin's formula (→ guide) |
| `/guides/plot-multiple-equations` | how to plot multiple equations on one graph | graph two equations, plot several functions | online graphing calculator (→ tool) |
| `/guides/linear-quadratic-cubic-equation-solver` | how to solve linear, quadratic and cubic equations | quadratic formula steps, cubic equation method | equation solver (→ tool) |
| `/guides/polynomial-roots-and-complex-roots` | polynomial roots and complex roots | complex conjugate roots, rational root examples | polynomial roots calculator (→ tool) |
| `/guides/ti-84-style-graphing-workflows` | how to use a TI-84 (graph, table, solve) | TI-84 graph table steps | TI-84 online / graphing calculator (→ tool) |
| `/guides/gaussian-elimination-for-linear-systems` | gaussian elimination step by step | row echelon form, back substitution | matrix calculator (→ tool) |
| `/guides/matrix-inverse-and-determinant` | matrix inverse and determinant | singular matrix, when inverse exists | matrix calculator (→ tool) |
| `/guides/matrix-methods-for-linear-systems` | methods for solving linear systems (gaussian vs inverse vs cramer) | cramer's rule vs inverse, which method | gaussian elimination (→ guide) |
| `/guides/standard-deviation-formula` | standard deviation formula | sample vs population standard deviation formula | standard deviation calculator (→ tool) |
| `/guides/engineering-notation-and-scientific-notation` | engineering notation vs scientific notation | SI prefixes, mega/micro in scientific notation | scientific calculator (→ tool) |
| `/guides/unit-conversion-formulas` | unit conversion formulas | metric and imperial conversion formulas | unit converter (→ tool) |
| `/guides/engineering-unit-conversion` | engineering unit conversion | pressure, torque, power unit conversion | unit converter (→ tool) |
| `/guides/euler-method-for-differential-equations` | euler method | euler method example, euler step size | euler method calculator (→ ODE solver) |
| `/guides/runge-kutta-rk4-method` | runge-kutta rk4 method | rk4 example, rk4 formula | rk4 solver (→ ODE solver) |
| `/guides/symbolic-algebra-simplification` | symbolic algebra simplification | simplify and differentiate expressions | symbolic algebra calculator (→ tool) |
| `/guides/graphical-linear-programming-method` | graphical method linear programming | feasible region, corner point method | linear programming solver (→ tool) |
| `/guides/two-node-nodal-analysis` | two-node nodal analysis | KCL node voltage example, conductance matrix | nodal analysis calculator (→ tool) |
| `/guides/choose-a-statistical-test` | which statistical test should I use | how to choose a statistical test, statistical test table | statistical test chooser (→ /statistical-test-chooser) |
| `/guides/slovin-formula-sample-size` | slovin's formula | slovin formula example, how to compute sample size slovin | slovin formula calculator (→ tool), slovin table (→ table guide) |
| `/guides/likert-scale-interpretation` | likert scale interpretation | 5-point likert scale interpretation, weighted mean range, verbal interpretation | likert scale calculator (→ tool) |
| `/guides/how-to-report-anova-apa` | how to report ANOVA APA | ANOVA APA format, report F statistic | anova calculator (→ tool) |
| `/guides/how-to-report-t-test-apa` | how to report t-test APA | t-test APA format, APA t-test example | t test calculator (→ tool) |
| `/guides/how-to-report-chi-square-apa` | how to report chi-square APA | chi square APA format | chi square calculator (→ tool) |
| `/guides/how-to-report-regression-apa` | how to report regression APA | regression APA table | regression calculator (→ tool) |
| `/guides/how-to-report-correlation-apa` | how to report correlation APA | correlation APA format, correlation table APA | pearson r interpretation (→ table guide) |

## Changes made on 2026-11-08 (cannibalization fixes)

| Conflict found | Pages that competed | Fix |
|---|---|---|
| t-test / ANOVA / correlation | `/advanced-statistics` vs `/t-test-calculator`, `/one-way-anova-calculator`, `/correlation-calculator` | Retired the old combined lab. 308 redirect to `/statistical-test-chooser`. Removed from the registry, the hubs, the homepage and llms.txt. |
| "which statistical test should I use" | `/statistical-test-chooser` vs `/guides/choose-a-statistical-test` | The guide keeps it (it already has the impressions). The tool is now "Statistical Test Chooser: 4-Question Decision Tree". |
| "statistics calculators for thesis" | `/` vs `/research-statistics` vs `/tools` | Home keeps it. `/research-statistics` is now "All Research Statistics Calculators, Grouped by Analysis". `/tools` is now the all-calculators index. |
| "standard deviation formula" | `/statistics-calculator` (formula keywords) vs `/guides/standard-deviation-formula` | The tool is now "Standard Deviation Calculator (Sample & Population)" and the formula keywords were removed from it. |
| "slovin's formula" | `/sample-size-calculator` vs `/guides/slovin-formula-sample-size` vs `/guides/slovin-sample-size-table` | The tool owns "slovin formula calculator", the guide owns "slovin's formula", and the table guide is now "Slovin Table: …". |
| "likert scale interpretation" | `/likert-scale-calculator` vs `/guides/likert-scale-interpretation` | The tool is now "Likert Scale Calculator – Weighted Mean, SD & Rank" and the interpretation keywords were removed from it. |
| "kendall's w calculator" | `/friedman-test-calculator` vs `/kendalls-w-calculator` | Removed Kendall's W from the Friedman title, H1 and keywords. |
| "sample size for research" | `/power-analysis-calculator` vs `/sample-size-calculator` | Power is now "A Priori Power Analysis Calculator (t, ANOVA, r, χ²)". |
| "finite population correction" | `/margin-of-error-calculator` vs `/sample-size-calculator` | Kept on sample size. MOE retitled to "… for Survey Results". |
| "fisher exact test calculator" | `/chi-square-calculator` vs `/fishers-exact-test-calculator` | Removed from chi-square. |
| "cubic equation solver" | `/equation-solver` vs `/polynomial-solver` vs the equation guide | The tool `/equation-solver` keeps it. The guide is now "How to Solve Linear, Quadratic & Cubic Equations". |
| "plot equations online" / "TI-84 online" | `/graphing-calculator` vs 2 graphing guides | The tool keeps them. The guides are now "How to Plot Multiple Equations on the Same Graph" and "How to Graph, Make Tables & Solve Like a TI-84". |
| Gaussian elimination / linear systems | 3 matrix guides + the equation guide | Gaussian guide = "step by step". Methods guide = "Gaussian vs Inverse vs Cramer's Rule". Inverse guide unchanged. |
| "two node nodal analysis" | `/circuit-analysis` vs `/guides/two-node-nodal-analysis` | Removed from the tool. |
