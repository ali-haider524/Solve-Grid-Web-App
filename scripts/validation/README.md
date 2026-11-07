# Calculator validation

Recomputes every SolveGrid statistic on fixed datasets and compares it with an
independent reference implementation (SciPy / NumPy).

```
npx tsc lib/research-statistics.ts --ignoreConfig --outDir scripts/validation/build --module commonjs --target es2020
cd scripts/validation
node run-solvegrid.cjs > js.json
python3 reference.py          # needs numpy + scipy; writes validation.json
```

`reference.py` also rewrites `lib/validation-results.ts` (with today's date), which the /validation page and /llms-full.txt read. Commit it after each run.
