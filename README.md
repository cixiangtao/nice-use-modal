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

## 安装

```sh
# pnpm
pnpm add nice-use-modal

# npm
npm i nice-use-modal -S
```

## Examples

main.tsx

```tsx
import { ModalProvider } from "nice-use-modal";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ModalProvider>
      <App />
    </ModalProvider>
  </React.StrictMode>
);
```

MyModal.tsx

> Drawer和Modal的使用方式一致。

```tsx
import { useModal } from "nice-use-modal";
import { Modal } from "antd";

interface IData {
  title?: string;
}

export default (props) =>
  useModal<IData>(({ visible, hide, destroy, data = {} }) => {
    const { title='新建' } = data;
    return (
      <Modal
        title={title}
        onOk={() => hide()}
        open={visible}
        onCancel={() => hide()}
        // afterClose={() => destroy()}
      >
        Hello World!
      </Modal>
    );
  });
```

home.tsx

```tsx
import useMyModal from "./MyModal";

export default () => {
  const { show, hide, destroy } = useMyModal();

  return (
    <>
      <button onClick={() => show()}>新建</button>
      <button onClick={() => show({ title: "编辑" })}>编辑</button>
      <button onClick={() => hide()}>关闭</button>
      <button onClick={() => destroy()}>销毁</button>
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

| 参数    | 说明                  | 类型                                   | 默认值 |
| ------- | --------------------- | -------------------------------------- | ------ |
| visible | 是否显示              | `boolean`                              | false  |
| hide    | 隐藏                  | `() => void`                           | -      |
| destroy | 销毁                  | `() => void`                           | -      |
| data    | Modal打开时传入的data | `T \| Record<string,any> \| undefined` | -      |

### Result

| 参数    | 说明 | 类型                                       | 默认值 |
| ------- | ---- | ------------------------------------------ | ------ |
| show    | 显示 | `(data?: T \| Record<string,any>) => void` | -      |
| hide    | 隐藏 | `() => void`                               | -      |
| destroy | 销毁 | `() => void`                               | -      |

## Demos
