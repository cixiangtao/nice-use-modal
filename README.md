# nice-use-modal

## 前言

在react中使用modal是一个比较令人心烦的痛点。
nice-use-modal可以帮助你解决这一烦恼。

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

| 参数    | 说明                  | 类型                                           | 默认值 |
| ------- | --------------------- | ---------------------------------------------- | ------ |
| visible | 是否显示              | `boolean`                                      | false  |
| hide    | 隐藏                  | `() => void`                                   | -      |
| destroy | 销毁                  | `() => void`                                   | -      |
| data    | Modal打开时传入的data | `T &#124; Record<string,any> &#124; undefined` | -      |

### Result

| 参数    | 说明 | 类型                                           | 默认值 |
| ------- | ---- | ---------------------------------------------- | ------ |
| show    | 显示 | `(data?: T &#124; Record<string,any>) => void` | -      |
| hide    | 隐藏 | `() => void`                                   | -      |
| destroy | 销毁 | `() => void`                                   | -      |

## Demos
