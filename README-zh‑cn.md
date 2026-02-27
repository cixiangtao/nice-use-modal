# nice-use-modal

![license MIT](https://badgen.net/npm/license/nice-use-modal)
![npm](https://badgen.net/npm/v/nice-use-modal)
![downloads](https://badgen.net/npm/dt/nice-use-modal?label=downloads)

[English](./README.md)

一个轻量、无 UI 依赖的 React Modal Hook。它支持命令式打开 Modal 或 Drawer，同时保留当前 React 上下文。

## 特性

- 使用具名 Definition 描述 TypeScript 类型
- 同等支持只有 data、只有 props，以及两者兼有的弹窗
- 只有执行 `show` 后才挂载组件
- `hide` 保留组件状态，`destroy` 真正卸载组件
- Modal 状态变化不会导致 `useModal` 所属组件重新渲染
- 自动处理所属组件卸载和旧关闭动画回调

## 安装

```bash
pnpm add nice-use-modal
```

React 18 和 React 19 作为 peer dependency 得到支持。

## 注册 Provider

```tsx
import { ModalProvider } from "nice-use-modal";

root.render(
  <ModalProvider>
    <App />
  </ModalProvider>,
);
```

## data 与 props

Definition 中有两个互相独立的具名字段：

- `data`：每次执行 `show` 时传入的动态数据。
- `props`：传给 `useModal` 的配置，在执行 `show` 时生成快照。

字段是否存在、是否可选，会直接决定对应函数参数是否存在、是否必填。

### 只有 data

```tsx
interface PreviewDefinition {
  data: { imageUrl: string };
}

function PreviewModal({ data, visible, hide }: ModalProps<PreviewDefinition>) {
  return (
    <Modal open={visible} onCancel={hide}>
      <img src={data.imageUrl} alt="预览" />
    </Modal>
  );
}

const preview = useModal(PreviewModal);
preview.show({ imageUrl: "/preview.png" });
```

### 只有 props

```tsx
interface ConfirmDefinition {
  props: { onConfirm: () => void };
}

function ConfirmModal({ props, visible, hide }: ModalProps<ConfirmDefinition>) {
  return (
    <Modal open={visible} onCancel={hide}>
      <button onClick={props.onConfirm}>确定</button>
    </Modal>
  );
}

const confirm = useModal(ConfirmModal, { onConfirm: save });
confirm.show();
```

### 可选 data 与必填 props

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
    <Modal open={visible} onCancel={hide} afterClose={destroy}>
      <h2>{data.title ?? "新建"}</h2>
      <button onClick={props.onSuccess}>保存</button>
    </Modal>
  );
}

const editor = useModal(EditModal, { onSuccess: refresh });
editor.show();
editor.show({ id: "1", title: "编辑" });
```

字段规则如下：

```ts
type RequiredData = { data: { id: string } }; // show(data)
type OptionalData = { data?: { id?: string } }; // show(data?)
type RequiredProps = { props: Options }; // useModal(component, props)
type OptionalProps = { props?: Options }; // useModal(component, props?)
```

## API

### `useModal(component, props?)`

返回：

- `show(data?)`：挂载或显示 Modal，并写入最新 data。
- `hide()`：将 `visible` 设为 `false`，但保留组件实例和内部状态。
- `destroy()`：卸载 Modal，并清理保存的 data 与 props。

`props` 是执行 `show` 时的快照。修改传给 `useModal` 的值不会响应式更新已经打开的 Modal；再次执行 `show` 才会取得最新值。

### `ModalProps<Definition>`

每个 Modal 都会收到以下控制属性：

```ts
interface ModalControls {
  visible: boolean;
  hide: () => void;
  destroy: () => void;
}
```

只有 Definition 声明了 `data` 或 `props`，组件才会在类型上收到对应字段。

### `ModalProvider`

所有调用 `useModal` 的组件都必须处于 Provider 下方。调用 Hook 的所属组件卸载时，对应 Modal 会自动销毁。

## 从 v2 迁移

v3 使用具名 Definition 替换 `ModalType<Data, Props>`：

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

需要注意：

- Definition 中的必填字段现在会生成必填函数参数。
- 需要允许 `show()` 时，将字段声明成 `data?: Data`。
- 需要允许 `useModal(component)` 时，将字段声明成 `props?: Props`。
- `useModalContext` 和 `ModalType` 不再是公共 API。
- 调用 Hook 的所属组件卸载时，Modal 会自动销毁。

## License

MIT
