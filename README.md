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

## 使用示例

```tsx main.tsx
import { ModalProvider } from "nice-use-modal";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ModalProvider>
      <App />
    </ModalProvider>
  </React.StrictMode>
);
```

```tsx MyModal.tsx
import { useModal } from "nice-use-modal";
import { Modal } from "antd";

export default (props) => {
  return useModal(({ visible, hide, destroy, data = {} }) => {
    return (
      <Modal
        onOk={() => hide()}
        open={visible}
        onCancel={() => hide()}
        // afterClose={() => destroy()}
      >
        Hello World!
      </Modal>
    );
  });
};
```

```tsx home.tsx
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
