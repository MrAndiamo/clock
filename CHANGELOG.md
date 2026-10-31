# Changelog

## 1.1.1 (2026-10-31)

Alarm fixes:

- Time alarms are now set to an exact moment, so daylight saving changes, a computer clock that is set back and a new `timeZone` no longer make them ring at the wrong time.
- Smooth clocks really keep ticking in a tab that is hidden, so their alarms go off there.
- `setOptions({ alarm: { ... } })` merges the alarm like other options again; `setAlarm()` replaces it. Changing only the label or sound keeps a countdown running. An alarm without `time` or `countdown` now gives a warning.
- `time` also accepts seconds since midnight, so `clock.options.alarm` can be passed back in.
- Countdowns such as `'100:00'` (mm:ss) work; out-of-range values such as `'5:75'` give a warning.
- A blocked custom sound is tried again every second while the alarm rings.
- A clock removed from the page stays silent, and its alarm still stops after `ringFor`.
- Redrawing a ringing clock no longer beeps twice or announces the alarm again; the caption is no longer read twice by screen readers.
- The previews on the overview page can't make sound, and the timer example only starts when you pick a preset.

## 1.1.0 (2026-10-31)

- New `alarm` option: ring at a time of day (`time: '07:00'`) or when a countdown ends (`countdown: '10m'`). It can repeat, beep or play your own sound, and snooze. A badge shows when it goes off, and analog dials get an alarm hand.
- New methods `setAlarm()`, `stopAlarm()` and `snoozeAlarm()`, and a `clockalarm` event on the clock's element.
- New examples: `alarm-clock.html` and `alarm-timer.html`, in a new Alarms category on the overview page.
- Clocks with a sweeping seconds hand or smooth bars now keep ticking in background tabs, so alarms there still go off.

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
