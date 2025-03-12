# nice-use-modal

![license MIT](https://badgen.net/npm/license/nice-use-modal)
![npm](https://badgen.net/npm/v/nice-use-modal)
![downloads](https://badgen.net/npm/dt/nice-use-modal?label=downloads)

## Docs

- [English](./README.md)
- [中文](./README-zh%E2%80%91cn.md)

## Introduction

Using modals and drawers in React can be a bit of a pain. nice-use-modal can help alleviate this annoyance.

## Features

- 🚀 No UI Dependency: It only manages state and rendering internally, so you can use any UI library or components you like.
- 🚀 No Side Effects: It uses createContext internally to maintain context, avoiding the loss of global configurations in rendering.
- 🚀 More Flexible: Use it as hooks, call it imperatively, no need to import ReactNode into components.
- 🚀 Simpler: The internal state is automatically reset when the modal is closed, so you don't need to manage it manually.
- 🚀 TypeScript Support: Written in TypeScript, it provides TypeScript hints.

## Installation

```sh
# pnpm
pnpm add nice-use-modal

# yarn
yarn add nice-use-modal

# npm
npm i nice-use-modal -S

```

## Examples

main.tsx

```tsx
import { ModalProvider } from "nice-use-modal";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <ModalProvider>
      <App />
    </ModalProvider>
);
```

MyModal.tsx

> The usage of Drawer and Modal is the same.

```tsx
import React, { useEffect } from "react";
import { Modal, message } from "antd";
import { ModalProps } from "nice-use-modal";

interface IData {
  title?: string;
  desc?: string;
}

interface IProps {
  onOk: () => void;
  onCancel?: () => void;
}

export default (p: ModalProps<IData, IProps>) => {
  const { visible, hide, destroy, data = {}, props } = p;

  const { title = "New", desc = "Hello World!" } = data;
  const { onOk, onCancel } = props;

  useEffect(() => {
    message.info("The component is registered only when the show method is executed.");
  }, []);

  return (
    <Modal
      title={title}
      onOk={() => {
        onOk?.();
        hide();
      }}
      open={visible}
      onCancel={() => {
        onCancel?.();
        hide();
      }}
      afterClose={() => destroy()} // For components with closing animations, it's best to destroy the component after the animation ends to preserve the animation effect.
    >
      {desc}
    </Modal>
  );
};
```

home.tsx

```tsx
import MyModal from "./MyModal";
import { Button, Space, message } from "antd";
import { useModal } from "nice-use-modal";

export default () => {
  const { show, hide, destroy } = useModal(MyModal, {
    onOk: () => {
      message.success("ok");
    },
    onCancel: () => {
      message.error("cancel");
    },
  });

  return (
    <>
      <Space>
        <Button
          onClick={() => {
            show();
          }}
        >
          New
        </Button>
        <Button
          onClick={() =>
            show({
              title: "Edit",
              desc: "You can pass data in real-time for internal use in the component.",
            })
          }
        >
          Edit
        </Button>
        <Button onClick={() => destroy()}>Destroy</Button>
      </Space>
    </>
  );
};
```

## API

```tsx
import { useModal } from 'nice-use-modal';
import type { ModalProps , ModalResult } from 'nice-use-modal';

const Result:ModalResult = useModal<T,K>((Props:ModalProps<T,K>)=>{},props)
```

### Props

| Parameter | Description                         | Type                                   | Default     | Version |
| --------- | ----------------------------------- | -------------------------------------- | ----------- | ------- |
| visible   | Whether to show                     | `boolean`                              | false       | -       |
| hide      | Hide the modal                      | `() => void`                           | -           | -       |
| destroy   | Destroy the modal                   | `() => void`                           | -           | -       |
| data      | Data passed when opening the modal  | `T \| Record<string,any> \| undefined` | -           | -       |
| props     | Props passed when registering modal | `K`                                    | `undefined` | `1.1.0` |

> Note: The difference between hide and destroy is that hide preserves the modal's state, while destroy destroys the modal's state. For modals with closing animations, it's best to use hide first, and then destroy after the animation ends. Using destroy directly may cause the animation to not end properly.

> Note: The difference between data and props is that data is passed each time the modal is opened, while props are passed when the modal is registered and do not change.

### Result

| Parameter | Description | Type                                       | Default |
| --------- | ----------- | ------------------------------------------ | ------- |
| show      | Show        | `(data?: T \| Record<string,any>) => void` | -       |
| hide      | Hide        | `() => void`                               | -       |
| destroy   | Destroy     | `() => void`                               | -       |
