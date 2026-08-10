# nice-use-modal

[English](README.md) | 简体中文

[![npm version](https://badgen.net/npm/v/nice-use-modal)](https://www.npmjs.com/package/nice-use-modal)
[![CI](https://github.com/cixiangtao/nice-use-modal/actions/workflows/ci.yml/badge.svg)](https://github.com/cixiangtao/nice-use-modal/actions/workflows/ci.yml)

一个轻量、无样式的 React 模态框控制器。通过 Hook 打开模态框，传入完整类型的数据，并明确决定关闭时保留还是销毁组件内部状态。

[在线演示](https://cixiangtao.github.io/nice-use-modal/) · [npm](https://www.npmjs.com/package/nice-use-modal) · [变更记录](../CHANGELOG.md) · [参与贡献](../CONTRIBUTING.zh-CN.md)

```tsx
const confirmModal = useModal(ConfirmModal, { onConfirm: deleteProject });
confirmModal.show({ id: "project-1", title: "删除这个项目？" });
```

## 为什么使用它

- 调用 `show`、`hide` 和 `destroy`，不必在父组件维护 `visible` 与临时数据。
- 模态框仍由 `ModalProvider` 放在同一 React 树中，可以读取主题、路由、Store 与其他 Context。
- 首次 `show()` 前不挂载。
- `hide()` 保留内部状态，`destroy()` 卸载并在下次重新开始。
- TypeScript 会从模态框组件推导 `useModal()` 和 `show()` 的参数。
- 不绑定 UI 库，可与 Ant Design、MUI、Radix 或原生 dialog 配合。

需要 React 18 或 19。

## 安装

```bash
pnpm add nice-use-modal
```

## 快速开始

先在需要使用模态框的组件上方放置 Provider：

```tsx
import { ModalProvider } from "nice-use-modal";

createRoot(document.getElementById("root")!).render(
  <ModalProvider>
    <App />
  </ModalProvider>,
);
```

在一个定义中声明 `data` 与 `props`。`visible`、`hide` 和 `destroy` 会自动注入：

```tsx
import type { ModalProps } from "nice-use-modal";

interface ConfirmModalDefinition {
  data: { id: string; title: string };
  props: { onConfirm: (id: string) => void };
}

function ConfirmModal({ data, props, visible, hide, destroy }: ModalProps<ConfirmModalDefinition>) {
  if (!visible) return null;
  return (
    <div aria-modal="true" role="dialog">
      <h2>{data.title}</h2>
      <button onClick={hide}>取消</button>
      <button onClick={() => { props.onConfirm(data.id); destroy(); }}>确认</button>
    </div>
  );
}
```

Hook 的两个参数会从组件类型中自动推导：

```tsx
const confirmModal = useModal(ConfirmModal, { onConfirm: deleteProject });
confirmModal.show({ id: "project-1", title: "删除这个项目？" });
```

## 生命周期

| 调用 | 已挂载 | 可见 | 组件内部状态 |
| --- | --- | --- | --- |
| 首次 `show()` 前 | 否 | 否 | 未创建 |
| `show(data?)` | 是 | 是 | 首次创建，之后保留 |
| `hide()` | 是 | 否 | 保留 |
| `destroy()` | 否 | 否 | 丢弃 |

再次调用 `show()` 会更新捕获的 `data` 与 `props`，但不会重新挂载。需要全新实例时先调用 `destroy()`。Hook 所在组件卸载时，对应模态框会自动销毁。

为了保留关闭动画，先 `hide`，再在 UI 库的 after-close 回调中 `destroy`；如果重新打开需要保留草稿，则不要执行后者。

## data 与 props

`data` 由 `controller.show(data)` 传入，适合当前记录；`props` 由 `useModal(Component, props)` 传入，适合回调与拥有者级配置。二者都是 `show()` 时的快照。拥有者中的 props 变化不会自动更新已打开的模态框，需要再次调用 `show()`。

定义中的必填、可选和缺失字段会生成对应的调用签名，例如 `data?: Data` 允许无参数 `show()`，`props?: Props` 允许无第二参数的 `useModal(Component)`。

## API

- `useModal(component, props?)`：返回稳定控制器，包含 `show`、`hide`、`destroy`。
- `ModalProps<Definition>`：定义中的输入加上 `visible`、`hide`、`destroy`。
- `ModalProvider`：承载受管理的模态框，应放在它们需要访问的 Context 边界附近。
- 同时导出 `ModalComponent`、`ModalControls`、`ModalDefinition`、`ModalFieldArguments`、`ModalProviderProps` 和 `ModalResult`。

## 从 v2 迁移

v3 使用命名定义对象替代位置参数式 `ModalType<Data, Props>`。必填字段现在要求对应参数；需要可选调用时将字段写成可选。`ModalType` 和 `useModalContext` 不再是公开 API，Hook 拥有者卸载时实例会销毁。完整历史见[变更记录](../CHANGELOG.md)。

## 社区

开发流程见[贡献指南](../CONTRIBUTING.zh-CN.md)，发布约定见[发布说明](../RELEASING.zh-CN.md)。普通缺陷与聚焦的功能建议使用 [GitHub Issues](https://github.com/cixiangtao/nice-use-modal/issues)，安全问题按[安全政策](../SECURITY.zh-CN.md)私密报告。

## 许可证

[MIT](../LICENSE)
