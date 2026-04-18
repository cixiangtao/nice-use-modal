# nice-use-modal

[![npm version](https://badgen.net/npm/v/nice-use-modal)](https://www.npmjs.com/package/nice-use-modal)
[![npm downloads](https://badgen.net/npm/dt/nice-use-modal?label=downloads)](https://www.npmjs.com/package/nice-use-modal)
![license](https://badgen.net/npm/license/nice-use-modal)

An imperative, type-safe modal controller for React. Open any modal from a hook, keep it inside your React tree, and choose whether closing should preserve or discard its state.

[Live demo](https://nice-use-modal.cixiangtao.chatgpt.site) · [npm](https://www.npmjs.com/package/nice-use-modal) · [GitHub](https://github.com/cixiangtao/nice-use-modal)

## Why nice-use-modal?

- **Imperative control** — call `show`, `hide`, or `destroy` without managing `visible` state in the owner.
- **React context stays available** — modals render below `ModalProvider`, so theme, locale, router, and application context keep working.
- **Lazy mounting** — a modal is not mounted until its first `show` call.
- **Explicit lifecycle** — `hide` preserves local state; `destroy` unmounts the component.
- **Precise TypeScript inference** — required and optional `data` and `props` fields produce matching call signatures.
- **UI-library agnostic** — use it with Ant Design, MUI, Radix, a native dialog, or your own components.
- **React 18 and 19 ready** — React is a peer dependency and is never bundled.

## Installation

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

Mount one provider above every component that uses `useModal`:

```tsx
import { ModalProvider } from "nice-use-modal";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <ModalProvider>
    <App />
  </ModalProvider>,
);
```

Describe the values passed when the modal is shown as `data`, and the values configured by its owner as `props`:

```tsx
import { ModalProps, useModal } from "nice-use-modal";

interface ConfirmModalDefinition {
  data: {
    title: string;
    description?: string;
  };
  props: {
    onConfirm: () => void;
  };
}

function ConfirmModal({
  data,
  props,
  visible,
  hide,
  destroy,
}: ModalProps<ConfirmModalDefinition>) {
  if (!visible) return null;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <h2 id="confirm-title">{data.title}</h2>
      {data.description && <p>{data.description}</p>}

      <button onClick={hide}>Cancel</button>
      <button
        onClick={() => {
          props.onConfirm();
          destroy();
        }}
      >
        Confirm
      </button>
    </div>
  );
}

function DeleteButton() {
  const confirm = useModal(ConfirmModal, {
    onConfirm: () => console.log("Deleted"),
  });

  return (
    <button
      onClick={() =>
        confirm.show({
          title: "Delete project?",
          description: "This action cannot be undone.",
        })
      }
    >
      Delete project
    </button>
  );
}
```

For components with a close animation, hide first and destroy after the animation completes:

```tsx
<YourModal open={visible} onClose={hide} afterClose={destroy} />
```

## Data and props

The modal definition has two independent fields:

- `data` is supplied to each `show` call. Use it for the item being viewed or edited.
- `props` is supplied to `useModal` and captured when `show` runs. Use it for callbacks and owner-level configuration.

Whether those fields are required, optional, or absent determines the callable API:

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

type Combined = {
  data: { id: string };
  props: { onSave: (id: string) => void };
};
// useModal(Component, { onSave }).show({ id: "1" })
```

`props` is intentionally a snapshot. Changing the object passed to `useModal` does not update an already open modal; call `show` again to capture the latest values.

## Lifecycle

| Action | Mounted | Visible | Local state |
| --- | --- | --- | --- |
| Before the first `show` | No | No | Not created |
| `show(data?)` | Yes | Yes | Created or refreshed with the latest inputs |
| `hide()` | Yes | No | Preserved |
| `destroy()` | No | No | Discarded |

If the component that owns `useModal` unmounts, its modal is destroyed automatically. Callbacks captured by an older `show` call cannot hide or destroy a newer modal generation.

## API

### `useModal(component, props?)`

Returns a controller with three methods:

- `show(data?)` mounts or re-shows the modal with the latest input snapshot.
- `hide()` sets `visible` to `false` without unmounting the modal.
- `destroy()` unmounts the modal and clears its captured inputs.

### `ModalProps<Definition>`

Props received by the managed modal component. It includes every field declared by `Definition` plus:

```ts
interface ModalControls {
  visible: boolean;
  hide: () => void;
  destroy: () => void;
}
```

### `ModalProvider`

The render host for managed modals. Mount it once near the root of the React tree whose context the modals need to consume.

## Migrating from v2

Version 3 replaces positional `ModalType<Data, Props>` parameters with a named definition object:

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

Also note:

- Required definition fields now produce required function arguments.
- Use `data?: Data` when `show()` without data should be valid.
- Use `props?: Props` when `useModal(component)` without props should be valid.
- `useModalContext` and `ModalType` are no longer public APIs.
- Hook-owned modals are destroyed when their owner unmounts.

## Development

```bash
pnpm install
pnpm test
pnpm check
pnpm build
```

## License

MIT
