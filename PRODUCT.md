# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

React developers evaluating a modal controller for a new or existing application. On the public demo page, they need to understand the package's behavior quickly enough to decide whether it fits their project.

## Product Purpose

`nice-use-modal` is a headless, type-safe React modal controller. It lets an owner open a modal imperatively while keeping rendering, context, lifecycle, and local component state inside React.

## Positioning

The API separates runtime data and modal visibility from component ownership: `show(data)` opens with fresh runtime data, `hide()` preserves the mounted component and its draft state, and `destroy()` unmounts it explicitly.

## Operating Context

Developers evaluate the package through its public demo, installation command, interactive modal example, lifecycle behavior, and a small TypeScript usage sample before moving to npm or GitHub for deeper documentation.

## Capabilities and Constraints

- React 18 and 19 peer support.
- Headless implementation with no bundled modal UI.
- `ModalProvider` supplies the rendering context.
- `useModal(component, props?)` captures stable owner props.
- `show(data)`, `hide()`, and `destroy()` expose the lifecycle deliberately.
- Existing package behavior and public API semantics must remain unchanged during the page redesign.

## Brand Commitments

- Preserve the product name `nice-use-modal`.
- Use concise, developer-facing language grounded in real API behavior.
- Do not invent customer, adoption, performance, or benchmark claims.

## Evidence on Hand

- The working interactive demo in `src/App.tsx` and `src/MyModal.tsx`.
- Runtime and type-contract tests under `packages/useModal/`.
- Package metadata and installation contract in `package.json`.
- Public npm and GitHub destinations already linked by the demo.

## Product Principles

- Prove lifecycle behavior through interaction instead of repeating claims.
- Make visibility, mounted state, and preserved draft state distinguishable at a glance.
- Let a first-time visitor reach a working example before deeper documentation.
- Keep the public API example small, truthful, and copyable.

## Accessibility & Inclusion

Preserve keyboard focus, Escape-to-close behavior, visible focus styles, dialog semantics, reduced-motion support, readable contrast, and a complete mobile layout.
