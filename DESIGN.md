---
name: nice-use-modal
description: A cool-paper lifecycle inspector for type-safe React modal control.
colors:
  cobalt: "#0a4bdf"
  cobalt-deep: "#0738a5"
  cobalt-wash: "#dce8ff"
  preservation-amber: "#b65f00"
  preservation-wash: "#fff0d5"
  navy-ink: "#0b1b31"
  muted-telemetry: "#53657b"
  measurement-line: "#c7d0dc"
  measurement-line-strong: "#91a2b7"
  instrument-paper: "#f6f8fb"
  cool-workbench: "#eff3f7"
  optic-white: "#ffffff"
typography:
  display:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(58px, 4.35vw, 68px)"
    fontWeight: 650
    lineHeight: 0.92
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(51px, 6vw, 88px)"
    fontWeight: 630
    lineHeight: 0.94
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(31px, 3vw, 44px)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Public Sans, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  action:
    fontFamily: "Public Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1
  telemetry:
    fontFamily: "Spline Sans Mono, monospace"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  field: "8px"
  compact: "9px"
  control: "10px"
  panel: "12px"
  card: "14px"
  modal: "16px"
  circle: "50%"
spacing:
  xs: "8px"
  sm: "12px"
  md: "18px"
  lg: "24px"
  xl: "30px"
  2xl: "48px"
  section: "clamp(76px, 8vw, 128px)"
components:
  button-primary:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.optic-white}"
    typography: "{typography.action}"
    rounded: "{rounded.panel}"
    padding: "0 20px"
    height: "50px"
  button-primary-hover:
    backgroundColor: "{colors.cobalt-deep}"
    textColor: "{colors.optic-white}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.navy-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.panel}"
    padding: "0 20px"
    height: "50px"
  button-controller:
    backgroundColor: "{colors.optic-white}"
    textColor: "{colors.navy-ink}"
    typography: "{typography.telemetry}"
    rounded: "{rounded.field}"
    padding: "0 11px"
    height: "32px"
  install-control:
    backgroundColor: "{colors.optic-white}"
    textColor: "{colors.navy-ink}"
    typography: "{typography.telemetry}"
    rounded: "{rounded.panel}"
    padding: "17px 18px"
  text-field:
    backgroundColor: "#f8fafc"
    textColor: "{colors.navy-ink}"
    rounded: "{rounded.compact}"
    padding: "0 14px"
    height: "50px"
  preservation-hint:
    backgroundColor: "{colors.preservation-wash}"
    textColor: "#65400f"
    rounded: "{rounded.control}"
    padding: "15px"
  inspector-panel:
    backgroundColor: "{colors.optic-white}"
    textColor: "{colors.navy-ink}"
    rounded: "{rounded.modal}"
---

# Design System: nice-use-modal

## Overview

**Creative North Star: "Lifecycle Inspector"**

The interface behaves like a precise runtime instrument rather than a generic decorative library landing page. Cool technical paper, measurement rules, and live telemetry make modal ownership visible; large condensed statements keep the product offer immediate and persuasive.

The world is bright, controlled, and evidence-led. Cobalt marks actions and visible runtime state, amber marks state that has been deliberately preserved, and navy anchors both editorial copy and code surfaces. Rounded controls soften the instrument language without turning it playful or ornamental.

**Key Characteristics:**

- An inspector-dominant workbench that proves behavior before asking for installation.
- Three distinct typographic voices for persuasion, reading, and telemetry.
- Thin rules, gridded stages, status dots, and event traces as functional visual structure.
- Cobalt for active control; amber only for preserved lifecycle state.
- Responsive reflow that preserves the proof sequence on narrow screens.

## Colors

The palette combines cool instrument paper with deep navy legibility, decisive cobalt controls, and a single amber lifecycle signal.

### Primary

- **Precision Cobalt** (`#0a4bdf`): Primary actions, active controls, visible-state indicators, selection, and branded geometry.
- **Deep Control Cobalt** (`#0738a5`): Hover states, emphasized code labels, and stronger interactive contrast.
- **Cobalt Wash** (`#dce8ff`): Quiet hover fills and the offset shadow on the instrument mark.

### Secondary

- **Preservation Amber** (`#b65f00`): Hidden-but-mounted state, preserved drafts, and the middle lifecycle step.
- **Preservation Wash** (`#fff0d5`): Explanatory hint surfaces associated with retained local state.

### Neutral

- **Navy Ink** (`#0b1b31`): Primary text, code content, and the modal's structural anchor.
- **Muted Telemetry** (`#53657b`): Supporting copy, labels, descriptions, and inactive readings.
- **Instrument Paper** (`#edf1f4`): Main page surface and lifecycle section.
- **Cool Workbench** (`#e5ebf1`): Hero copy field and specimen-stage substrate.
- **Optic White** (`#fbfdff`): Cards, dialogs, controls, header, and footer surfaces.
- **Measurement Rule** (`#bdc8d6`): Default dividers, rows, and panel seams.
- **Strong Gauge** (`#8fa0b5`): Input strokes, outer instrument borders, and dominant axes.

### Named Rules

**The Proof Color Rule.** Cobalt means active or visible; amber means hidden but preserved. Never use amber as general decoration or as a second call-to-action color.

## Typography

**Display Font:** Barlow Condensed (with sans-serif fallback)
**Body Font:** Public Sans (with sans-serif fallback)
**Label/Mono Font:** Spline Sans Mono (with monospace fallback)

**Character:** Barlow Condensed gives the product offer the scale and decisiveness of an instrument label. Public Sans keeps explanations calm and readable, while Spline Sans Mono makes runtime facts, API calls, and measurements feel operational.

### Hierarchy

- **Display** (650, `clamp(58px, 4.35vw, 68px)`, 0.92): Two-line desktop hero offer; tightly tracked and allowed to reflow on mobile.
- **Headline** (630, `clamp(51px, 6vw, 88px)`, 0.94): Lifecycle and closing statements.
- **Title** (600, `clamp(31px, 3vw, 44px)`, 1): Workbench and lifecycle-card headings.
- **Body** (400, `16px`, 1.65): Explanations and supporting product copy, generally constrained to 40–64 characters per line.
- **Action** (700, `14px`, 1): Primary and secondary actions.
- **Telemetry** (500, `9–12px`, 1.5): API calls, states, rulers, trace values, and uppercase instrument labels.

### Named Rules

**The Three-Voice Rule.** Use condensed type for promises, Public Sans for explanations, and monospace only for code, state, or measurement; do not interchange their jobs.

## Layout

The page lives inside a centered `1680px` maximum shell with hairline borders at its edges. At desktop widths, the header and first workbench share the approved A1 `34% / 66%` axis: the left side carries the two-line offer and installation path, while the larger right side holds the modal specimen, telemetry rail, and controller. The hero occupies roughly `552px` below the `74px` header so the event trace and code proof begin near `y=626` in a `1440 × 1000` viewport. Inside the inspector, the specimen remains flexible and dominant while telemetry holds a compact `220–244px` rail.

Spacing is generous at the narrative level and compact inside instruments. Major sections use `clamp(76px, 8vw, 128px)` vertical padding; panels typically use `24–60px`; controls use `8–18px` gaps and insets. One-pixel rules organize the composition into measurable fields instead of detached card grids.

At `1180px`, the workbench tightens while preserving the split. At `960px`, hero and proof workbenches become single columns and navigation is reduced. At `700px`, the offer, specimen, telemetry, trace, and code follow one reading column; the controller becomes a three-column strip, lifecycle steps become a vertical rail, the dialog docks toward the bottom, and nonessential secondary actions recede. The page must never introduce horizontal overflow.

## Elevation & Depth

The system is flat by default and uses borders, tonal fields, and grid lines for most hierarchy. Shadows are reserved for the modal specimen, live dialog, and tiny state lights where physical separation communicates runtime layering.

### Shadow Vocabulary

- **Instrument Offset** (`4px 4px 0 #dce8ff`): Graphic offset behind the toolbar's cobalt instrument mark.
- **Specimen Lift** (`10px 14px 34px rgb(11 27 49 / 16%)`): Separates the staged modal preview from the ruled workbench.
- **Dialog Lift** (`14px 20px 50px rgb(5 19 38 / 28%)`): The strongest elevation, reserved for the actual modal above its blurred scrim.
- **Status Glow** (`0 2px 6px rgb(10 75 223 / 28%)` or amber equivalent): Small state confirmation around live dots only.

### Named Rules

**The Earned Elevation Rule.** A surface receives a shadow only when it is demonstrably above another runtime layer; ordinary page sections remain divided by rules and tonal contrast.

## Shapes

The form language pairs rectilinear measurement structure with restrained soft corners. Fields and compact controls use `8–10px` radii, actions and code panels use `12px`, specimen cards use `14px`, and major inspector or dialog containers use `16px`. One-pixel strokes stay visible on every light control. Circles are reserved for status dots and numbered lifecycle nodes; pill-shaped marketing badges are not part of this system.

## Components

### Buttons

- **Shape:** Rectangular with controlled soft corners (`8px` for lifecycle controls, `10–12px` for primary actions).
- **Primary:** Precision Cobalt on Optic White, at least `50px` high with `0 20px` padding and 700-weight action type.
- **Hover / Focus:** Deep Control Cobalt plus a subtle `translateY(-2px)` on large primary actions; all controls receive the shared `3px solid #ffb13b` focus outline with `3px` offset.
- **Secondary:** Transparent with a Strong Gauge border and Navy Ink text; hover uses an Optic White or Cobalt Wash field.
- **Disabled:** Lifecycle controls remain structurally present at `0.38` opacity with a not-allowed cursor.

### Cards / Containers

- **Corner Style:** `12–16px` depending on hierarchy.
- **Background:** Optic White for foreground tools; Instrument Paper or Cool Workbench for containing fields.
- **Shadow Strategy:** Flat for ordinary content; Specimen Lift only for staged modal previews.
- **Border:** One-pixel Measurement Rule or Strong Gauge on every instrument boundary.
- **Internal Padding:** Responsive `24–60px`; tighter telemetry fields use `18–24px`.

### Inputs / Fields

- **Style:** Near-white fill (`#f8fafc`), Strong Gauge border, `8–9px` radius, and `46–50px` minimum height.
- **Focus:** Border shifts to Precision Cobalt and the shared amber focus outline remains visible.
- **Labels:** Public Sans at `12px` and 650–700 weight; runtime values may switch to monospace.

### Navigation

- **Style:** A compact three-column header with cobalt wordmark, centered `13px` links, and a right-aligned GitHub action.
- **State:** Links move from dark blue-gray to Precision Cobalt over `160ms ease`; keyboard focus uses the global amber outline.
- **Mobile:** Hide the center navigation below `960px`; preserve the wordmark and icon-level GitHub action.

### Lifecycle Inspector

The signature component combines a ruled specimen stage, a white modal preview, a telemetry rail, and an adjacent controller strip. State changes alter real readings: visible uses cobalt, hidden/preserved uses amber, and destroyed uses muted gray plus reduced specimen saturation and scale. The component boots once with a `720ms cubic-bezier(0.16, 1, 0.3, 1)` reveal and respects reduced-motion preferences.

### Preservation Hint

Use the amber-wash hint only beside behavior that retains mounted state. It pairs an uppercase monospace cue with concise Public Sans guidance and never substitutes for an error or warning.

## Do's and Don'ts

### Do:

- **Do** lead with a working lifecycle proof before installation or documentation links.
- **Do** keep specimen, telemetry, controls, and event trace bound to the same real state.
- **Do** use one-pixel rules, cool paper fields, and exact alignment to create instrument structure.
- **Do** preserve keyboard focus, dialog semantics, Escape behavior, and reduced-motion fallbacks.
- **Do** stack the proof in reading order on mobile: offer, specimen, telemetry, controls, trace, then code.

### Don't:

- **Don't** turn the page into a generic feature-card grid or a decorative developer landing page.
- **Don't** use amber for arbitrary emphasis; it is reserved for hidden-but-preserved state.
- **Don't** add unverified performance, adoption, customer, or benchmark claims.
- **Don't** add gratuitous gradients, glass panels, pill badges, or shadows to ordinary sections.
- **Don't** blur the difference between `hide()` and `destroy()` in copy, color, or interaction.
