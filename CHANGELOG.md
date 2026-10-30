# Changelog

## 1.0.2 (2026-10-30)

- No changes to the clock itself. `Clock.version`, the README and `VERSION` now say 1.0.2.

## 1.0.1 (2026-10-30)

- Added the MIT license to `composer.json`, so Packagist shows it.
- `Clock.version` and the README now give the right version number (they said 2.0.0).

## 1.0.0 (2026-10-30)

First stable release. The clock was rewritten from scratch.

- New `clock.js`: one script without dependencies, which works in any HTML page.
- Three displays (analog, digital and count-down bars) that can be combined in any order, in rows, columns or nested groups.
- Themes (light, dark, auto), colors as options or CSS custom properties, time zones, date formats, roman numerals, a sweeping seconds hand, ring and vertical bars, and more. See README.md.
- Start clocks from a `data-clock` attribute without writing JavaScript, and put any number of clocks on one page.
- `index.html` gives an overview of all examples, and `examples/` has a page for every combination.
- The PHP class `Timvandendries\Clock\Clock` takes the same options as an array: `echo new Clock([...])`.
- Breaking: the old public properties and `showClock()` were removed. README.md maps each old property to its new option.
- Requires PHP 8.0 or newer. MIT license.
