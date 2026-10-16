/*
 * Contribution Skyline: a year of GitHub activity as a heat map that folds up
 * into an isometric skyline, and back down again.
 *
 * It is one scene, not two charts. Every day is a box on a grid; the flat view
 * is that grid seen straight down, the 3D view is the same grid seen from the
 * corner. Switching views swings one camera between the two while each week's
 * bars rise (or settle) in a wave from the oldest week to the newest.
 *
 * Hover or tap a day for its count, arrow keys walk the grid, hover a legend
 * swatch to isolate that level, and in 3D drag to orbit (double-click resets).
 *
 * Plain canvas + DOM. Colours come from CSS custom properties on the page
 * (--sk-0 … --sk-4, --sk-bg, --sk-fg, --sk-muted), so the theme lives in
 * styles.css and theme switches blend instead of flipping.
 */
(function () {
    'use strict';

    const DAY_MS = 86400000;
    const FG_FALLBACK = [244, 247, 251];
    const BG_FALLBACK = [14, 27, 48];
    const MUTED_FALLBACK = [138, 160, 184];

    // ── Pure maths: dates, grid, stats, levels, camera, colour ──

    const clamp01 = (v) => (v > 0 ? (v < 1 ? v : 1) : 0);
    const lerp = (a, b, t) => a + (b - a) * t;
    const easeInOutCubic = (x) => {
        const t = clamp01(x);
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
    const easeOutCubic = (x) => 1 - Math.pow(1 - clamp01(x), 3);
    const smoothstep = (a, b, x) => {
        const t = clamp01((x - a) / (b - a));
        return t * t * (3 - 2 * t);
    };

    /** UTC midnight → "YYYY-MM-DD". */
    const toKey = (ms) => new Date(ms).toISOString().slice(0, 10);

    /** Any date-ish value → UTC midnight of its calendar day. "YYYY-MM-DD" is read literally. */
    const dayMs = (v) => {
        if (typeof v === 'number') return Math.floor(v / DAY_MS) * DAY_MS;
        if (typeof v === 'string') {
            const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v);
            if (m) return Date.UTC(+m[1], +m[2] - 1, +m[3]);
            v = new Date(v);
        }
        return Date.UTC(v.getFullYear(), v.getMonth(), v.getDate());
    };

    /** 0 for an empty day, else 1–4 by quarters of `busy`. Anything at or past `busy` is 4. */
    const levelOf = (count, busy) => (count <= 0 ? 0 : busy <= 0 ? 4 : 1 + Math.min(3, Math.floor((count / busy) * 4)));

    /**
     * Columns are weeks, rows are weekdays (row 0 = `weekStart`). The grid ends on
     * `endMs` and starts on the week containing the day one year earlier. Levels
     * split the non-zero days by their share of a busy day, the 95th percentile,
     * so one freak day can't wash every other day out to level 1.
     */
    function buildGrid(data, endMs, weekStart) {
        const counts = new Map();
        for (const d of data) {
            if (!d || typeof d.date !== 'string') continue;
            const ms = dayMs(d.date);
            const c = Number(d.count);
            if (!Number.isFinite(ms) || !(c > 0) || !Number.isFinite(c)) continue;
            const k = toKey(ms);
            counts.set(k, (counts.get(k) || 0) + c);
        }
        let start = endMs - 364 * DAY_MS;
        start -= ((new Date(start).getUTCDay() - weekStart + 7) % 7) * DAY_MS;
        const cells = [];
        for (let ms = start, i = 0; ms <= endMs; ms += DAY_MS, i++) {
            const date = toKey(ms);
            cells.push({ date, count: counts.get(date) || 0, level: 0, week: Math.floor(i / 7), day: i % 7 });
        }
        const nz = cells.map((c) => c.count).filter((c) => c > 0).sort((a, b) => a - b);
        const busy = nz.length ? nz[Math.floor(0.95 * (nz.length - 1))] : 0;
        for (const c of cells) c.level = levelOf(c.count, busy);
        return { cells, weeks: cells.length ? cells[cells.length - 1].week + 1 : 0, max: nz.length ? nz[nz.length - 1] : 0 };
    }

    /** Total, busiest day, longest run, and the run that reaches today (or yesterday: today isn't over). */
    function computeStats(cells) {
        let total = 0;
        let best = 0;
        let bestDate = null;
        let run = 0;
        let runStart = null;
        let longest = { days: 0, start: null, end: null };
        for (const c of cells) {
            total += c.count;
            if (c.count > best) {
                best = c.count;
                bestDate = c.date;
            }
            if (c.count > 0) {
                if (run === 0) runStart = c.date;
                run++;
                if (run > longest.days) longest = { days: run, start: runStart, end: c.date };
            } else run = 0;
        }
        let j = cells.length - 1;
        if (j >= 0 && cells[j].count === 0) j--;
        const endAt = j;
        while (j >= 0 && cells[j].count > 0) j--;
        const days = endAt - j;
        const current = days > 0 ? { days, start: cells[j + 1].date, end: cells[endAt].date } : { days: 0, start: null, end: null };
        return {
            total,
            first: cells.length ? cells[0].date : null,
            last: cells.length ? cells[cells.length - 1].date : null,
            busiest: { count: best, date: bestDate },
            longest,
            current
        };
    }

    /** A label on each week whose first day starts a new month; a cramped first label is dropped. */
    function monthLabels(cells, weeks, locale) {
        const fmt = new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' });
        const out = [];
        let prev = -1;
        for (let w = 0; w < weeks; w++) {
            const c = cells[w * 7];
            if (!c) break;
            const m = +c.date.slice(5, 7);
            if (m !== prev) out.push({ week: w, label: fmt.format(dayMs(c.date)) });
            prev = m;
        }
        if (out.length > 1 && out[1].week - out[0].week < 3) out.shift();
        return out;
    }

    /** Box height in grid units. Empty days are thin slabs; the busiest day is ~7.6 cells tall. */
    const barHeight = (count, max, scale) => (count > 0 && max > 0 ? 0.4 + Math.pow(count / max, 0.85) * 7.2 * scale : 0.2);

    /** Share of the morph each bar spends waiting: the wave sweeps oldest week → newest. */
    const WAVE = 0.42;

    /** 0 → 1 as a bar rises during the morph. Every bar is flat at t=0 and fully up at t=1. */
    const riseAt = (t, week, weeks, day) => {
        const d = (weeks > 1 ? week / (weeks - 1) : 0) * 0.36 + (day / 6) * 0.06;
        return easeOutCubic((t - d) / (1 - WAVE));
    };

    const YAW_3D = Math.PI / 4;
    const ELEV_3D = (34 * Math.PI) / 180;
    const YAW_RANGE = [(8 * Math.PI) / 180, (82 * Math.PI) / 180];
    const ELEV_RANGE = [(18 * Math.PI) / 180, (62 * Math.PI) / 180];

    /**
     * e=0 looks straight down: x across, y down, height invisible, a plain heat
     * map. e=1 is the isometric corner view. Orbit offsets apply in proportion to
     * e, so the flat view never tilts.
     */
    function camera(e, dYaw, dElev) {
        const yaw = Math.min(YAW_RANGE[1], Math.max(0, lerp(0, YAW_3D + dYaw, e)));
        const elev = lerp(Math.PI / 2, Math.min(ELEV_RANGE[1], Math.max(ELEV_RANGE[0], ELEV_3D + dElev)), e);
        return { cs: Math.cos(yaw), sn: Math.sin(yaw), se: Math.sin(elev), ce: Math.cos(elev) };
    }

    /** World (x = week, y = weekday, z = up) → screen, before scale/offset. */
    const project = (c, x, y, z) => [x * c.cs - y * c.sn, (x * c.sn + y * c.cs) * c.se - z * c.ce];

    const luminance = (c) => (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;

    // Any CSS colour → sRGB, by letting the browser paint it.
    let probe = null;
    function toRGB(color, fallback) {
        if (!color) return fallback;
        if (!probe) {
            const c = document.createElement('canvas');
            c.width = c.height = 1;
            probe = c.getContext('2d', { willReadFrequently: true });
        }
        if (!probe) return fallback;
        probe.clearRect(0, 0, 1, 1);
        probe.fillStyle = 'rgba(0,0,0,0)';
        probe.fillStyle = color;
        probe.fillRect(0, 0, 1, 1);
        const d = probe.getImageData(0, 0, 1, 1).data;
        if (d[3] < 8) return fallback;
        return [d[0], d[1], d[2]];
    }

    const rgbString = (r, g, b) => 'rgb(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ')';

    function pointInQuad(p, o, x, y) {
        let sign = 0;
        for (let k = 0; k < 4; k++) {
            const ax = p[o + k * 2];
            const ay = p[o + k * 2 + 1];
            const bx = p[o + ((k + 1) % 4) * 2];
            const by = p[o + ((k + 1) % 4) * 2 + 1];
            const cross = (bx - ax) * (y - ay) - (by - ay) * (x - ax);
            if (Math.abs(cross) < 1e-9) continue;
            const s = cross > 0 ? 1 : -1;
            if (sign === 0) sign = s;
            else if (s !== sign) return false;
        }
        return sign !== 0;
    }

    function quadPath(ctx, p, o, r) {
        if (r < 0.3) {
            ctx.moveTo(p[o], p[o + 1]);
            ctx.lineTo(p[o + 2], p[o + 3]);
            ctx.lineTo(p[o + 4], p[o + 5]);
            ctx.lineTo(p[o + 6], p[o + 7]);
            ctx.closePath();
            return;
        }
        ctx.moveTo((p[o + 6] + p[o]) / 2, (p[o + 7] + p[o + 1]) / 2);
        for (let k = 0; k < 4; k++) {
            const b = (k + 1) % 4;
            ctx.arcTo(p[o + k * 2], p[o + k * 2 + 1], p[o + b * 2], p[o + b * 2 + 1], r);
        }
        ctx.closePath();
    }

    const GRID_ICON = '<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2" fill="currentColor"/><rect x="9" y="1.5" width="5.5" height="5.5" rx="1.2" fill="currentColor"/><rect x="1.5" y="9" width="5.5" height="5.5" rx="1.2" fill="currentColor"/><rect x="9" y="9" width="5.5" height="5.5" rx="1.2" fill="currentColor"/></svg>';
    const CUBE_ICON = '<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M8 1.2 14.2 4.6v6.8L8 14.8 1.8 11.4V4.6Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M1.8 4.6 8 8l6.2-3.4M8 8v6.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';
    const ARROW_ICON = '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    const TEMPLATE = `
        <header class="skyline-head">
            <div class="skyline-heading">
                <p class="skyline-title"></p>
                <a class="skyline-source" target="_blank" rel="noreferrer"></a>
            </div>
            <div class="skyline-toggle" role="group">
                <span class="skyline-toggle-thumb" aria-hidden="true"></span>
                <button type="button" class="skyline-toggle-btn" data-view="2d">${GRID_ICON}</button>
                <button type="button" class="skyline-toggle-btn" data-view="3d">${CUBE_ICON}</button>
            </div>
        </header>
        <div class="skyline-frame">
            <div class="skyline-stage">
                <canvas class="skyline-canvas" tabindex="0" role="img"></canvas>
                <div class="skyline-corner skyline-corner--end"></div>
                <div class="skyline-corner skyline-corner--start"></div>
            </div>
            <div class="skyline-tip" role="tooltip" aria-hidden="true"><strong></strong><span></span></div>
        </div>
        <div class="skyline-row"><div class="skyline-row-clip"><div class="skyline-stats"></div></div></div>
        <footer class="skyline-foot">
            <p class="skyline-hint"></p>
            <div class="skyline-legend">
                <span class="skyline-legend-less"></span>
                <span class="skyline-swatches"></span>
                <span class="skyline-legend-more"></span>
            </div>
        </footer>
        <p class="sr-only" aria-live="polite"></p>`;

    /**
     * Mount a skyline into `host`.
     * options: { data: [{ date, count }], strings, locale, source: { live, asOf, url, user },
     *            duration, heightScale, weekStart, maxHeight, scrub, onViewRequest }
     * maxHeight: optional () => px, a ceiling for the 3D stage so the card fits its screen.
     * scrub: the page drives the rise with setProgress(0…1), usually from scroll position, so it
     *        can rest anywhere in between. The 2D/3D buttons then call onViewRequest(view) and
     *        leave it to the page to scroll there.
     */
    function create(host, options) {
        const settings = Object.assign({ duration: 1300, heightScale: 1, weekStart: 0, locale: 'en-US', scrub: false }, options);
        let strings = settings.strings;
        let locale = settings.locale;
        let model = null;
        let formats = null;
        let view = '3d';
        let legendLevel = -1;
        let corners = false;
        let scrubT = 0;

        const root = document.createElement('div');
        root.className = settings.scrub ? 'skyline is-scrub' : 'skyline';
        root.innerHTML = TEMPLATE;
        root.style.setProperty('--rise-end', Math.round(settings.duration * 0.55) + 'ms');
        root.style.setProperty('--rise-start', Math.round(settings.duration * 0.68) + 'ms');

        const $ = (selector) => root.querySelector(selector);
        const titleEl = $('.skyline-title');
        const sourceEl = $('.skyline-source');
        const toggleEl = $('.skyline-toggle');
        const toggleButtons = Array.from(root.querySelectorAll('.skyline-toggle-btn'));
        const stage = $('.skyline-stage');
        const canvas = $('.skyline-canvas');
        const tip = $('.skyline-tip');
        const tipCount = tip.querySelector('strong');
        const tipDate = tip.querySelector('span');
        const cornerEnd = $('.skyline-corner--end');
        const cornerStart = $('.skyline-corner--start');
        const statsRow = $('.skyline-row');
        const statsList = $('.skyline-stats');
        const hintEl = $('.skyline-hint');
        const legendLess = $('.skyline-legend-less');
        const legendMore = $('.skyline-legend-more');
        const swatchWrap = $('.skyline-swatches');
        const liveRegion = $('[aria-live]');
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        const swatches = [0, 1, 2, 3, 4].map((level) => {
            const swatch = document.createElement('button');
            swatch.type = 'button';
            swatch.className = 'skyline-swatch';
            swatch.style.setProperty('--swatch', 'var(--sk-' + level + ')');
            const isolate = () => setLegendLevel(level);
            const release = () => setLegendLevel(-1);
            swatch.addEventListener('pointerenter', isolate);
            swatch.addEventListener('pointerleave', release);
            swatch.addEventListener('focus', isolate);
            swatch.addEventListener('blur', release);
            swatchWrap.append(swatch);
            return swatch;
        });

        host.replaceChildren(root);
        host.removeAttribute('aria-busy');

        // ── Text, formats, model ──

        function buildFormats() {
            formats = {
                number: new Intl.NumberFormat(locale),
                short: new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', timeZone: 'UTC' }),
                year: new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
                tip: new Intl.DateTimeFormat(locale, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
                long: new Intl.DateTimeFormat(locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
            };
        }

        function buildModel() {
            const data = settings.data || [];
            const dates = data.map((d) => dayMs(d.date)).filter(Number.isFinite);
            const end = dates.length ? Math.max(...dates) : dayMs(new Date());
            const grid = buildGrid(data, end, settings.weekStart);
            model = Object.assign(grid, { stats: computeStats(grid.cells), months: monthLabels(grid.cells, grid.weeks, locale) });
        }

        const fmt = (n) => formats.number.format(n);
        const noun = (n) => (n === 1 ? strings.unit : strings.unitPlural);
        const dayNoun = (n) => (n === 1 ? strings.day : strings.days);
        const countText = (count) => (count ? fmt(count) + ' ' + noun(count) : strings.none);
        const range = (a, b, withYear) => {
            if (!a || !b) return '—';
            const f = withYear ? formats.year : formats.short;
            return f.format(dayMs(a)) + ' – ' + f.format(dayMs(b));
        };
        const describe = (i) => {
            const c = model.cells[i];
            return c ? countText(c.count) + ', ' + formats.long.format(dayMs(c.date)) : '';
        };

        function statNode(block) {
            const node = document.createElement('div');
            node.className = 'skyline-stat';
            for (const key of ['label', 'value', 'unit', 'sub']) {
                const part = document.createElement('span');
                part.className = 'skyline-stat-' + key;
                part.textContent = block[key];
                node.append(part);
            }
            return node;
        }

        let totalEl = null;

        function renderTexts() {
            const { stats } = model;
            const [before, after] = strings.heading.split('{n}');
            // The visible figure counts up as the skyline rises; screen readers get the real total.
            totalEl = document.createElement('strong');
            totalEl.className = 'skyline-total';
            totalEl.setAttribute('aria-hidden', 'true');
            totalEl.textContent = fmt(entered || reduced ? stats.total : 0);
            const spokenTotal = document.createElement('span');
            spokenTotal.className = 'sr-only';
            spokenTotal.textContent = fmt(stats.total);
            titleEl.replaceChildren(before || '', totalEl, spokenTotal, after || '');

            const source = settings.source || {};
            const note = source.live ? strings.live : strings.snapshot.replace('{date}', source.asOf ? formats.year.format(dayMs(source.asOf)) : '');
            sourceEl.href = source.url || '#';
            sourceEl.innerHTML = '';
            sourceEl.append('@' + (source.user || 'github') + ' · ' + note);
            sourceEl.insertAdjacentHTML('beforeend', ARROW_ICON);

            toggleEl.setAttribute('aria-label', strings.viewGroup);
            toggleButtons.forEach((button) => {
                const label = button.dataset.view === '2d' ? strings.view2d : strings.view3d;
                button.setAttribute('aria-label', label);
                button.title = label;
            });

            const blocks = [
                { label: strings.stats[0], value: fmt(stats.total), unit: noun(stats.total), sub: range(stats.first, stats.last, true) },
                { label: strings.stats[1], value: fmt(stats.busiest.count), unit: noun(stats.busiest.count), sub: stats.busiest.date ? formats.short.format(dayMs(stats.busiest.date)) : '—' },
                { label: strings.stats[2], value: fmt(stats.longest.days), unit: dayNoun(stats.longest.days), sub: range(stats.longest.start, stats.longest.end) },
                { label: strings.stats[3], value: fmt(stats.current.days), unit: dayNoun(stats.current.days), sub: range(stats.current.start, stats.current.end) }
            ];
            cornerEnd.replaceChildren(statNode(blocks[0]), statNode(blocks[1]));
            cornerStart.replaceChildren(statNode(blocks[2]), statNode(blocks[3]));
            statsList.replaceChildren(...blocks.map(statNode));

            legendLess.textContent = strings.less;
            legendMore.textContent = strings.more;
            swatches.forEach((swatch, level) => swatch.setAttribute('aria-label', strings.levels[level]));

            renderTip();
            renderView();
        }

        function renderView() {
            const is3d = settings.scrub ? scrubT >= 0.5 : view === '3d';
            // Scrubbed, the card keeps one height throughout: wide cards keep the stats in the corners.
            const rowHidden = settings.scrub ? corners : is3d && corners;
            root.classList.toggle('is-view-3d', is3d);
            root.classList.toggle('has-corners', corners);
            root.classList.toggle('row-hidden', rowHidden);
            statsRow.setAttribute('aria-hidden', String(rowHidden));
            cornerEnd.setAttribute('aria-hidden', String(!rowHidden));
            cornerStart.setAttribute('aria-hidden', String(!rowHidden));
            toggleButtons.forEach((button) => button.setAttribute('aria-pressed', String((button.dataset.view === '3d') === is3d)));
            const touch = !window.matchMedia('(hover: hover)').matches;
            if (settings.scrub && !is3d) hintEl.textContent = strings.hintScrub || strings.hint2d;
            else hintEl.textContent = touch ? (is3d ? strings.hintTouch3d : strings.hintTouch2d) : (is3d ? strings.hint3d : strings.hint2d);
            canvas.setAttribute('aria-label', countText(model.stats.total) + ', ' + range(model.stats.first, model.stats.last, true) + '. ' + (is3d ? strings.view3d : strings.view2d) + '. ' + strings.keys);
        }

        function renderTip() {
            const c = activeIdx >= 0 ? model.cells[activeIdx] : null;
            root.classList.toggle('has-tip', !!c);
            tip.setAttribute('aria-hidden', String(!c));
            if (!c) return;
            tipCount.textContent = countText(c.count);
            tipDate.textContent = formats.tip.format(dayMs(c.date));
            tipW = tip.offsetWidth;
        }

        function countTotal() {
            const total = model.stats.total;
            if (reduced) {
                totalEl.textContent = fmt(total);
                return;
            }
            const started = performance.now();
            const length = settings.duration * 1.1;
            const step = (now) => {
                const p = Math.min(1, (now - started) / length);
                if (!totalEl.isConnected) return;
                totalEl.textContent = fmt(Math.round(total * easeInOutCubic(p)));
                if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        }

        function setView(next) {
            if (next === view) return;
            view = next;
            renderView();
            setTarget();
        }

        function setLegendLevel(level) {
            if (level === legendLevel) return;
            legendLevel = level;
            root.classList.toggle('is-isolating', level >= 0);
            swatches.forEach((swatch, k) => swatch.classList.toggle('is-isolated', k === level));
            kick();
        }

        toggleButtons.forEach((button) => button.addEventListener('click', () => {
            if (settings.scrub) {
                if (settings.onViewRequest) settings.onViewRequest(button.dataset.view);
                return;
            }
            setView(button.dataset.view);
        }));

        // ── Engine: one camera, one draw loop that sleeps when nothing moves ──

        const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
        let reduced = reduceMq.matches;

        // morph: t is linear time 0 (2D) → 1 (3D); the camera eases it, the bars wave it
        let t = 0;
        let target = 0;
        let entered = !!settings.scrub;
        // orbit offsets, eased toward their goals
        let yaw = 0;
        let elev = 0;
        let yawGoal = 0;
        let elevGoal = 0;
        // layout
        let W = 0;
        let H2 = 0;
        let H3 = 0;
        let Hmax = 0;
        let lastH = -1;
        let dpr = 1;
        let gutter = 30;
        let labelW = 30;
        let font = '600 11px sans-serif';
        let tipX = 0;
        let tipY = 0;
        // colours: [empty, l1, l2, l3, l4] × rgb, eased toward the goal
        const col = new Float32Array(15);
        const colGoal = new Float32Array(15);
        let colReady = false;
        let fg = FG_FALLBACK;
        let muted = MUTED_FALLBACK;
        // cells
        let n = 0;
        let weeks = 0;
        let wk = new Float32Array(0);
        let dy = new Float32Array(0);
        let lv = new Uint8Array(0);
        let hgt = new Float32Array(0);
        let zs = new Float32Array(0);
        let hover = new Float32Array(0);
        let dim = new Float32Array(0);
        let polys = new Float32Array(0);
        let faces = new Uint8Array(0);
        let order = [];
        let months = [];
        let weekdayRows = [];
        // interaction
        let hovered = -1;
        let pinned = -1;
        let activeIdx = -1;
        let tipW = 0;
        let raf = 0;
        let last = 0;

        function load() {
            n = model.cells.length;
            weeks = model.weeks;
            if (wk.length !== n) {
                wk = new Float32Array(n);
                dy = new Float32Array(n);
                lv = new Uint8Array(n);
                hgt = new Float32Array(n);
                zs = new Float32Array(n);
                hover = new Float32Array(n);
                dim = new Float32Array(n);
                polys = new Float32Array(n * 24);
                faces = new Uint8Array(n);
                order = Array.from({ length: n }, (_, i) => i);
            }
            for (let i = 0; i < n; i++) {
                const c = model.cells[i];
                wk[i] = c.week;
                dy[i] = c.day;
                lv[i] = c.level;
                hgt[i] = barHeight(c.count, model.max, settings.heightScale);
            }
            months = model.months;
            const wf = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' });
            weekdayRows = [];
            for (let d = 0; d < 7 && d < n; d++) {
                const ms = dayMs(model.cells[d].date);
                const dow = new Date(ms).getUTCDay();
                if (dow === 1 || dow === 3 || dow === 5) weekdayRows.push({ day: d, label: wf.format(ms) });
            }
            if (hovered >= n) hovered = -1;
            if (pinned >= n) pinned = -1;
        }

        function retheme() {
            const cs = getComputedStyle(root);
            const prop = (name) => cs.getPropertyValue(name).trim();
            fg = toRGB(prop('--sk-fg') || cs.color, FG_FALLBACK);
            muted = toRGB(prop('--sk-muted'), MUTED_FALLBACK);
            const bg = toRGB(prop('--sk-bg'), BG_FALLBACK);
            font = '600 11px ' + (cs.fontFamily || 'sans-serif');
            const empty = toRGB(prop('--sk-0'), [bg[0], bg[1], bg[2]]);
            const all = [empty];
            for (let k = 1; k <= 4; k++) all.push(toRGB(prop('--sk-' + k), luminance(bg) < 0.45 ? FG_FALLBACK : [0, 0, 0]));
            for (let k = 0; k < 5; k++) for (let ch = 0; ch < 3; ch++) colGoal[k * 3 + ch] = all[k][ch];
            if (!colReady || reduced) {
                col.set(colGoal);
                colReady = true;
            }
            ctx.font = font;
            labelW = Math.ceil(Math.max(20, ...weekdayRows.map((r) => ctx.measureText(r.label).width))) + 10;
            kick();
        }

        // Projected extent of the scene for camera e, with each bar at its height × e (full) or current z.
        function extent(cam, e, full) {
            const w = lerp(0.78, 0.9, e);
            const off = (1 - w) / 2;
            let minx = Infinity;
            let maxx = -Infinity;
            let miny = Infinity;
            let maxy = -Infinity;
            const add = (x, y, z) => {
                const p = project(cam, x, y, z);
                if (p[0] < minx) minx = p[0];
                if (p[0] > maxx) maxx = p[0];
                if (p[1] < miny) miny = p[1];
                if (p[1] > maxy) maxy = p[1];
            };
            for (let i = 0; i < n; i++) {
                const x0 = wk[i] + off;
                const y0 = dy[i] + off;
                const z = full ? hgt[i] * e : zs[i];
                add(x0, y0, z);
                add(x0 + w, y0, z);
                add(x0, y0 + w, z);
                add(x0 + w, y0 + w, 0);
                add(x0, y0 + w, 0);
                add(x0 + w, y0, 0);
            }
            // room for the month labels that run along the front edge in 3D
            add(0, 7 + 1.5 * e, 0);
            add(weeks, 7 + 1.5 * e, 0);
            return { minx, maxx, miny, maxy };
        }

        function relayout() {
            const w = Math.round(stage.clientWidth);
            if (!w || !n) return;
            W = w;
            // Narrow cards give the weekday column to the grid instead; rows get too tight to label.
            gutter = W < 520 ? 0 : labelW;
            dpr = Math.min(2, window.devicePixelRatio || 1);
            const b2 = extent(camera(0, 0, 0), 0, true);
            H2 = 20 + 4 + ((b2.maxy - b2.miny) / (b2.maxx - b2.minx)) * (W - gutter - 4);
            const b3 = extent(camera(1, 0, 0), 1, true);
            const natural = ((b3.maxy - b3.miny) / (b3.maxx - b3.minx)) * (W - 40) + 40;
            const ceiling = typeof settings.maxHeight === 'function' ? settings.maxHeight() : Infinity;
            H3 = Math.max(Math.min(natural, W * 0.66, 540, ceiling), Math.min(natural, 240));
            Hmax = Math.ceil(Math.max(H2, H3));
            canvas.width = Math.round(W * dpr);
            canvas.height = Math.round(Hmax * dpr);
            canvas.style.width = W + 'px';
            canvas.style.height = Hmax + 'px';
            tipX = stage.offsetLeft;
            tipY = stage.offsetTop;
            lastH = -1;
            const wide = W >= 560;
            root.style.setProperty('--stat-size', Math.round(Math.max(30, Math.min(54, W * 0.052))) + 'px');
            if (wide !== corners) {
                corners = wide;
                renderView();
            }
            draw();
        }

        function draw() {
            if (!W || !n) return;
            const e = easeInOutCubic(t);
            const cam = camera(e, yaw, elev);
            // Scrubbed, the stage keeps its 3D height so nothing around it moves while it rises.
            const Hc = settings.scrub ? H3 : lerp(H2, H3, e);
            if (Math.abs(Hc - lastH) > 0.2) {
                stage.style.height = Hc.toFixed(1) + 'px';
                lastH = Hc;
            }
            for (let i = 0; i < n; i++) zs[i] = riseAt(t, wk[i], weeks, dy[i]) * hgt[i];
            const b = extent(cam, e, false);
            const pad = lerp(2, 20, e);
            const left = pad + gutter * (1 - e);
            const top = pad + 20 * (1 - e);
            const aw = W - left - pad;
            const ah = Hc - top - pad;
            const bw = Math.max(1e-6, b.maxx - b.minx);
            const bh = Math.max(1e-6, b.maxy - b.miny);
            const s = Math.min(aw / bw, ah / bh);
            const ox = left + (aw - bw * s) / 2 - b.minx * s;
            const oy = top + (ah - bh * s) / 2 - b.miny * s;
            const { cs, sn, se, ce } = cam;
            const px = (x, y) => ox + (x * cs - y * sn) * s;
            const py = (x, y, z) => oy + ((x * sn + y * cs) * se - z * ce) * s;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, W, Hmax);

            order.sort((a, c) => (wk[a] + 0.5) * sn + (dy[a] + 0.5) * cs - ((wk[c] + 0.5) * sn + (dy[c] + 0.5) * cs));

            const w = lerp(0.78, 0.9, e);
            const off = (1 - w) / 2;
            const radius = lerp(0.17, 0.03, e) * s;
            const outline = (1 - e) * 0.07;
            const lift = 0.7 * e;
            const ex = col[0];
            const ey = col[1];
            const ez = col[2];

            for (let k = 0; k < n; k++) {
                const i = order[k];
                const x0 = wk[i] + off;
                const y0 = dy[i] + off;
                const x1 = x0 + w;
                const y1 = y0 + w;
                const z = zs[i] + hover[i] * lift;
                const o = i * 24;
                // top
                polys[o] = px(x0, y0); polys[o + 1] = py(x0, y0, z);
                polys[o + 2] = px(x1, y0); polys[o + 3] = py(x1, y0, z);
                polys[o + 4] = px(x1, y1); polys[o + 5] = py(x1, y1, z);
                polys[o + 6] = px(x0, y1); polys[o + 7] = py(x0, y1, z);
                // +y face (left on screen)
                polys[o + 8] = px(x0, y1); polys[o + 9] = py(x0, y1, 0);
                polys[o + 10] = px(x1, y1); polys[o + 11] = py(x1, y1, 0);
                polys[o + 12] = polys[o + 4]; polys[o + 13] = polys[o + 5];
                polys[o + 14] = polys[o + 6]; polys[o + 15] = polys[o + 7];
                // +x face (right on screen)
                polys[o + 16] = px(x1, y0); polys[o + 17] = py(x1, y0, 0);
                polys[o + 18] = polys[o + 10]; polys[o + 19] = polys[o + 11];
                polys[o + 20] = polys[o + 4]; polys[o + 21] = polys[o + 5];
                polys[o + 22] = polys[o + 2]; polys[o + 23] = polys[o + 3];

                const tall = z * ce * s;
                let f = 0;
                if (tall > 0.35 && w * cs * s > 0.35) f |= 1;
                if (tall > 0.35 && w * sn * s > 0.35) f |= 2;
                faces[i] = f;

                const L = lv[i] * 3;
                let r = col[L];
                let g = col[L + 1];
                let bl = col[L + 2];
                const d = dim[i];
                if (d > 0.002) {
                    r += (ex - r) * 0.72 * d;
                    g += (ey - g) * 0.72 * d;
                    bl += (ez - bl) * 0.72 * d;
                }
                const hv = hover[i];
                if (hv > 0.002) {
                    const m = 0.16 * hv;
                    r += (fg[0] - r) * m;
                    g += (fg[1] - g) * m;
                    bl += (fg[2] - bl) * m;
                }
                if (f & 1) {
                    ctx.beginPath();
                    quadPath(ctx, polys, o + 8, 0);
                    ctx.fillStyle = rgbString(r * 0.8, g * 0.8, bl * 0.8);
                    ctx.fill();
                }
                if (f & 2) {
                    ctx.beginPath();
                    quadPath(ctx, polys, o + 16, 0);
                    ctx.fillStyle = rgbString(r * 0.62, g * 0.62, bl * 0.62);
                    ctx.fill();
                }
                ctx.beginPath();
                quadPath(ctx, polys, o, radius);
                ctx.fillStyle = rgbString(r, g, bl);
                ctx.fill();
                if (outline > 0.004) {
                    ctx.strokeStyle = 'rgba(' + fg[0] + ',' + fg[1] + ',' + fg[2] + ',' + outline.toFixed(3) + ')';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
                if (hv > 0.02) {
                    ctx.strokeStyle = 'rgba(' + fg[0] + ',' + fg[1] + ',' + fg[2] + ',' + (0.85 * hv).toFixed(3) + ')';
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
            }

            // Labels: along the top and left in 2D, along the front edge in 3D. They fade, never pop.
            const ink = (a) => 'rgba(' + muted[0] + ',' + muted[1] + ',' + muted[2] + ',' + a.toFixed(3) + ')';
            ctx.font = font;
            const a2 = 1 - smoothstep(0, 0.4, e);
            const a3 = smoothstep(0.62, 1, e);
            if (a2 > 0.004) {
                ctx.fillStyle = ink(a2);
                ctx.textAlign = 'left';
                ctx.textBaseline = 'bottom';
                let edge = -Infinity;
                for (const m of months) {
                    const x = px(m.week + off, -0.3);
                    const tw = ctx.measureText(m.label).width;
                    if (x < edge || x + tw > W) continue;
                    ctx.fillText(m.label, x, py(m.week + off, -0.3, 0) - 3);
                    edge = x + tw + 6;
                }
                ctx.textAlign = 'right';
                ctx.textBaseline = 'middle';
                if (gutter > 0) for (const r of weekdayRows) ctx.fillText(r.label, px(0, r.day + 0.5) - 8, py(0, r.day + 0.5, 0));
            }
            if (a3 > 0.004) {
                ctx.fillStyle = ink(a3);
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                let edge = -Infinity;
                for (const m of months) {
                    const x = px(m.week + 0.5, 7.3);
                    const tw = ctx.measureText(m.label).width;
                    if (x < edge || x + tw > W) continue;
                    ctx.fillText(m.label, x, py(m.week + 0.5, 7.3, 0) + 2);
                    edge = x + tw + 10;
                }
            }

            // Tooltip rides the active cell through morphs and orbits.
            if (activeIdx >= 0 && activeIdx < n) {
                const i = activeIdx;
                const z = zs[i] + hover[i] * lift;
                const tx = px(wk[i] + 0.5, dy[i] + 0.5);
                const ty = Math.min(py(wk[i] + off, dy[i] + off, z), py(wk[i] + off + w, dy[i] + off, z), py(wk[i] + off, dy[i] + off + w, z));
                const half = tipW / 2;
                const cx = Math.min(W - half - 2, Math.max(half + 2, tx));
                tip.style.transform = 'translate(' + (tipX + cx - half).toFixed(1) + 'px,' + (tipY + ty - 10).toFixed(1) + 'px) translateY(-100%)';
                tip.style.setProperty('--arrow', (tx - cx + half).toFixed(1) + 'px');
            }
        }

        function tick(now) {
            raf = 0;
            const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
            last = now;
            let moving = false;

            if (!settings.scrub && t !== target) {
                const step = reduced ? 1 : (dt * 1000) / Math.max(1, settings.duration);
                t = target > t ? Math.min(target, t + step) : Math.max(target, t - step);
                moving = true;
            }

            const ko = reduced ? 1 : 1 - Math.exp(-dt * 12);
            yaw += (yawGoal - yaw) * ko;
            elev += (elevGoal - elev) * ko;
            if (Math.abs(yawGoal - yaw) > 1e-4 || Math.abs(elevGoal - elev) > 1e-4) moving = true;
            else {
                yaw = yawGoal;
                elev = elevGoal;
            }

            const kc = reduced ? 1 : 1 - Math.exp(-dt * 7);
            for (let k = 0; k < 15; k++) {
                const d = colGoal[k] - col[k];
                if (Math.abs(d) > 0.4) {
                    col[k] += d * kc;
                    moving = true;
                } else col[k] = colGoal[k];
            }

            const kh = reduced ? 1 : 1 - Math.exp(-dt * 16);
            const kd = reduced ? 1 : 1 - Math.exp(-dt * 10);
            for (let i = 0; i < n; i++) {
                const hg = i === activeIdx ? 1 : 0;
                const dg = legendLevel >= 0 && lv[i] !== legendLevel ? 1 : 0;
                const h = hover[i];
                const d = dim[i];
                if (h !== hg) {
                    hover[i] = Math.abs(hg - h) < 0.003 ? hg : h + (hg - h) * kh;
                    moving = true;
                }
                if (d !== dg) {
                    dim[i] = Math.abs(dg - d) < 0.003 ? dg : d + (dg - d) * kd;
                    moving = true;
                }
            }

            draw();
            if (moving) raf = requestAnimationFrame(tick);
        }

        function kick() {
            if (raf) return;
            last = performance.now();
            raf = requestAnimationFrame(tick);
        }

        // The active day is the hovered one, else the pinned one (tap, click or keyboard).
        function refreshActive() {
            const next = hovered >= 0 ? hovered : pinned;
            if (next === activeIdx) return;
            activeIdx = next;
            renderTip();
            kick();
        }

        function hit(x, y) {
            for (let k = n - 1; k >= 0; k--) {
                const i = order[k];
                const o = i * 24;
                if (pointInQuad(polys, o, x, y)) return i;
                if (faces[i] & 1 && pointInQuad(polys, o + 8, x, y)) return i;
                if (faces[i] & 2 && pointInQuad(polys, o + 16, x, y)) return i;
            }
            return -1;
        }

        const local = (ev) => {
            const r = canvas.getBoundingClientRect();
            return [ev.clientX - r.left, ev.clientY - r.top];
        };

        const grabCursor = () => (target === 1 ? 'grab' : 'default');
        let drag = null;

        function onDown(ev) {
            if (ev.button !== 0) return;
            const can = target === 1;
            drag = { id: ev.pointerId, x: ev.clientX, y: ev.clientY, yaw: yawGoal, elev: elevGoal, moved: false, orbit: can, mouse: ev.pointerType === 'mouse' };
            if (can) {
                try {
                    canvas.setPointerCapture(ev.pointerId);
                } catch (error) {
                    /* capture is a nicety */
                }
            }
        }

        function onMove(ev) {
            if (drag && drag.orbit && ev.pointerId === drag.id) {
                const dx = ev.clientX - drag.x;
                const dyy = ev.clientY - drag.y;
                if (drag.moved || Math.hypot(dx, dyy) > 4) {
                    drag.moved = true;
                    yawGoal = Math.min(YAW_RANGE[1] - YAW_3D, Math.max(YAW_RANGE[0] - YAW_3D, drag.yaw + dx * 0.006));
                    if (drag.mouse) elevGoal = Math.min(ELEV_RANGE[1] - ELEV_3D, Math.max(ELEV_RANGE[0] - ELEV_3D, drag.elev + dyy * 0.004));
                    canvas.style.cursor = 'grabbing';
                    hovered = -1;
                    refreshActive();
                    kick();
                    return;
                }
            }
            if (ev.pointerType !== 'mouse') return;
            const [x, y] = local(ev);
            const i = hit(x, y);
            if (i !== hovered) {
                hovered = i;
                refreshActive();
            }
            canvas.style.cursor = target === 1 ? 'grab' : i >= 0 ? 'pointer' : 'default';
        }

        function onUp(ev) {
            if (!drag || ev.pointerId !== drag.id) return;
            const wasMoved = drag.moved;
            drag = null;
            if (canvas.hasPointerCapture(ev.pointerId)) canvas.releasePointerCapture(ev.pointerId);
            canvas.style.cursor = grabCursor();
            if (wasMoved) return;
            const [x, y] = local(ev);
            const i = hit(x, y);
            pinned = i === pinned ? -1 : i;
            if (ev.pointerType !== 'mouse') hovered = -1;
            refreshActive();
        }

        function onCancel() {
            drag = null;
        }

        function onLeave() {
            if (drag) return;
            hovered = -1;
            refreshActive();
        }

        function onDbl() {
            yawGoal = 0;
            elevGoal = 0;
            kick();
        }

        function onKey(ev) {
            const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Escape'];
            if (!keys.includes(ev.key) || !n) return;
            ev.preventDefault();
            if (ev.key === 'Escape') {
                pinned = -1;
                hovered = -1;
                refreshActive();
                return;
            }
            let i = pinned >= 0 ? pinned : activeIdx >= 0 ? activeIdx : n - 1;
            if (pinned >= 0 || activeIdx >= 0) {
                if (ev.key === 'ArrowLeft') i -= 7;
                if (ev.key === 'ArrowRight') i += 7;
                if (ev.key === 'ArrowUp') i -= 1;
                if (ev.key === 'ArrowDown') i += 1;
                if (ev.key === 'Home') i = 0;
                if (ev.key === 'End') i = n - 1;
            }
            i = Math.max(0, Math.min(n - 1, i));
            pinned = i;
            hovered = -1;
            refreshActive();
            liveRegion.textContent = describe(i);
        }

        function onBlur() {
            pinned = -1;
            refreshActive();
        }

        function setTarget() {
            const goal = view === '3d' ? 1 : 0;
            if (!entered) return;
            if (goal !== target) {
                target = goal;
                if (goal === 0) {
                    yawGoal = 0;
                    elevGoal = 0;
                }
                root.classList.toggle('is-raised', target === 1);
                canvas.style.cursor = grabCursor();
                kick();
            }
        }

        buildFormats();
        buildModel();
        load();
        retheme();
        renderTexts();
        relayout();

        // The 3D view rises out of the flat one the first time it is seen.
        function enter() {
            if (entered) return;
            entered = true;
            if (reduced) t = view === '3d' ? 1 : 0;
            root.classList.add('is-entered');
            countTotal();
            setTarget();
        }
        let io = null;
        if (settings.scrub) {
            /* the page drives the rise */
        } else if ('IntersectionObserver' in window) {
            io = new IntersectionObserver((entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    enter();
                    io.disconnect();
                }
            }, { threshold: 0.35 });
            io.observe(stage);
        } else enter();

        const ro = new ResizeObserver(() => {
            if (Math.round(stage.clientWidth) !== W) relayout();
        });
        ro.observe(stage);
        let lastViewportH = window.innerHeight;
        const onViewport = () => {
            if (settings.maxHeight && window.innerHeight !== lastViewportH) {
                lastViewportH = window.innerHeight;
                relayout();
            }
        };
        window.addEventListener('resize', onViewport);

        const mo = new MutationObserver(retheme);
        mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
        const onReduce = () => {
            reduced = reduceMq.matches;
            kick();
        };
        reduceMq.addEventListener('change', onReduce);
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                retheme();
                relayout();
            });
        }

        canvas.addEventListener('pointerdown', onDown);
        canvas.addEventListener('pointermove', onMove);
        canvas.addEventListener('pointerup', onUp);
        canvas.addEventListener('pointercancel', onCancel);
        canvas.addEventListener('pointerleave', onLeave);
        canvas.addEventListener('dblclick', onDbl);
        canvas.addEventListener('keydown', onKey);
        canvas.addEventListener('blur', onBlur);

        return {
            /** Scrubbed mode: 0 is the flat heat map, 1 the risen skyline; anything between holds. */
            setProgress(value) {
                const next = Math.max(0, Math.min(1, value));
                if (Math.abs(next - scrubT) < 1e-4) return;
                const was3d = scrubT >= 0.5;
                scrubT = next;
                t = next;
                const raised = next > 0.95 ? 1 : 0;
                if (raised !== target) {
                    target = raised;
                    if (!raised) {
                        yawGoal = 0;
                        elevGoal = 0;
                    }
                    canvas.style.cursor = grabCursor();
                }
                root.style.setProperty('--corner', smoothstep(0.55, 0.9, next).toFixed(3));
                if ((next >= 0.5) !== was3d) renderView();
                kick();
            },
            /** Swap the copy and locale (language switch). */
            setLanguage(nextStrings, nextLocale) {
                strings = nextStrings;
                locale = nextLocale || locale;
                buildFormats();
                buildModel();
                load();
                retheme();
                renderTexts();
                relayout();
            },
            destroy() {
                if (raf) cancelAnimationFrame(raf);
                if (io) io.disconnect();
                ro.disconnect();
                mo.disconnect();
                window.removeEventListener('resize', onViewport);
                reduceMq.removeEventListener('change', onReduce);
                root.remove();
            }
        };
    }

    window.ContributionSkyline = { create };
})();
