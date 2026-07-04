# Mobile QA V8

Check `320`, `360`, `375`, `390`, `412`, and `768` pixel widths in Chrome DevTools.

- Header: logo and hamburger remain visible; drawer opens and closes via button, backdrop, and Escape.
- Tools: no permanent category row consumes calculator space.
- Scientific Calculator: display, keypad, MODE, TOOLS, memory, and history remain tappable with no horizontal overflow.
- Graphing: canvas appears before the equation list; equation controls remain reachable below it.
- Equation / Statistics / Matrix: dropdowns and data tables stay inside cards; no page-wide horizontal scroll appears.
- Unit / Percentage / Finance / Distance: zero or blank placeholders are visible and results do not require excessive scrolling.

Scientific Calculator checks:

```text
fact(5) = 120
ncr(8,2) = 28
npr(8,2) = 56
gcd(48,18) = 6
lcm(12,18) = 36
nthroot(27,3) = 3
sinh(0) = 0
```
