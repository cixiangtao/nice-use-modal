# nice-use-modal

![license MIT](https://badgen.net/npm/license/nice-use-modal)
![npm](https://badgen.net/npm/v/nice-use-modal)
![downloads](https://badgen.net/npm/dt/nice-use-modal?label=downloads)

[中文文档](./README-zh%E2%80%91cn.md)

A small, UI-agnostic React hook for rendering modals and drawers imperatively while preserving the surrounding React context.

## Features

- Named, definition-driven TypeScript API
- Independent data-only, props-only, and combined modal definitions
- Modal components mount only after `show`
- `hide` preserves component state; `destroy` unmounts it
- Stable action context avoids re-rendering hook owners on modal updates
- Safe cleanup for owner unmounts and stale close-animation callbacks

## Installation

```bash
pnpm add nice-use-modal
```

React 18 and React 19 are supported peer dependencies.

## Setup

```tsx
import { ModalProvider } from "nice-use-modal";

root.render(
  <ModalProvider>
    <App />
  </ModalProvider>,
);
```

## Data and props

The generic definition has two independent named fields:

- `data`: dynamic input passed to each `show` call.
- `props`: configuration captured from `useModal` when `show` is called.

The presence and optionality of each field determine the corresponding function arguments.

### Data only

```tsx
import { ModalProps, useModal } from "nice-use-modal";

interface PreviewDefinition {
  data: { imageUrl: string };
}

function PreviewModal({ data, visible, hide }: ModalProps<PreviewDefinition>) {
  return (
    <Dialog open={visible} onClose={hide}>
      <img src={data.imageUrl} alt="Preview" />
    </Dialog>
  );
}

const preview = useModal(PreviewModal);
preview.show({ imageUrl: "/preview.png" });
```

### Props only

```tsx
interface ConfirmDefinition {
  props: { onConfirm: () => void };
}

function ConfirmModal({ props, visible, hide }: ModalProps<ConfirmDefinition>) {
  return (
    <Dialog open={visible} onClose={hide}>
      <button onClick={props.onConfirm}>Confirm</button>
    </Dialog>
  );
}

const confirm = useModal(ConfirmModal, { onConfirm: save });
confirm.show();
```

### Optional data with required props

```tsx
interface EditDefinition {
  data?: {
    id?: string;
    title?: string;
  };
  props: {
    onSuccess: () => void;
  };
}

function EditModal({
  data = {},
  props,
  visible,
  hide,
  destroy,
}: ModalProps<EditDefinition>) {
  return (
    <Dialog open={visible} onClose={hide} afterClose={destroy}>
      <h2>{data.title ?? "Create"}</h2>
      <button onClick={props.onSuccess}>Save</button>
    </Dialog>
  );
}

const editor = useModal(EditModal, { onSuccess: refresh });
editor.show();
editor.show({ id: "1", title: "Edit" });
```

Use an optional definition field when its corresponding argument may be omitted:

```ts
type RequiredData = { data: { id: string } }; // show(data)
type OptionalData = { data?: { id?: string } }; // show(data?)
type RequiredProps = { props: Options }; // useModal(component, props)
type OptionalProps = { props?: Options }; // useModal(component, props?)
```

## API

### `useModal(component, props?)`

Returns:

- `show(data?)`: mounts or shows the modal with the latest data.
- `hide()`: sets `visible` to `false` while preserving the component instance.
- `destroy()`: unmounts the modal and clears its stored data and props.

`props` is a snapshot taken when `show` executes. Changing the value passed to `useModal` does not reactively update an already open modal; call `show` again to provide the latest snapshot.

### `ModalProps<Definition>`

Every modal receives these controls:

```ts
interface ModalControls {
  visible: boolean;
  hide: () => void;
  destroy: () => void;
}
```

It receives `data` and/or `props` only when those fields exist in its definition.

### `ModalProvider`

Mount one provider above every component that calls `useModal`. A modal is automatically destroyed when its owning hook unmounts.

## Migrating from v2

v3 replaces the positional `ModalType<Data, Props>` carrier with a named definition object.

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

Important changes:

- Required definition fields now produce required function arguments.
- Use `data?: Data` when `show()` without data should remain valid.
- Use `props?: Props` when `useModal(component)` without props should remain valid.
- `useModalContext` and `ModalType` are no longer public APIs.
- Hook-owned modals are destroyed when their owner unmounts.

## License

MIT
