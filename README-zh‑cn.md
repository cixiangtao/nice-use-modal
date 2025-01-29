# nice-use-modal

![license MIT](https://badgen.net/npm/license/nice-use-modal)
![npm](https://badgen.net/npm/v/nice-use-modal)
![downloads](https://badgen.net/npm/dt/nice-use-modal?label=downloads)

## 前言

在react中使用modal / drawer是一个比较令人心烦的痛点。
nice-use-modal可以帮助你解决这一烦恼。

## 特性

- 🚀 无UI依赖：内部仅负责维护状态和渲染，因此你可以使用任何你喜欢的UI库以及组件。
- 🚀 无副作用：内部使用createContext维护上下文，避免render方式丢失全局配置。
- 🚀 更灵活：hooks的方式使用，命令式调用，不需要在组件中引入ReactNode。
- 🚀 更简单：弹窗关闭时会自动重置内部状态，无序手动维护。
- 🚀 TS支持：内部使用TS编写，支持TS提示。

## 安装

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

> Drawer和Modal的使用方式一致。

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

  const { title = "新建", desc = "Hello World!" } = data;
  const { onOk, onCancel } = props;

  useEffect(() => {
    message.info("执行show方法才会注册组件");
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
      afterClose={() => destroy()} // 对于有关闭动画的组件，需要在动画结束后再选择销毁组件，这样可以保留动画效果
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
          新建
        </Button>
        <Button
          onClick={() =>
            show({
              title: "编辑",
              desc: "你可以实时传入data，以供组件内部使用",
            })
          }
        >
          编辑
        </Button>
        <Button onClick={() => destroy()}>销毁</Button>
      </Space>
    </>
  );
};
```

## API

```tsx
import { useModal } from "nice-use-modal";

const Result = useModal<T>((Props)=>{})
```

### Props

| 参数    | 说明                      | 类型                                   | 默认值      | 版本    |
| ------- | ------------------------- | -------------------------------------- | ----------- | ------- |
| visible | 是否显示                  | `boolean`                              | false       | -       |
| hide    | 隐藏                      | `() => void`                           | -           | -       |
| destroy | 销毁                      | `() => void`                           | -           | -       |
| data    | Modal打开时传入的data     | `T \| Record<string,any> \| undefined` | -           | -       |
| props   | 注册 Modal 时传入的 props | `K`                                    | `undefined` | `1.1.0` |

> 注：hide 和 destroy 的区别在于，hide 会保留 Modal 的状态，destroy 会销毁 Modal 的状态。
> 对于有关闭动画的 Modal，可以先使用 hide，等动画结束后再 destroy，**直接使用 destroy 会导致动画无法正常结束。**

> 注: data 与 props 的区别在于，data 是每次打开 Modal 时传入的，props 是注册 Modal 时传入的，props 不会变化。

### Result

| 参数    | 说明 | 类型                                       | 默认值 |
| ------- | ---- | ------------------------------------------ | ------ |
| show    | 显示 | `(data?: T \| Record<string,any>) => void` | -      |
| hide    | 隐藏 | `() => void`                               | -      |
| destroy | 销毁 | `() => void`                               | -      |
