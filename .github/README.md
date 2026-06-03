# nice-use-modal

[![npm version](https://badgen.net/npm/v/nice-use-modal)](https://www.npmjs.com/package/nice-use-modal)
[![npm downloads](https://badgen.net/npm/dt/nice-use-modal?label=downloads)](https://www.npmjs.com/package/nice-use-modal)
![license](https://badgen.net/npm/license/nice-use-modal)

A small, headless modal controller for React. Open a modal from a hook, pass it fully typed inputs, and decide whether closing should preserve or discard its local state.

[Live demo](https://nice-use-modal.cixiangtao.chatgpt.site) · [npm](https://www.npmjs.com/package/nice-use-modal) · [Changelog](../CHANGELOG.md)

```tsx
const confirmModal = useModal(ConfirmModal, {
  onConfirm: deleteProject,
});

confirmModal.show({ id: "project-1", title: "Delete this project?" });
```

## Why use it?

- **No owner-managed modal state** — call `show`, `hide`, and `destroy` instead of wiring `visible` and temporary data through the parent.
- **Still idiomatic React** — modals are rendered by `ModalProvider`, so they can consume your theme, locale, router, store, and other context.
- **Mounted only when needed** — a modal does not render before its first `show()` call.
- **State retention is explicit** — `hide()` keeps component state; `destroy()` unmounts the component and starts fresh next time.
- **Inputs stay type-safe** — TypeScript derives the arguments of `useModal()` and `show()` from the modal component.
- **Bring your own UI** — use Ant Design, MUI, Radix, a native dialog, or any component you already have.

Requires React 18 or 19.

## Install

```bash
pnpm add nice-use-modal
```

```bash
npm install nice-use-modal
```

```bash
yarn add nice-use-modal
```

## Quick start

### 1. Add the provider

Place `ModalProvider` above every component that calls `useModal`. Managed modals are rendered at the end of this provider, inside the same React tree.

```tsx
import { ModalProvider } from "nice-use-modal";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <ModalProvider>
    <App />
  </ModalProvider>,
);
```

### 2. Define a modal

Declare the modal's inputs in one definition:

- `data` is passed when the modal is shown.
- `props` is configured by the component that owns the hook.

`visible`, `hide`, and `destroy` are injected automatically.

```tsx
import type { ModalProps } from "nice-use-modal";

interface ConfirmModalDefinition {
  data: {
    id: string;
    title: string;
  };
  props: {
    onConfirm: (id: string) => void;
  };
}

export function ConfirmModal({
  data,
  props,
  visible,
  hide,
  destroy,
}: ModalProps<ConfirmModalDefinition>) {
  if (!visible) return null;

  return (
    <div aria-labelledby="confirm-modal-title" aria-modal="true" role="dialog">
      <h2 id="confirm-modal-title">{data.title}</h2>

      <button onClick={hide}>Cancel</button>
      <button
        onClick={() => {
          props.onConfirm(data.id);
          destroy();
        }}
      >
        Confirm
      </button>
    </div>
  );
}
```

### 3. Open it from a hook

TypeScript infers both arguments from `ConfirmModal`:

```tsx
import { useModal } from "nice-use-modal";

function DeleteProjectButton() {
  const confirmModal = useModal(ConfirmModal, {
    onConfirm: (id) => deleteProject(id),
  });

  return (
    <button
      onClick={() =>
        confirmModal.show({
          id: "project-1",
          title: "Delete this project?",
        })
      }
    >
      Delete project
    </button>
  );
}
```

There is no `visible` state or temporary project data in `DeleteProjectButton`. The component that defines the modal owns its UI state; the hook owner only supplies inputs and tells it when to open.

## Lifecycle

Each `useModal()` call owns one modal instance.

| Call | Mounted | Visible | Local component state |
| --- | --- | --- | --- |
| Before the first `show()` | No | No | Not created |
| `show(data?)` | Yes | Yes | Created on first show, otherwise preserved |
| `hide()` | Yes | No | Preserved |
| `destroy()` | No | No | Discarded |

Calling `show()` again updates the captured `data` and `props`, but it does not remount the modal. Reset local state in response to changed data when that is the desired behavior, or call `destroy()` before opening a completely fresh instance.

When the component that called `useModal()` unmounts, its modal is destroyed automatically. A delayed callback from an older render cannot hide or destroy a newer `show()` generation.

### Closing animations

Unmounting immediately can cut off a UI library's exit animation. Hide first, then destroy from the library's after-close callback:

```tsx
function EditModal({ visible, hide, destroy }: ModalProps<EditModalDefinition>) {
  return (
    <Modal
      open={visible}
      onCancel={hide}
      afterClose={destroy}
    >
      {/* ... */}
    </Modal>
  );
}
```

Omit `destroy` from `afterClose` when reopening should preserve the modal's draft state.

## Understanding `data` and `props`

Both values are snapshots captured by `show()`; they serve different call sites:

| Input | Passed to | Best suited for |
| --- | --- | --- |
| `data` | `controller.show(data)` | The record being viewed, edited, or confirmed |
| `props` | `useModal(Component, props)` | Callbacks and owner-level configuration |

Changing the `props` object in the hook owner does not update an already open modal. Call `show()` again to capture the latest `data` and `props`.

Required, optional, and absent fields produce matching function signatures:

```ts
type NoInputs = {};
// useModal(Component).show()

type RequiredData = { data: { id: string } };
// useModal(Component).show({ id: "1" })

type OptionalData = { data?: { id?: string } };
// useModal(Component).show()
// useModal(Component).show({ id: "1" })

type RequiredProps = { props: { onSave: () => void } };
// useModal(Component, { onSave }).show()

type OptionalProps = { props?: { closeOnSuccess?: boolean } };
// useModal(Component).show()
// useModal(Component, { closeOnSuccess: true }).show()

type DataAndProps = {
  data: { id: string };
  props: { onSave: (id: string) => void };
};
// useModal(Component, { onSave }).show({ id: "1" })
```

## API

### `useModal(component, props?)`

Creates a stable controller for one modal component.

- `show(data?)` lazily mounts the modal or shows it again with a new input snapshot.
- `hide()` sets `visible` to `false` without unmounting.
- `destroy()` unmounts the modal and removes its captured inputs.

`useModal` must be called below a `ModalProvider`.

### `ModalProps<Definition>`

The props received by a managed modal. It combines the `data` and `props` fields declared in `Definition` with these controls:

```ts
interface ModalControls {
  visible: boolean;
  hide: () => void;
  destroy: () => void;
}
```

### `ModalProvider`

Hosts managed modals and keeps modal updates out of their hook owners. Mount it once near the root of the context boundary your modals need to access.

### Type exports

The package also exports `ModalComponent`, `ModalControls`, `ModalDefinition`, `ModalFieldArguments`, `ModalProviderProps`, and `ModalResult` for wrappers and library integrations.

## Migrating from v2

Version 3 replaces the positional `ModalType<Data, Props>` API with a named definition object:

```ts
// v2
type EditModalType = ModalType<EditData, EditProps>;
type EditModalComponentProps = ModalProps<EditModalType>;

// v3
interface EditModalDefinition {
  data: EditData;
  props: EditProps;
}
type EditModalComponentProps = ModalProps<EditModalDefinition>;
```

Other changes in v3:

- Required definition fields now require matching arguments.
- Use `data?: Data` when `show()` without data should be valid.
- Use `props?: Props` when `useModal(Component)` without props should be valid.
- `ModalType` and `useModalContext` are no longer public APIs.
- A hook-owned modal is destroyed when its owner unmounts.

See the [changelog](../CHANGELOG.md) for the complete release history.

## Development

```bash
pnpm install
pnpm test
pnpm check
pnpm build
```

## License

MIT
