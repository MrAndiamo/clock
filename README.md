# Clock

Analog, digital and count-down bar clocks for any web page. You can use one display, two, or all three, set up with a single options object. `clock.js` has no dependencies and works in plain HTML. A small PHP class is included for Composer projects.

Open **`index.html`** for a live overview of all examples.

- [Quick start](#quick-start)
- [The three displays](#the-three-displays)
- [Combining displays](#combining-displays)
- [Options](#options): [general](#general), [analog](#analog), [digital](#digital), [bars](#bars)
- [Colors and themes](#colors-and-themes)
- [JavaScript API](#javascript-api)
- [PHP](#php)
- [Examples](#examples)
- [Upgrading from the old PHP clock](#upgrading-from-the-old-php-clock)

## Quick start

Add an element, load `clock.js` and create a clock:

```html
<div id="clock"></div>

<script src="clock.js"></script>
<script>
  new Clock('#clock', {
    displays: ['analog', 'digital', 'bars']
  });
</script>
```

You can also skip the JavaScript and put the options in a `data-clock` attribute. `clock.js` starts every element that has one when the page loads:

```html
<div data-clock='{"displays": ["analog", "digital"], "theme": "auto"}'></div>
<script src="clock.js"></script>
```

For just a list of displays, a short form works too: `<div data-clock="digital bars"></div>`.

You can put as many clocks on one page as you like.

## The three displays

| Display   | What it shows |
|-----------|---------------|
| `analog`  | A dial with hour, minute and seconds hands, numbers (arabic or roman) and tick marks. |
| `digital` | The time as digits in 24- or 12-hour format, with optional seconds, blinking colons and the date. |
| `bars`    | Count-down bars for hours, minutes and seconds, drawn as horizontal bars, vertical bars or rings. |

### How the bars count

By default the bars **count down**. Each bar shows how much of its period is left and empties as time passes:

| Bar       | Runs over     | Value when counting down | Value when counting up |
|-----------|---------------|--------------------------|------------------------|
| `hours`   | the whole day | hours left in the day (23 → 0) | hour of the day (0 → 23) |
| `minutes` | the hour      | minutes left in the hour (59 → 0) | minute (0 → 59) |
| `seconds` | the minute    | seconds left in the minute (59 → 0) | second (0 → 59) |

At 10:32:15 the count-down values are 13, 27 and 44. Read together, they count down to 23:59:59. Set `bars: { direction: 'up' }` to make the bars fill up instead.

## Combining displays

`displays` sets which displays are shown and in which order. `layout` places them in a `'row'` or a `'column'`.

```js
new Clock('#clock', {
  displays: ['analog', 'digital'],
  layout: 'column'          // the dial with the digital time underneath
});
```

A **nested array** makes a group, which is laid out in the opposite direction of its parent. The example below puts the analog clock on the left, with the digital time stacked above the bars on the right:

```js
new Clock('#clock', {
  displays: ['analog', ['digital', 'bars']],
  layout: 'row'
});
```

Every possible combination has an example page:

| Displays | Example |
|----------|---------|
| analog | [`examples/analog.html`](examples/analog.html) |
| digital | [`examples/digital.html`](examples/digital.html) |
| bars | [`examples/bars.html`](examples/bars.html) |
| analog + digital | [`examples/analog-digital.html`](examples/analog-digital.html) |
| analog + bars | [`examples/analog-bars.html`](examples/analog-bars.html) |
| digital + bars | [`examples/digital-bars.html`](examples/digital-bars.html) |
| analog + digital + bars | [`examples/analog-digital-bars.html`](examples/analog-digital-bars.html) |

## Options

Only set the options you want to change; everything else keeps its default. The options for each display go in an object named after it (`analog`, `digital`, `bars`). Those options only apply when that display is in `displays`.

```js
new Clock('#clock', {
  displays: ['analog', 'bars'],
  theme: 'auto',
  analog: { size: 300, numbers: 'roman' },
  bars: { style: 'ring', direction: 'up' }
});
```

Invalid values are reported in the browser console, and the default is used instead.

### General

| Option     | Default     | Description |
|------------|-------------|-------------|
| `displays` | `['analog']` | Displays to show, in order: `'analog'`, `'digital'`, `'bars'`. An array, or a string such as `'analog digital'`. Nested arrays make groups (see above). |
| `layout`   | `'row'`     | `'row'` or `'column'`. Direction of the top-level displays; nested groups use the other direction. Rows wrap on narrow screens. |
| `gap`      | `40`        | Space between displays in px, or any CSS length such as `'2rem'`. Nested groups use half of it. |
| `theme`    | `'light'`   | `'light'`, `'dark'`, or `'auto'` to follow the visitor's light/dark system setting. |
| `timeZone` | local time  | An IANA time zone, such as `'Europe/Amsterdam'` or `'America/New_York'`. |
| `locale`   | browser language | Language of the date, such as `'nl-NL'`. |
| `label`    | `''`        | Caption shown above the clock, such as a city name. |
| `font`     | system font | CSS `font-family` for the whole clock. |
| `colors`   | `{}`        | `text` and `muted` (labels, date). See [Colors and themes](#colors-and-themes). |
| `onTick`   | `null`      | Function called once per second with `{ hours, minutes, seconds, date }` and the clock. JavaScript only. |

### Analog

The sizes below are measured on a 200px dial and scale with `size`.

| Option       | Default     | Description |
|--------------|-------------|-------------|
| `size`       | `240`       | Width and height in px. |
| `numbers`    | `'arabic'`  | `'arabic'` (1–12), `'roman'` (I–XII) or `'none'`. |
| `ticks`      | `'minutes'` | `'minutes'` (all 60 marks), `'hours'` (12 marks) or `'none'`. |
| `hands`      | all `true`  | Which hands to show: `{ hours: true, minutes: true, seconds: false }`. `false` hides all hands. |
| `handWidth`  | `5`         | Width of the hour and minute hands. The seconds hand is 40% of this. |
| `smooth`     | `false`     | `true` makes the seconds hand sweep instead of tick. |
| `border`     | `5`         | Border width; `0` for no border. |
| `centerSize` | `5`         | Radius of the cap over the hands; `0` for none. |
| `colors`     | theme       | `face`, `border`, `ticks`, `numbers`, `hours`, `minutes`, `seconds`, `center`. Give `border` an array of colors, e.g. `['#6b4f17', '#f4d77e', '#6b4f17']`, for a gradient from the inside to the outside of the border. |

### Digital

| Option        | Default  | Description |
|---------------|----------|-------------|
| `size`        | `56`     | Font size of the time in px. The date and panel scale with it. |
| `hour12`      | `false`  | `true` for 12-hour time with AM/PM. |
| `seconds`     | `true`   | Show the seconds. |
| `leadingZero` | auto     | Show hours as `09` instead of `9`. Defaults to on for 24-hour time and off for 12-hour time. |
| `blink`       | `false`  | Dim the colons every other second. |
| `date`        | `false`  | Show the date: `'full'` (Friday, October 30, 2026), `'long'` (October 30, 2026), `'medium'` (Oct 30, 2026) or `'short'` (10/30/26). `true` means `'long'`. The format follows `locale`. |
| `panel`       | `false`  | Put the time on a rounded background panel. |
| `font`        | inherited | CSS `font-family` for the digits only. |
| `colors`      | theme    | `text`, `date`, `panel`. |

### Bars

| Option        | Default        | Description |
|---------------|----------------|-------------|
| `units`       | `['hours', 'minutes', 'seconds']` | Which bars to show, in order. Also accepts a string such as `'minutes seconds'`. |
| `direction`   | `'down'`       | `'down'` shows the time left and the bars empty. `'up'` shows the time passed and the bars fill. |
| `style`       | `'linear'`     | `'linear'` bars or `'ring'`s. |
| `orientation` | `'horizontal'` | `'horizontal'` or `'vertical'` (linear bars only). |
| `length`      | `260`          | Length of a linear bar in px. |
| `thickness`   | `14`           | Thickness of a bar or ring in px. |
| `size`        | `96`           | Diameter of a ring in px. |
| `smooth`      | `true`         | `true` moves the bars continuously; `false` moves them once per second. |
| `rounded`     | `true`         | Rounded bar ends. |
| `labels`      | `true`         | `false` hides the labels. An object renames them: `{ hours: 'Uren', minutes: 'Minuten', seconds: 'Seconden' }`. |
| `values`      | `true`         | Show the number next to (or inside) each bar. |
| `colors`      | theme          | `track`, `hours`, `minutes`, `seconds`, `text` (values), `labels`. |

## Colors and themes

`theme` picks a full light or dark palette. `'auto'` switches between them with the visitor's system setting. Change single colors with the `colors` options:

```js
new Clock('#clock', {
  displays: ['analog', 'bars'],
  theme: 'dark',
  analog: { colors: { face: '#141416', seconds: '#e2b04a', border: ['#6b4f17', '#f4d77e', '#6b4f17'] } },
  bars: { colors: { seconds: '#e2b04a' } }
});
```

All colors are CSS custom properties, so you can also set them from your own stylesheet. Target `.clock` inside your element:

```css
#clock .clock {
  --clock-face: #fffaf0;
  --clock-hand-seconds: orange;
}
```

| Variable | Used for | Option |
|----------|----------|--------|
| `--clock-text` | General text, label | `colors.text` |
| `--clock-muted` | Secondary text | `colors.muted` |
| `--clock-face` | Dial background | `analog.colors.face` |
| `--clock-border` | Dial border | `analog.colors.border` |
| `--clock-ticks` | Tick marks | `analog.colors.ticks` |
| `--clock-numbers` | Dial numbers | `analog.colors.numbers` |
| `--clock-hand-hours` | Hour hand | `analog.colors.hours` |
| `--clock-hand-minutes` | Minute hand | `analog.colors.minutes` |
| `--clock-hand-seconds` | Seconds hand | `analog.colors.seconds` |
| `--clock-center` | Center cap | `analog.colors.center` |
| `--clock-digital` | Digital time | `digital.colors.text` |
| `--clock-digital-date` | Digital date | `digital.colors.date` |
| `--clock-panel` | Digital panel | `digital.colors.panel` |
| `--clock-track` | Empty part of bars and rings | `bars.colors.track` |
| `--clock-bar-hours` | Hours bar | `bars.colors.hours` |
| `--clock-bar-minutes` | Minutes bar | `bars.colors.minutes` |
| `--clock-bar-seconds` | Seconds bar | `bars.colors.seconds` |
| `--clock-bar-text` | Bar values | `bars.colors.text` |
| `--clock-bar-label` | Bar labels | `bars.colors.labels` |

## JavaScript API

| | |
|---|---|
| `new Clock(target, options)` | Creates a clock in `target` (a CSS selector or an element) and replaces its contents. If the element already had a clock, the old one is removed. |
| `clock.setOptions(options)` | Merges new options into the current ones and redraws: `clock.setOptions({ theme: 'dark' })`. |
| `clock.destroy()` | Stops the clock and removes it from the page. |
| `clock.options` | The resolved options, with all defaults filled in. |
| `Clock.init(scope)` | Starts all `data-clock` elements inside `scope` (default: the whole document) that don't have a clock yet. This already runs on page load; call it again after adding HTML later. |
| `Clock.defaults` | Defaults for new clocks. For example, `Clock.defaults.theme = 'auto'` before creating any clock. |
| `Clock.version` | `'1.0.2'` |

All clocks on a page share one timer. It updates once per second, or every animation frame while a clock has a sweeping seconds hand or smooth bars. Browsers slow it down while the tab is hidden, and the clock catches up as soon as the tab is visible again.

`clock.js` also works as a CommonJS module (`const Clock = require('./clock.js')`) for bundlers.

## PHP

The Composer package `timvandendries/clock` contains a PHP class that writes the clock for you, with the same options as a PHP array:

```php
use Timvandendries\Clock\Clock;

echo new Clock([
    'displays' => ['analog', 'digital'],
    'layout'   => 'column',
    'theme'    => 'auto',
    'analog'   => ['size' => 200, 'numbers' => 'roman'],
    'digital'  => ['date' => 'long'],
]);
```

`echo $clock` and `$clock->render()` both return the HTML. The first clock on a page also includes `clock.js` inline. To load the script from a URL instead, set this once:

```php
Clock::$scriptSrc = '/js/clock.js';
```

Requires PHP 8.0 or newer.

## Examples

`index.html` shows all examples live, by category. Each file in `examples/` is a complete page that only needs `clock.js`, so you can copy it as a starting point.

**Single displays**: [`analog.html`](examples/analog.html), [`digital.html`](examples/digital.html), [`bars.html`](examples/bars.html)

**Combinations**: [`analog-digital.html`](examples/analog-digital.html), [`analog-bars.html`](examples/analog-bars.html), [`digital-bars.html`](examples/digital-bars.html), [`analog-digital-bars.html`](examples/analog-digital-bars.html)

**Styles & options**

| Example | Shows |
|---------|-------|
| [`analog-roman-dark.html`](examples/analog-roman-dark.html) | Dark theme, roman numerals, sweeping seconds hand, gradient border, custom colors |
| [`analog-minimal.html`](examples/analog-minimal.html) | No numbers or border, hour ticks only, thicker hands |
| [`digital-12h-date.html`](examples/digital-12h-date.html) | 12-hour time, AM/PM, blinking colons, full date, panel |
| [`bars-rings.html`](examples/bars-rings.html) | Bars as count-down rings |
| [`bars-vertical-up.html`](examples/bars-vertical-up.html) | Vertical bars counting up, square ends, a label |
| [`world-clocks.html`](examples/world-clocks.html) | Several clocks in different time zones, set up with `data-clock` only |

## Upgrading from the old PHP clock

Before 1.0, the package (`dev-main`) was a single PHP class that drew an analog clock on a `<canvas>`, with only one clock per page. All of its settings are still available as analog options:

| Old property | New option |
|--------------|------------|
| `size` | `analog.size` |
| `numbers` | `analog.numbers` (`true` is now `'arabic'`, `false` is `'none'`) |
| `numbersColor` | `analog.colors.numbers` |
| `border`, `borderSize` | `analog.border` (the width; `0` for none) |
| `borderGradientStart`, `borderGradientMiddle`, `borderGradientEnd` | `analog.colors.border: [start, middle, end]` |
| `handSize` | `analog.handWidth` |
| `handHours`, `handMinutes`, `handSeconds` | `analog.hands: { hours, minutes, seconds }` |
| `handHoursColor`, `handMinutesColor`, `handSecondsColor` | `analog.colors.hours`, `.minutes`, `.seconds` |
| `centerCircle`, `centerCircleSize` | `analog.centerSize` (radius; `0` for none) |
| `centerCircleColor` | `analog.colors.center` |
| `$clock->showClock()` | `echo $clock` or `$clock->render()` |

Before:

```php
$clock = new Clock();
$clock->size = 200;
$clock->handSecondsColor = '#CC0000';
echo $clock->showClock();
```

After:

```php
echo new Clock(['analog' => ['size' => 200, 'colors' => ['seconds' => '#CC0000']]]);
```

## Browser support

Current versions of Chrome, Edge, Firefox and Safari. The clock uses SVG, CSS custom properties and `Intl.DateTimeFormat`.
