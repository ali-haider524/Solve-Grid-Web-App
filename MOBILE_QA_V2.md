# V2 Mobile Visual QA

Test each changed calculator at 320px, 360px, 375px, 390px, 412px, tablet, and desktop.

## Shared checks
- Header navigation remains reachable through horizontal scrolling on phones.
- No horizontal page overflow.
- Inputs, selects, and textareas stay at 16px or larger on mobile to reduce browser zoom.
- Keyboard focus is visible.
- Buttons are reachable without overlapping cards.

## Graphing Calculator
- Add 8 lines and confirm the equation list stays readable.
- Check the table and Analyse tabs.
- Check canvas and trace slider at 320px and 390px.

## Matrix Calculator
- Set 8×8 and confirm the grid scrolls inside its card rather than widening the page.
- Test RREF, rank, transpose, inverse, multiplication, and solve states.

## Unit Converter
- Change category on a phone using the dropdown.
- Swap units and copy a pre-filled link.
- Check long unit labels in the source/result selectors.

## Percentage Calculator
- Switch all ten modes.
- Check two-field and three-field layouts at 320px.

## Statistics Calculator
- Check raw, frequency, and regression input modes.
- Check metric cards and frequency items on narrow screens.
