/*!
 * clock.js 2.0.0
 * Analog, digital and count-down bar clocks in any combination.
 * Tim van den Dries. See README.md for every option.
 */
(function (global, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        global.Clock = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const VERSION = '2.0.0';
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const DISPLAYS = ['analog', 'digital', 'bars'];
    const UNITS = ['hours', 'minutes', 'seconds'];
    const LABELS = { hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds' };
    const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

    const DEFAULTS = {
        displays: ['analog'],
        layout: 'row',
        gap: 40,
        theme: 'light',
        timeZone: null,
        locale: null,
        label: '',
        font: null,
        colors: {},
        onTick: null,
        analog: {
            size: 240,
            numbers: 'arabic',
            ticks: 'minutes',
            hands: { hours: true, minutes: true, seconds: true },
            handWidth: 5,
            smooth: false,
            border: 5,
            centerSize: 5,
            colors: {}
        },
        digital: {
            size: 56,
            hour12: false,
            seconds: true,
            leadingZero: null,
            blink: false,
            date: false,
            panel: false,
            font: null,
            colors: {}
        },
        bars: {
            units: ['hours', 'minutes', 'seconds'],
            direction: 'down',
            style: 'linear',
            orientation: 'horizontal',
            length: 260,
            thickness: 14,
            size: 96,
            smooth: true,
            rounded: true,
            labels: true,
            values: true,
            colors: {}
        }
    };

    // Maps the `colors` keys of each section to the CSS variable they set.
    const COLOR_VARS = {
        clock: { text: 'text', muted: 'muted' },
        analog: {
            face: 'face', border: 'border', ticks: 'ticks', numbers: 'numbers',
            hours: 'hand-hours', minutes: 'hand-minutes', seconds: 'hand-seconds', center: 'center'
        },
        digital: { text: 'digital', date: 'digital-date', panel: 'panel' },
        bars: {
            track: 'track', hours: 'bar-hours', minutes: 'bar-minutes', seconds: 'bar-seconds',
            text: 'bar-text', labels: 'bar-label'
        }
    };

    const STYLES = `
.clock{--clock-text:#1d1d1f;--clock-muted:#6e6e73;--clock-face:#fff;--clock-border:#1d1d1f;--clock-ticks:#1d1d1f;--clock-numbers:#1d1d1f;--clock-hand-hours:#1d1d1f;--clock-hand-minutes:#1d1d1f;--clock-hand-seconds:#d93025;--clock-center:#1d1d1f;--clock-digital:var(--clock-text);--clock-digital-date:var(--clock-muted);--clock-panel:#e9e9ee;--clock-track:#e1e1e7;--clock-bar-hours:#3867d6;--clock-bar-minutes:#1f9e78;--clock-bar-seconds:#d93025;--clock-bar-text:var(--clock-text);--clock-bar-label:var(--clock-muted);display:inline-flex;flex-direction:column;align-items:center;gap:14px;max-width:100%;box-sizing:border-box;color:var(--clock-text);font-family:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;line-height:1.2}
.clock--dark{--clock-text:#f2f2f4;--clock-muted:#9b9ba3;--clock-face:#1c1c20;--clock-border:#4a4a52;--clock-ticks:#c9c9cf;--clock-numbers:#f2f2f4;--clock-hand-hours:#f2f2f4;--clock-hand-minutes:#f2f2f4;--clock-hand-seconds:#ff5f52;--clock-center:#f2f2f4;--clock-panel:#1f1f24;--clock-track:#2c2c32;--clock-bar-hours:#7095f0;--clock-bar-minutes:#3cc79c;--clock-bar-seconds:#ff5f52}
@media (prefers-color-scheme:dark){.clock--auto{--clock-text:#f2f2f4;--clock-muted:#9b9ba3;--clock-face:#1c1c20;--clock-border:#4a4a52;--clock-ticks:#c9c9cf;--clock-numbers:#f2f2f4;--clock-hand-hours:#f2f2f4;--clock-hand-minutes:#f2f2f4;--clock-hand-seconds:#ff5f52;--clock-center:#f2f2f4;--clock-panel:#1f1f24;--clock-track:#2c2c32;--clock-bar-hours:#7095f0;--clock-bar-minutes:#3cc79c;--clock-bar-seconds:#ff5f52}}
.clock *,.clock *::before,.clock *::after{box-sizing:border-box}
.clock__label{font-size:15px;font-weight:600;letter-spacing:.01em}
.clock__group{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:var(--clock-gap);max-width:100%}
.clock__group--column{flex-direction:column;flex-wrap:nowrap}
.clock__group .clock__group{gap:calc(var(--clock-gap) / 2)}
.clock__group>*{min-width:0;max-width:100%}
.clock-analog{display:block;height:auto;overflow:visible}
.clock-analog__face{fill:var(--clock-face);stroke:var(--clock-border)}
.clock-analog__ticks{fill:none;stroke:var(--clock-ticks)}
.clock-analog__numbers{fill:var(--clock-numbers);font-weight:500}
.clock-analog__hand line{stroke-linecap:round}
.clock-analog__hand--hours line{stroke:var(--clock-hand-hours)}
.clock-analog__hand--minutes line{stroke:var(--clock-hand-minutes)}
.clock-analog__hand--seconds line{stroke:var(--clock-hand-seconds)}
.clock-analog__center{fill:var(--clock-center)}
.clock-digital{display:flex;flex-direction:column;align-items:center;gap:calc(var(--clock-digital-size) * .14);color:var(--clock-digital)}
.clock-digital--panel{padding:calc(var(--clock-digital-size) * .24) calc(var(--clock-digital-size) * .42);border-radius:calc(var(--clock-digital-size) * .24);background:var(--clock-panel)}
.clock-digital__time{display:flex;align-items:baseline;font-size:var(--clock-digital-size);font-weight:500;line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums;white-space:nowrap}
.clock-digital__sep{padding:0 .04em;transform:translateY(-.06em);transition:opacity .25s}
.clock-digital__sep.is-dim{opacity:.2}
.clock-digital__ampm{align-self:flex-start;margin-left:.35em;font-size:.3em;font-weight:600;letter-spacing:.06em}
.clock-digital__date{font-size:max(12px,calc(var(--clock-digital-size) * .26));color:var(--clock-digital-date);white-space:nowrap}
.clock-bars{font-variant-numeric:tabular-nums}
.clock-bars [data-unit=hours]{--clock-bar-color:var(--clock-bar-hours)}
.clock-bars [data-unit=minutes]{--clock-bar-color:var(--clock-bar-minutes)}
.clock-bars [data-unit=seconds]{--clock-bar-color:var(--clock-bar-seconds)}
.clock-bar__label{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--clock-bar-label)}
.clock-bar__value{font-size:15px;font-weight:600;color:var(--clock-bar-text)}
.clock-bar__track{overflow:hidden;background:var(--clock-track)}
.clock-bar__fill{background:var(--clock-bar-color)}
.clock-bars--rounded .clock-bar__track,.clock-bars--rounded .clock-bar__fill{border-radius:999px}
.clock-bars--horizontal{display:grid;align-items:center;column-gap:14px;row-gap:12px}
.clock-bars--horizontal .clock-bar{display:contents}
.clock-bars--horizontal .clock-bar__track{height:var(--clock-bar-thickness)}
.clock-bars--horizontal .clock-bar__fill{height:100%}
.clock-bars--horizontal .clock-bar__value{min-width:2ch;text-align:right}
.clock-bars--vertical{display:flex;align-items:flex-end;gap:22px}
.clock-bars--vertical .clock-bar{display:flex;flex-direction:column;align-items:center;gap:10px}
.clock-bars--vertical .clock-bar__track{display:flex;flex-direction:column;justify-content:flex-end;width:var(--clock-bar-thickness);height:var(--clock-bar-length)}
.clock-bars--vertical .clock-bar__fill{width:100%}
.clock-bars--ring{display:flex;flex-wrap:wrap;justify-content:center;gap:20px}
.clock-ring{display:flex;flex-direction:column;align-items:center;gap:10px}
.clock-ring__dial{position:relative;display:grid;place-items:center}
.clock-ring__dial svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.clock-ring__track{fill:none;stroke:var(--clock-track)}
.clock-ring__fill{fill:none;stroke:var(--clock-bar-color)}
.clock-bars--rounded .clock-ring__fill{stroke-linecap:round}
.clock-ring__dial .clock-bar__value{position:relative}
`;

    const registry = new WeakMap();
    const active = new Set();
    const zoneFormats = {};
    let uid = 0;
    let timer = null;
    let frameId = null;

    /* ---------- helpers ---------- */

    function isObject(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }

    // Deep-merges plain objects; arrays and other values are replaced.
    function merge(base, extra) {
        const out = {};
        for (const key in base) {
            out[key] = isObject(base[key]) ? merge(base[key], {}) : base[key];
        }
        if (isObject(extra)) {
            for (const key in extra) {
                const value = extra[key];
                out[key] = isObject(value) && isObject(out[key]) ? merge(out[key], value) : value;
            }
        }
        return out;
    }

    function oneOf(name, value, allowed, fallback) {
        if (allowed.indexOf(value) !== -1) {
            return value;
        }
        if (value !== undefined && value !== null && value !== fallback) {
            console.warn('Clock: invalid value "' + value + '" for ' + name + ', using "' + fallback + '"');
        }
        return fallback;
    }

    function num(value, fallback) {
        const n = Number(value);
        return value !== null && value !== '' && isFinite(n) ? n : fallback;
    }

    function px(value) {
        return typeof value === 'number' ? value + 'px' : String(value);
    }

    function fx(n) {
        return Math.round(n * 100) / 100;
    }

    function pad(n) {
        return n < 10 ? '0' + n : String(n);
    }

    function setText(node, text) {
        if (node.textContent !== text) {
            node.textContent = text;
        }
    }

    function html(tag, className, parent, text) {
        const node = document.createElement(tag);
        if (className) {
            node.className = className;
        }
        if (text !== undefined) {
            node.textContent = text;
        }
        if (parent) {
            parent.appendChild(node);
        }
        return node;
    }

    function svg(tag, attrs, parent) {
        const node = document.createElementNS(SVG_NS, tag);
        for (const key in attrs) {
            node.setAttribute(key, attrs[key]);
        }
        if (parent) {
            parent.appendChild(node);
        }
        return node;
    }

    function injectStyles() {
        if (document.getElementById('clockjs-styles')) {
            return;
        }
        const style = html('style');
        style.id = 'clockjs-styles';
        style.textContent = STYLES;
        // First in <head>, so the page's own CSS wins at equal specificity.
        document.head.insertBefore(style, document.head.firstChild);
    }

    // Hours, minutes and seconds on the wall clock of `timeZone` (or local time).
    function wallTime(now, timeZone) {
        if (!timeZone) {
            const d = new Date(now);
            return { h: d.getHours(), m: d.getMinutes(), s: d.getSeconds() };
        }
        const format = zoneFormats[timeZone] || (zoneFormats[timeZone] = new Intl.DateTimeFormat('en-US', {
            timeZone: timeZone, hourCycle: 'h23', hour: 'numeric', minute: 'numeric', second: 'numeric'
        }));
        const t = { h: 0, m: 0, s: 0 };
        format.formatToParts(now).forEach(function (part) {
            if (part.type === 'hour') t.h = Number(part.value) % 24;
            else if (part.type === 'minute') t.m = Number(part.value);
            else if (part.type === 'second') t.s = Number(part.value);
        });
        return t;
    }

    /* ---------- options ---------- */

    function parseDisplays(value) {
        if (typeof value === 'string') {
            value = value.split(/[\s,]+/);
        }
        const list = [];
        (Array.isArray(value) ? value : []).forEach(function (item) {
            if (Array.isArray(item)) {
                const group = parseDisplays(item);
                if (group.length) list.push(group);
            } else if (DISPLAYS.indexOf(item) !== -1) {
                list.push(item);
            } else if (item) {
                console.warn('Clock: unknown display "' + item + '", use ' + DISPLAYS.join(', '));
            }
        });
        return list;
    }

    function checkTimeZone(timeZone) {
        if (!timeZone) {
            return undefined;
        }
        try {
            new Intl.DateTimeFormat('en-US', { timeZone: timeZone });
            return timeZone;
        } catch (e) {
            console.warn('Clock: unknown time zone "' + timeZone + '", using local time');
            return undefined;
        }
    }

    function checkLocale(locale) {
        if (!locale) {
            return undefined;
        }
        try {
            new Intl.DateTimeFormat(locale);
            return locale;
        } catch (e) {
            console.warn('Clock: unknown locale "' + locale + '", using the browser default');
            return undefined;
        }
    }

    function normalize(o) {
        DISPLAYS.forEach(function (name) {
            if (!isObject(o[name])) o[name] = merge(Clock.defaults[name], {});
            if (!isObject(o[name].colors)) o[name].colors = {};
        });
        if (!isObject(o.colors)) o.colors = {};

        o.displays = parseDisplays(o.displays);
        if (!o.displays.length) o.displays = ['analog'];
        o.layout = oneOf('layout', o.layout, ['row', 'column'], 'row');
        o.theme = oneOf('theme', o.theme, ['light', 'dark', 'auto'], 'light');
        o.timeZone = checkTimeZone(o.timeZone);
        o.locale = checkLocale(o.locale);

        const a = o.analog;
        a.size = num(a.size, 240);
        a.numbers = oneOf('analog.numbers', a.numbers === true ? 'arabic' : a.numbers === false ? 'none' : a.numbers, ['arabic', 'roman', 'none'], 'arabic');
        a.ticks = oneOf('analog.ticks', a.ticks === true ? 'minutes' : a.ticks === false ? 'none' : a.ticks, ['minutes', 'hours', 'none'], 'minutes');
        if (typeof a.hands === 'boolean') a.hands = { hours: a.hands, minutes: a.hands, seconds: a.hands };
        if (!isObject(a.hands)) a.hands = merge(Clock.defaults.analog.hands, {});
        a.handWidth = Math.max(0.5, num(a.handWidth, 5));
        a.border = a.border === true ? 5 : Math.max(0, num(a.border, 0));
        a.centerSize = a.centerSize === true ? 5 : Math.max(0, num(a.centerSize, 0));
        a.smooth = !!a.smooth;

        const d = o.digital;
        d.size = num(d.size, 56);
        d.hour12 = !!d.hour12;
        d.seconds = d.seconds !== false;
        d.leadingZero = d.leadingZero === null || d.leadingZero === undefined ? !d.hour12 : !!d.leadingZero;
        d.blink = !!d.blink;
        d.panel = !!d.panel;
        d.date = d.date === true ? 'long' : oneOf('digital.date', d.date, ['full', 'long', 'medium', 'short'], false);

        const b = o.bars;
        b.units = (typeof b.units === 'string' ? b.units.split(/[\s,]+/) : Array.isArray(b.units) ? b.units : UNITS)
            .filter(function (unit) { return UNITS.indexOf(unit) !== -1; });
        if (!b.units.length) b.units = UNITS.slice();
        b.direction = oneOf('bars.direction', b.direction, ['down', 'up'], 'down');
        b.style = oneOf('bars.style', b.style, ['linear', 'ring'], 'linear');
        b.orientation = oneOf('bars.orientation', b.orientation, ['horizontal', 'vertical'], 'horizontal');
        b.length = num(b.length, 260);
        b.thickness = num(b.thickness, 14);
        b.size = num(b.size, 96);
        b.smooth = b.smooth !== false;
        b.rounded = b.rounded !== false;
        b.values = b.values !== false;
        b.labels = b.labels === false ? null : merge(LABELS, isObject(b.labels) ? b.labels : {});

        return o;
    }

    function applyColors(root, o) {
        const sections = { clock: o.colors, analog: o.analog.colors, digital: o.digital.colors, bars: o.bars.colors };
        for (const section in COLOR_VARS) {
            const colors = sections[section];
            for (const key in COLOR_VARS[section]) {
                if (typeof colors[key] === 'string' && colors[key]) {
                    root.style.setProperty('--clock-' + COLOR_VARS[section][key], colors[key]);
                }
            }
        }
    }

    /* ---------- displays ---------- */

    function analog(opt) {
        const id = 'clock-' + (++uid);
        const border = opt.border;
        const inner = 99 - border;
        const node = svg('svg', {
            class: 'clock-analog', viewBox: '-100 -100 200 200',
            width: opt.size, height: opt.size, 'aria-hidden': 'true'
        });

        const face = svg('circle', { class: 'clock-analog__face', r: 99 - border / 2, 'stroke-width': border }, node);
        const borderColor = opt.colors.border;
        if (!border) {
            face.style.stroke = 'none';
        } else if (Array.isArray(borderColor) && borderColor.length) {
            // A list of colors becomes a gradient running from the inside to the outside of the border.
            const stops = borderColor.length === 1 ? [borderColor[0], borderColor[0]] : borderColor;
            const gradient = svg('radialGradient', { id: id + '-border', gradientUnits: 'userSpaceOnUse', cx: 0, cy: 0, r: 99 }, svg('defs', {}, node));
            stops.forEach(function (color, i) {
                svg('stop', { offset: fx((inner + border * i / (stops.length - 1)) / 99), 'stop-color': color }, gradient);
            });
            face.style.stroke = 'url(#' + id + '-border)';
        }

        if (opt.ticks !== 'none') {
            let hourPath = '';
            let minutePath = '';
            for (let i = 0; i < 60; i++) {
                const isHour = i % 5 === 0;
                if (!isHour && opt.ticks !== 'minutes') continue;
                const angle = i * Math.PI / 30;
                const from = inner - 4;
                const to = inner - (isHour ? 13 : 8);
                const d = 'M' + fx(Math.sin(angle) * from) + ' ' + fx(-Math.cos(angle) * from) +
                          'L' + fx(Math.sin(angle) * to) + ' ' + fx(-Math.cos(angle) * to);
                if (isHour) hourPath += d; else minutePath += d;
            }
            if (minutePath) svg('path', { class: 'clock-analog__ticks', d: minutePath, 'stroke-width': 1.2 }, node);
            svg('path', { class: 'clock-analog__ticks', d: hourPath, 'stroke-width': 3 }, node);
        }

        if (opt.numbers !== 'none') {
            const roman = opt.numbers === 'roman';
            const radius = inner - (opt.ticks === 'none' ? 15 : 27);
            const group = svg('g', { class: 'clock-analog__numbers', 'font-size': roman ? 14 : 18, 'text-anchor': 'middle' }, node);
            for (let n = 1; n <= 12; n++) {
                const angle = n * Math.PI / 6;
                svg('text', { x: fx(Math.sin(angle) * radius), y: fx(-Math.cos(angle) * radius), dy: '0.35em' }, group)
                    .textContent = roman ? ROMAN[n] : String(n);
            }
        }

        // [name, length, width, tail]
        const hands = {};
        [
            ['hours', inner * 0.52, opt.handWidth, 0],
            ['minutes', inner * 0.76, opt.handWidth, 0],
            ['seconds', inner * 0.86, Math.max(1, opt.handWidth * 0.4), inner * 0.16]
        ].forEach(function (hand) {
            if (!opt.hands[hand[0]]) return;
            const group = svg('g', { class: 'clock-analog__hand clock-analog__hand--' + hand[0] }, node);
            svg('line', { x1: 0, y1: fx(hand[3]), x2: 0, y2: fx(-hand[1]), 'stroke-width': hand[2] }, group);
            hands[hand[0]] = group;
        });

        if (opt.centerSize) {
            svg('circle', { class: 'clock-analog__center', r: opt.centerSize }, node);
        }

        function rotate(hand, degrees) {
            if (hand) hand.setAttribute('transform', 'rotate(' + fx(degrees) + ')');
        }

        return {
            node: node,
            smooth: opt.smooth && !!hands.seconds,
            update: function (t) {
                const seconds = t.s + (opt.smooth ? t.ms / 1000 : 0);
                const minutes = t.m + seconds / 60;
                rotate(hands.hours, (t.h % 12 + minutes / 60) * 30);
                rotate(hands.minutes, minutes * 6);
                rotate(hands.seconds, seconds * 6);
            }
        };
    }

    function digital(opt, o) {
        const node = html('div', 'clock-digital' + (opt.panel ? ' clock-digital--panel' : ''));
        node.style.setProperty('--clock-digital-size', px(opt.size));
        if (opt.font) node.style.fontFamily = opt.font;

        const time = html('div', 'clock-digital__time', node);
        const separators = [];
        const hours = html('span', 'clock-digital__hours', time);
        separators.push(html('span', 'clock-digital__sep', time, ':'));
        const minutes = html('span', 'clock-digital__minutes', time);
        let seconds = null;
        if (opt.seconds) {
            separators.push(html('span', 'clock-digital__sep', time, ':'));
            seconds = html('span', 'clock-digital__seconds', time);
        }
        const ampm = opt.hour12 ? html('span', 'clock-digital__ampm', time) : null;

        let date = null;
        let dateFormat = null;
        if (opt.date) {
            date = html('div', 'clock-digital__date', node);
            dateFormat = new Intl.DateTimeFormat(o.locale, { dateStyle: opt.date, timeZone: o.timeZone });
        }

        return {
            node: node,
            smooth: false,
            update: function (t) {
                if (!t.changed) return;
                const h = opt.hour12 ? (t.h % 12 || 12) : t.h;
                setText(hours, opt.leadingZero ? pad(h) : String(h));
                setText(minutes, pad(t.m));
                if (seconds) setText(seconds, pad(t.s));
                if (ampm) setText(ampm, t.h < 12 ? 'AM' : 'PM');
                if (opt.blink) {
                    separators.forEach(function (sep) { sep.classList.toggle('is-dim', t.s % 2 === 1); });
                }
                if (date) setText(date, dateFormat.format(t.now));
            }
        };
    }

    function bars(opt) {
        const ring = opt.style === 'ring';
        const vertical = !ring && opt.orientation === 'vertical';
        const down = opt.direction === 'down';
        const node = html('div', 'clock-bars clock-bars--' + (ring ? 'ring' : vertical ? 'vertical' : 'horizontal') +
                                 (opt.rounded ? ' clock-bars--rounded' : ''));
        node.style.setProperty('--clock-bar-thickness', px(opt.thickness));
        node.style.setProperty('--clock-bar-length', px(opt.length));
        if (!ring && !vertical) {
            node.style.gridTemplateColumns = [opt.labels && 'auto', 'minmax(0, ' + px(opt.length) + ')', opt.values && 'auto']
                .filter(Boolean).join(' ');
        }

        const items = opt.units.map(function (unit) {
            const item = html('div', ring ? 'clock-ring' : 'clock-bar', node);
            item.setAttribute('data-unit', unit);
            const entry = { unit: unit, fill: null, value: null };

            if (ring) {
                const dial = html('div', 'clock-ring__dial', item);
                dial.style.width = dial.style.height = px(opt.size);
                const stroke = opt.thickness * 100 / opt.size;
                const r = 50 - stroke / 2;
                const circle = svg('svg', { viewBox: '0 0 100 100', 'aria-hidden': 'true' }, dial);
                svg('circle', { class: 'clock-ring__track', cx: 50, cy: 50, r: r, 'stroke-width': stroke }, circle);
                entry.fill = svg('circle', {
                    class: 'clock-ring__fill', cx: 50, cy: 50, r: r, 'stroke-width': stroke,
                    pathLength: 100, transform: 'rotate(-90 50 50)'
                }, circle);
                if (opt.values) {
                    entry.value = html('span', 'clock-bar__value', dial);
                    entry.value.style.fontSize = px(Math.round(opt.size * 0.28));
                }
                if (opt.labels) html('span', 'clock-bar__label', item, opt.labels[unit]);
            } else {
                if (opt.labels && !vertical) html('span', 'clock-bar__label', item, opt.labels[unit]);
                if (opt.values && vertical) entry.value = html('span', 'clock-bar__value', item);
                entry.fill = html('div', 'clock-bar__fill', html('div', 'clock-bar__track', item));
                if (opt.values && !vertical) entry.value = html('span', 'clock-bar__value', item);
                if (opt.labels && vertical) html('span', 'clock-bar__label', item, opt.labels[unit]);
            }
            return entry;
        });

        return {
            node: node,
            smooth: opt.smooth,
            update: function (t) {
                const s = t.s + (opt.smooth ? t.ms / 1000 : 0);
                items.forEach(function (item) {
                    let elapsed;
                    let value;
                    if (item.unit === 'hours') {
                        elapsed = (t.h + (t.m + s / 60) / 60) / 24;
                        value = down ? 23 - t.h : t.h;
                    } else if (item.unit === 'minutes') {
                        elapsed = (t.m + s / 60) / 60;
                        value = down ? 59 - t.m : t.m;
                    } else {
                        elapsed = s / 60;
                        value = down ? 59 - t.s : t.s;
                    }
                    const fraction = down ? 1 - elapsed : elapsed;
                    if (ring) {
                        item.fill.setAttribute('stroke-dasharray', fx(fraction * 100) + ' 100');
                        // A zero-length dash with round caps would still paint a dot.
                        item.fill.style.opacity = fraction < 0.004 ? '0' : '';
                    } else {
                        item.fill.style[vertical ? 'height' : 'width'] = fx(fraction * 100) + '%';
                    }
                    if (item.value) setText(item.value, pad(value));
                });
            }
        };
    }

    const RENDERERS = { analog: analog, digital: digital, bars: bars };

    /* ---------- timing ---------- */

    // One shared loop: animation frames while any clock moves smoothly,
    // otherwise a timer aligned to the start of each second.
    function schedule() {
        clearTimeout(timer);
        if (frameId !== null) cancelAnimationFrame(frameId);
        timer = frameId = null;
        if (!active.size) return;

        let smooth = false;
        active.forEach(function (clock) { if (clock.smooth) smooth = true; });
        if (smooth) {
            frameId = requestAnimationFrame(frame);
        } else {
            timer = setTimeout(frame, 1000 - Date.now() % 1000 + 5);
        }
    }

    function frame() {
        const now = Date.now();
        try {
            active.forEach(function (clock) { clock._tick(now, false); });
        } finally {
            schedule();
        }
    }

    if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden && active.size) frame();
        });
    }

    /* ---------- Clock ---------- */

    class Clock {

        constructor(target, options) {
            const el = typeof target === 'string' ? document.querySelector(target) : target;
            if (!el || el.nodeType !== 1) {
                throw new Error('Clock: no element found for ' + target);
            }
            const previous = registry.get(el);
            if (previous) previous.destroy();

            this.el = el;
            this.root = null;
            this.parts = [];
            this._options = isObject(options) ? options : {};
            registry.set(el, this);
            this._render();
            active.add(this);
            schedule();
        }

        setOptions(options) {
            this._options = merge(this._options, options);
            this._render();
            schedule();
            return this;
        }

        destroy() {
            active.delete(this);
            if (registry.get(this.el) === this) registry.delete(this.el);
            if (this.root) this.root.remove();
            this.root = null;
            this.parts = [];
            schedule();
        }

        _render() {
            injectStyles();
            const o = this.options = normalize(merge(Clock.defaults, this._options));

            this.el.textContent = '';
            const root = this.root = html('div', 'clock clock--' + o.theme);
            root.setAttribute('role', 'img');
            root.style.setProperty('--clock-gap', px(o.gap));
            if (o.font) root.style.fontFamily = o.font;
            applyColors(root, o);
            if (o.label) html('div', 'clock__label', root, o.label);

            this.parts = [];
            this._group(o.displays, o.layout, root);
            this.smooth = this.parts.some(function (part) { return part.smooth; });
            this.el.appendChild(root);

            this._second = null;
            this._minute = null;
            this._tick(Date.now(), true);
        }

        // Nested arrays become groups laid out in the opposite direction of their parent.
        _group(list, direction, parent) {
            const group = html('div', 'clock__group clock__group--' + direction, parent);
            list.forEach(function (item) {
                if (Array.isArray(item)) {
                    this._group(item, direction === 'row' ? 'column' : 'row', group);
                } else {
                    const part = RENDERERS[item](this.options[item], this.options);
                    group.appendChild(part.node);
                    this.parts.push(part);
                }
            }, this);
        }

        _tick(now, force) {
            if (!this.root || (!force && !this.root.isConnected)) return;
            const second = Math.floor(now / 1000);
            const changed = second !== this._second;
            if (!changed && !this.smooth) return;
            if (changed) {
                this._second = second;
                this._time = wallTime(now, this.options.timeZone);
            }

            const t = { h: this._time.h, m: this._time.m, s: this._time.s, ms: now - second * 1000, now: now, changed: changed };
            this.parts.forEach(function (part) { part.update(t); });

            if (!changed) return;
            if (t.m !== this._minute) {
                this._minute = t.m;
                this.root.setAttribute('aria-label', (this.options.label ? this.options.label + ', ' : '') + pad(t.h) + ':' + pad(t.m));
            }
            if (typeof this.options.onTick === 'function') {
                try {
                    this.options.onTick({ hours: t.h, minutes: t.m, seconds: t.s, date: new Date(now) }, this);
                } catch (e) {
                    console.error(e);
                }
            }
        }

        // Starts a clock on every element with a data-clock attribute inside `scope`.
        static init(scope) {
            const created = [];
            (scope || document).querySelectorAll('[data-clock]').forEach(function (el) {
                if (registry.has(el)) return;
                const raw = (el.getAttribute('data-clock') || '').trim();
                let options = {};
                if (raw.charAt(0) === '{') {
                    try {
                        options = JSON.parse(raw);
                    } catch (e) {
                        console.error('Clock: invalid JSON in data-clock', el, e);
                        return;
                    }
                } else if (raw) {
                    options = { displays: raw };
                }
                created.push(new Clock(el, options));
            });
            return created;
        }
    }

    Clock.version = VERSION;
    Clock.defaults = DEFAULTS;

    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () { Clock.init(); });
        } else {
            Clock.init();
        }
    }

    return Clock;
}));
