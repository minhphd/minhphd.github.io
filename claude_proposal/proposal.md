# A Traveler's Sky

A proposal for an interactive homepage section on `minhphd.github.io`.

**Author of spec:** Drafted for Minh Pham-Dinh
**Status:** Pre-build, awaiting approval
**Estimated build time:** 8–14 focused hours, dominated by silhouette art

---

## 1. One-paragraph summary

A single horizontal panel on the homepage shows a stylized evening scene: a real sky of real stars over the silhouette of a city Minh has lived in or traveled through. Five cities cycle via small dots; one personal sentence anchors each scene as a remembered moment rather than a planetarium demo. A toggle labelled `agent view` transforms the scene into the structured, labelled representation an embodied agent would build of it — a literal visual argument for the kind of grounded world models Minh's research is about. The piece is restrained, reads in 10 seconds, rewards a minute, and communicates three things at once: a person who travels, a person who looks up, a researcher whose work is about how machines come to understand places.

---

## 2. Why this, not something else

The homepage already does the academic work well: photo, advisor, institution, research statement, news, publications. What it doesn't do is *show*, in a single glance, that the author is a person with a perspective. The risk of adding interactivity to a researcher's site is the gimmick risk — that the cool thing competes with the content for attention and signals "undergrad" instead of "peer."

This piece is designed to avoid that. It works because:

- **It's content, not chrome.** The cities are real places Minh has been. The sentences are real memories. The constellations are computed from real ephemerides. There is nothing decorative that isn't also true.
- **The research tie-in is the toggle, not the frame.** Without `agent view` the piece is a quiet personal vignette. With it, the same scene becomes a one-shot lecture on grounded representation. A faculty reader who never clicks the toggle still gets a coherent piece; a faculty reader who *does* click it gets the thesis statement.
- **It's restrained on purpose.** One scene, one moment, one toggle. No 3D globe, no travel route lines, no photo gallery. Restraint is the cost of being taken seriously, and this piece pays it.

---

## 3. What the visitor sees and does

### 3.1 Default state

A panel sits between the bio and the News list. Above it, a small line of text:

> **Skies I've stood under**
> Five places, one moment in each, and the sky as it actually was.

The panel is roughly 2:1 horizontal (1200×600 at desktop, scales fluidly). It contains one image-like scene composed of three layered regions:

1. **Sky (top ~70%).** A deep navy gradient — `#0b1a2e` at top fading to `#1e3148` near the horizon. Not pure black; the goal is "an hour after sunset," not "outer space." Stars are placed at their real positions for the active city's latitude/longitude and the active timestamp. Bright stars are 2–3px and warm-tinted (`#fff4d6` for hot-white stars like Vega, slightly redder for Betelgeuse, etc.); faint stars are 0.5–1px and dimmer. A thin warm horizon glow — 4–6px of `#3a2a1e` to `#1e3148` gradient — runs along the boundary between sky and ground. This is the detail that sells "evening."

2. **Skyline silhouette (bottom ~30%).** A solid-fill SVG path in `#050a14` — darker than the sky, so it reads as foreground. Hand-authored per city. Not photographic; closer to a woodblock-print or a postage-stamp engraving. See §5 for the silhouette art direction.

3. **Foreground caption layer.** Two pieces of text float over the scene without backgrounds:
   - Top-left, monospace, 11px, low-opacity: `Hanoi · 21°02′N 105°51′E · 19:42 local · Nov 3, 2026`
   - Bottom-left, serif italic, 14px, slightly higher opacity: *"My grandmother's roof. The first sky I learned to find."*

### 3.2 Controls

Three controls, all unobtrusive:

- **City dots (bottom-right).** Five small circles in a row, 6px each, 12px gap. The active city is filled in warm white; the others are 1px outlines. On hover, a tooltip shows the city name. Clicking switches scenes.
- **Time scrubber (revealed on hover over the sky).** A 1px horizontal line appears across the lower third of the sky region, with a small handle at the current time. Drag left/right to scrub through the night from sunset to sunrise. The stars rotate accurately as the handle moves. Releasing the handle leaves the time where it was; the scene doesn't snap back.
- **Agent view toggle (top-right).** A small pill-shaped control that says `agent view` with a tiny dot indicator. Click toggles between the personal scene and the structured-representation scene (§3.4).

### 3.3 Idle behavior

If no one interacts for 5 seconds, the stars begin a slow rotation around the celestial pole at one full rotation per real-world hour. Imperceptible at first glance, visible if you watch for 30 seconds. This is the heartbeat — it tells the visitor the panel is alive without demanding their attention.

A single shooting star streaks across the sky every 18–25 seconds (randomized within that window). 1.2-second arc, faint, never the same path twice.

### 3.4 The `agent view` transition

This is the most important interaction in the piece. When toggled on, over 1200ms:

**Phase 1 (0–400ms): the silhouette wireframes.** The solid silhouette dissolves into its constituent SVG strokes, now visible as a wireframe in `#4a8fc7`. Each labeled feature gets a small floating label in monospace 10px, tethered to the feature with a 1px line:
- `[building: tower, h≈262m]` near the Lotte tower in Hanoi
- `[bridge: truss, l≈2400m]` near Long Biên
- `[ground_plane]` along the horizon
- `[ridge: mountain, dist≈3km]` for Salt Lake City's Wasatch front

**Phase 2 (300–800ms, overlapping):** the stars become labelled nodes. The brightest ~20 stars in view get name labels (`Vega`, `Altair`, `Deneb`, etc.). Thin 0.5px lines connect stars in the same constellation, brightening the constellation graph that was previously almost invisible. A small parenthetical appears under each star label: `(mag 0.03)`.

**Phase 3 (700–1200ms):** a panel slides in from the right edge, 280px wide, showing the scene graph as an indented tree:

```
Scene
├── Ground
│   ├── Skyline
│   │   ├── tower (Lotte, h≈262m)
│   │   ├── bridge (Long Biên, truss)
│   │   └── ridge (Wasatch, dist≈3km)
│   └── ground_plane
└── Sky
    ├── Constellations
    │   ├── Lyra
    │   │   ├── Vega
    │   │   ├── Sheliak
    │   │   └── Sulafat
    │   └── Cygnus → {Deneb, Sadr, ...}
    ├── Planets (visible)
    │   └── Jupiter (alt 34°, az 142°)
    └── moon_phase: waxing_gibbous (0.78)
```

The bottom-left caption swaps from the personal sentence to a research caption:

> *What an embodied agent grounds when it looks at this scene.
> My research is about making this representation faithful enough to plan from.*

Toggling off reverses the animation in 800ms — the scene graph slides out, the labels fade, the wireframe fills back in, the personal sentence returns.

---

## 4. The five cities

Placeholders Minh can swap or rename. Each needs three things: a silhouette SVG, a personal sentence, and lat/lon for star math.

| # | Placeholder city | Lat / Lon | Silhouette anchors | Caption draft |
|---|---|---|---|---|
| 1 | Hanoi, Vietnam | 21.03°N 105.85°E | Lotte tower, Long Biên bridge, low rooflines | *"My grandmother's roof. The first sky I learned to find."* |
| 2 | Waterville, ME | 44.55°N 69.63°W | Colby's library tower, low pines, river bend | *"Four years of walking back from the lab at 2 a.m."* |
| 3 | Salt Lake City, UT | 40.76°N 111.89°W | Wasatch range, downtown low-rise | *"The valley I'm moving to. I haven't seen this sky yet."* |
| 4 | (open slot) | — | — | — |
| 5 | (open slot) | — | — | — |

Two slots intentionally left open. Suggestions for what the open slots should *do*: one should be somewhere far (a sky from a different hemisphere, so the constellations look obviously different — Sydney, Cape Town, Buenos Aires); one should be somewhere personal that isn't on the academic CV (a hometown street, a family village, a place from a single trip that mattered).

---

## 5. Art direction for the silhouettes

This is the part that makes or breaks the piece. Generic silhouettes — clip-art skylines from a stock library — would sink it. Specifications:

- **Style:** woodblock print / 1920s travel-poster engraving. Solid fill, no gradients, no detail inside the silhouette. Each silhouette should be recognizable to someone who's been there and slightly mysterious to someone who hasn't.
- **Composition:** the silhouette occupies the bottom 30% of the panel. The most identifying landmark sits at roughly 1/3 or 2/3 across (rule of thirds), not centered. There is intentional negative space — gaps between buildings, valleys in mountain ridges — for stars to peek through.
- **Authorship:** these should be hand-drawn (in Figma, Illustrator, or even Inkscape) over reference photos, then exported as optimized SVG paths. Do not use auto-tracing tools on photos; they produce uncanny results. Budget: 60–90 minutes per silhouette done well.
- **File format:** single SVG `<path>` per city, ~2–4KB each. Stored inline in the JS bundle, not as separate file requests.

If Minh doesn't want to draw them, a freelance illustrator on the order of $40–80/silhouette would be a defensible expense for a piece that lives on the front page for years.

---

## 6. Technical architecture

### 6.1 Stack

- **Vanilla SVG + JS, no framework.** The site is currently a static Jekyll/MD-based academic template; adding React for one component would bloat the page. The piece is small enough to live in one self-contained `<script type="module">` with one `<svg>` root.
- **One library: `astronomy-engine`.** ~50KB minified, MIT-licensed, gives accurate star positions, planet positions, moon phases for any time and place. Pure JS, no WASM, works offline. https://github.com/cosinekitty/astronomy
- **No external API calls at runtime.** All data is computed client-side. No telemetry, no analytics on this component.

### 6.2 File layout

A single drop-in section. Everything Minh needs lives in one place:

```
_includes/
  travelers-sky.html       # the section markup, dropped into homepage
assets/
  js/
    travelers-sky.js       # ~600–900 lines, bundled with astronomy-engine
  css/
    travelers-sky.css      # ~150 lines, scoped under .travelers-sky
  data/
    cities.js              # the five city objects: name, coords, silhouette path, caption
```

The homepage `index.md` adds one line: `{% raw %}{% include travelers-sky.html %}{% endraw %}` between the bio block and the News list.

### 6.3 Star rendering

Two passes. On scene load:

1. Query `astronomy-engine` for all stars in the Yale Bright Star Catalog (~9,000 stars, magnitude < 6.5) above the horizon at the active location and time.
2. Project each (azimuth, altitude) onto the panel using a stereographic projection centered on the zenith. Filter to stars whose projected position falls within the sky region.
3. Render each as an SVG `<circle>` with radius and color computed from magnitude and B-V color index.

On time-scrub or city-change, recompute positions and animate `cx`/`cy` with CSS transforms over 600ms (city change) or follow the scrubber in real-time (time scrub). No re-rendering of the DOM nodes — same circles, new positions.

### 6.4 Silhouette morphing

Use `flubber` (3KB) for path interpolation between city silhouettes. Pre-compute interpolators between each pair of adjacent cities at load time (10 interpolators total for 5 cities). Animate over 800ms with `cubic-bezier(0.4, 0, 0.2, 1)` easing.

### 6.5 Agent-view rendering

The transformation is not a separate scene — it's the same SVG with additional layers fading in:

- A `<g class="wireframe">` group containing stroked versions of the silhouette paths, hidden by default, fades in.
- A `<g class="labels">` group with `<text>` and `<line>` connectors for each labeled feature, hidden by default, fades in with staggered delays (40ms between labels).
- A separate `<aside class="scene-graph">` HTML element slides in via CSS transform.

The original solid silhouette fades to 0 opacity; the wireframe fades to 1. Reversing is just running the same animation backwards.

### 6.6 Performance budget

- Total JS: ≤ 80KB gzipped (astronomy-engine ≈ 50KB, flubber ≈ 3KB, our code ≈ 15–25KB).
- Total CSS: ≤ 4KB.
- First render: ≤ 200ms after scripts load.
- Interactive (time scrub) at 60fps on a 2019 laptop and 30fps on a mid-tier phone.
- No layout shift after load; the panel reserves its height immediately.

### 6.7 Accessibility

- The panel has `role="img"` with an `aria-label` describing the current scene: "Evening sky over Hanoi, November 3 2026, with the Lotte Tower and Long Biên bridge silhouetted against stars."
- Time scrubber has `role="slider"`, keyboard arrow-key support, and `aria-valuenow` updates.
- City dots are `<button>`s with `aria-label`.
- Agent view toggle is a `<button>` with `aria-pressed`.
- All decorative animations honor `prefers-reduced-motion: reduce` — idle rotation stops, transitions become instant cuts, the shooting star is suppressed.
- The personal caption and research caption are both available to screen readers regardless of agent-view state (the visually-hidden one is in an `aria-live` region that announces when toggled).
- Color contrast: caption text against sky meets WCAG AA at 14px.

### 6.8 Mobile

At viewport widths below 720px:

- The panel becomes 4:3 instead of 2:1.
- The time scrubber becomes a single tap-to-advance button (advances by 1 hour per tap) rather than a drag interaction; drag is unreliable on touch over a sky full of tap targets.
- The scene-graph aside, when agent-view is on, slides in from the bottom as a 40%-height drawer instead of a side panel.
- Idle rotation is disabled to save battery.

---

## 7. Visual style — fitting the existing site

The current site is clean, light, academic. This panel must not feel grafted on. Choices that keep it native:

- **Typography:** the panel uses the site's existing body font for the personal caption (whatever the Jekyll template defaults to). The monospace location/time strip uses `JetBrains Mono` or the site's existing mono if one is set. The scene-graph tree uses the same mono. No new font families introduced.
- **Color:** the panel itself is dark, but it's bordered with the site's existing 1px hairline rule and surrounded by the site's existing background — so the dark scene reads as *a window*, not as *a theme change*. The same way a photograph on a white page doesn't make the page feel like a photograph.
- **Width:** matches the existing content column; doesn't break the page's vertical rhythm.
- **No introductory animation on page load.** The panel renders instantly in its default state (Hanoi, 19:42, agent view off). No build-up, no fade-in of stars one by one. The site is academic; the section earns interest by being interesting, not by performing.

---

## 8. Copy — every word in the piece

Worth specifying so it doesn't drift during the build. Total written content:

- Section heading: **Skies I've stood under**
- Section dek: *Five places, one moment in each, and the sky as it actually was.*
- Five city captions (see §4)
- Agent-view caption: *What an embodied agent grounds when it looks at this scene. My research is about making this representation faithful enough to plan from.*
- Tooltip on agent-view toggle when off: `show how a robot would see this`
- Tooltip on agent-view toggle when on: `back to the view from the ground`

That's it. No further explanatory copy. The piece either communicates or it doesn't; arguing for itself in prose would be a tell.

---

## 9. What could go wrong, and what to do about it

**Risk: the silhouettes look generic.** Most likely failure mode. Mitigation: hand-draw them with care, or commission them. If after a first draft they don't make Minh feel something specific about each city, redo them. Don't ship until they do.

**Risk: the agent-view transition feels gimmicky instead of illuminating.** Mitigation: the labels must be *real* — actual landmark heights, actual star magnitudes, an actual scene graph that a real planner could consume. If the labels are decorative, viewers will smell it. Pull data from real sources (Wikipedia heights, Hipparcos catalog magnitudes) and cite them in a `data:` attribute or a small footnote.

**Risk: the piece is beautiful but no one notices it's about world models.** Mitigation: the agent-view caption does the explaining in one sentence. If user-testing (showing to 3–5 friends who don't know the research) reveals the connection isn't landing, the caption can be expanded to two sentences. Don't expand prophylactically.

**Risk: it doesn't work on someone's phone and they bounce.** Mitigation: the mobile fallback (§6.8) is real, and worth testing on a genuinely old phone (an iPhone 8 or equivalent) before shipping. If it can't run there, ship a static rendered-image fallback for narrow viewports.

**Risk: it ages badly because the field moves on from "world models."** Mitigation: the personal-vignette layer ages fine on its own. If in five years the research framing feels dated, the agent-view toggle can be removed without rebuilding the rest. The piece is designed to gracefully decay into a non-research version.

---

## 10. Build sequence

A suggested order, with checkpoints to abandon at if something feels wrong:

1. **Silhouettes first (3–6 hours).** Draw all five. Show them to one person who's been to each city. If the silhouettes don't work, nothing else matters.
2. **Static scene (2 hours).** One city, one timestamp, real stars, real silhouette, captions. No interactivity. *Checkpoint: does this single static scene already feel like something worth having on the homepage? If no, the whole piece is not going to save it.*
3. **City switching + time scrub (2–3 hours).** Add the five-city carousel, the morphing transition, the time scrubber.
4. **Agent view (2–3 hours).** Build the wireframe layer, the labels, the scene-graph aside, the transition.
5. **Polish + accessibility + mobile (1–2 hours).** The reduced-motion path, the mobile drawer, the ARIA labels, the keyboard controls, the shooting star, the idle rotation.
6. **Ship behind a feature flag (15 minutes).** Add it to the homepage, but also keep a `?no-sky` query param that hides it, so Minh can A/B with himself for a week before committing.

Total: 10–16 hours of focused work. Don't compress.

---

## 11. Open questions for Minh

Before build:

1. **Two open city slots** (§4): which two cities, and one personal sentence each.
2. **Silhouette authorship:** draw them, commission them, or have me generate first-pass SVGs you'd then refine?
3. **Scene-graph contents:** do you want the agent-view scene graph to reflect the actual representation DAVIS builds (i.e., faithful to your paper) or a generic embodied-agent representation? Faithful is more honest but requires you to spec the schema; generic is easier and still makes the point.
4. **Where exactly on the homepage:** between bio and News (recommended), or somewhere else?

After build, before ship:

5. Does the piece survive the "show it to three friends who don't know the research" test? If not, what gets cut.

---

## 12. What this proposal is not committing to

- A 3D globe.
- A travel-route map.
- A photo gallery.
- A blog or "field notes" section.
- The dark "ARES-V Mission Control" aesthetic from the secondary site mockup.
- Any change to the rest of the homepage.

These were considered and deliberately set aside. Each can be revisited as a separate proposal if the Sky lands well.