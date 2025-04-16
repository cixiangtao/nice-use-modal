# 为什么要使用useModal

## 前提

**基本的 modal 业务组件大概会包含以下几个功能：**

- 控制显示隐藏
- 接受父组件传来的 data、props
- 显示时初始化状态，如：数据请求
- 隐藏时重置状态，如：清空数据、重置 loading 状态

**基本组件形式有如下几种：**

- visible 由父组件控制
  - 一、通过父组件传递 visible 控制显示隐藏
- visible 由组件内部控制
  - 二、通过 useRef 调用组件内部方法控制显示隐藏
  - 三、通过预留插槽的方式，让父组件传递一个按钮，点击按钮触发显示隐藏
- 命令式调用
  - 四、通过render方式，直接插入到dom中。

## 优缺点对比

### 一、通过父组件传递 visible 控制显示隐藏

```tsx
import React, { useState } from 'react';
import Modal from './Modal';

export default function App() {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <button onClick={() => setVisible(true)}>显示</button>
      <Modal visible={visible} onClose={() => setVisible(false)} />
    </div>
  );
}
```

```tsx
import React from 'react';

interface Props {
  visible: boolean;
  data?: any;
  onClose: () => void;
}

export default function Modal(props: Props) {
  const { visible, onClose } = props;

  return (
    <div>
      {visible && (
        <div>
          <div>modal</div>
          <button onClick={onClose}>关闭</button>
        </div>
      )}
    </div>
  );
}
```

**优点：**

- 组件结构简单。
- 受控组件，显示隐藏由父组件控制。

**缺点：**

  1. 组件需要注册到父组件，带来问题是父组件渲染的同时，子组件也会渲染。即使我们没有将 visible 设置为 true，子组件也会渲染，只是不显示而已。这样带来的问题是内部一些初始化的操作，如：数据请求、重置状态等，就需要添加额外的判断条件。同时如果modal内部有其他子组件，也会导致子组件渲染，这样就会导致一些不必要的渲染及一些bug。
  2. visible设置为false时，组件并不会销毁，而是隐藏。这样就会导致一些状态没有重置，如：数据请求、重置状态等。需要手动增加额外的判断条件来重置状态。
  3. 状态都需要维护在父组件，如：visible、data等。特别data，如果一个modal组件有新建、编辑、查看等多种状态，那么data就会变得很复杂。例如在table中的编辑和查看。这样就导致父子组件耦合度很高，不利于维护。
  4. 状态在父组件维护，导致父组件一些不必要的渲染。
  5. 如果父组件内有多个modal，那么就需要维护多个visible、data等状态，这样就会导致父组件状态变得很复杂。

> 总体来说，这种组件方式是最简单，但也是最不利于维护、最不推荐的。
> 父子组件没有做到低耦合，大量的状态维护在父组件，导致父组件状态变得很复杂，不利于维护。同时子组件也不利于复用。

### 二、通过 useRef 调用组件内部方法控制显示隐藏

```tsx
import React, { useRef } from 'react';
import Modal from './Modal';

export default function App() {
  const modalRef = useRef<any>();

  return (
    <div>
      <button onClick={() => modalRef.current.show()}>显示</button>
      <Modal ref={modalRef} />
    </div>
  );
}
```

```tsx
import React, { forwardRef, useImperativeHandle, useState } from 'react';

interface Props {
  data?: any;
}

export default forwardRef(function Modal(props: Props, ref: any) {
  const { data } = props;
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    show: () => setVisible(true),
    hide: () => setVisible(false),
  }));

  return (
    <div>
      {visible && (
        <div>
          <div>modal</div>
          <button onClick={() => setVisible(false)}>关闭</button>
        </div>
      )}
    </div>
  );
});
```

**优点：**

- 半受控组件，显示隐藏既可以由子组件控制，也可以由父组件控制。
- 父子组件低耦合，父组件只需要维护一个ref，不需要维护visible、data等状态。
- 通过方法调用的方式，初始化的操作可以全部放置到 show 方法中，隐藏时可以全部放置到 hide 方法中，不需要额外的判断条件。这样传递data和重置状态都会变得简单。
- modal的显示隐藏不会导致父组件的重新渲染。

**缺点：**

- 组件结构稍微复杂一点，需要使用 forwardRef 和 useImperativeHandle。
- 同第一种方式缺点中的 1、2两点。

> 这种组件方式是我平时最常用的。
> 这种方式的优点比较多，data的传递也比较方便，但是还是有一些缺点，如：组件结构稍微复杂一点，需要使用 forwardRef 和 useImperativeHandle。同时也没有解决第一种方式的 1、2两点。

### 三、通过预留插槽的方式，让父组件传递一个按钮，点击按钮触发显示隐藏

```tsx
import React from 'react';
import Modal from './Modal';

export default function App() {
  return (
    <div>
      <Modal>
        <button>显示</button>
      </Modal>
    </div>
  );
}
```

```tsx
import React, { forwardRef, useImperativeHandle, useState } from 'react';

interface Props {
  data?: any;
  children: React.ReactNode;
}

export default function Modal(props: Props, ref: any) {
  const { children } = props;
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div onClick={() => setVisible(true)}>{children}</div>
      {visible && (
        <div>
          <div>modal</div>
          <button onClick={() => setVisible(false)}>关闭</button>
        </div>
      )}
    </div>
  );
  )
}
```

**优点：**

- 非受控组件，显示隐藏由组件内部控制。
- 父子组件低耦合，父组件只需要传递一个按钮，不需要维护visible、data等状态。
- data通过props传递，不需要维护在父组件。

**缺点：**

- 一个按钮就需要注册一个组件，如果有多重编辑模式，那么就需要注册多个组件。特别是在table中，将是一种灾难。
- 同第一种方式缺点中的 1、2两点。

> 这种组件方式是我平时最不推荐的。但也是我见过最多的一种方式。
> 很多人选择这种方式的理由就是使用和维护起来最简单，虽然缺点是带来了致命的性能问题，但是大多数人抱着“能用就行”的心态也就这么用下去了。
>
> 而作为追求极致的前端工程师，社会主义的接班人，我们不能这么做！

### 四、通过render方式，直接插入到dom中

> 这种方式类似于antd中的message.info()、modal.info()等。是通过render的方式直接插入到目标dom中的。
> 目前这种方式实践较少。

**优点：**

- 命令式调用。
- 组件显示时才会注册组件，隐藏时会销毁组件，不会导致不必要的渲染。

**缺点：**

- 这种方式违背了react的设计理念。
- 组件解构复杂，需要使用到react的一些api，如：createPortal等。
- 无法消费context，无法获取全局配置，这在国际化中是很难受的。

## useModal

### 示例

```tsx
// main.tsx
import { ModalProvider } from "nice-use-modal";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <ModalProvider>
      <App />
    </ModalProvider>
);
```

```tsx
// MyModal.tsx
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

```tsx
// home.tsx
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

**优点：**

- 组件结构简单。MyModal.tsx就是一个正常的函组件，不需要关心visible、data等状态。
- 组件显示时才会注册组件，隐藏时会销毁组件（destroy），不会导致不必要的渲染。
- 命令式调用，data传递方便。
- 可以消费context，可以获取全局配置，如：国际化等。
- 一个useModal是一个独立的实例，不会相互影响。不会重复注册组件，不会重复销毁组件。
- 低耦合，父子组件几乎没有任何耦合，组件复用更加方便。
- 完整的ts支持，类型提示更加友好。

**缺点：**

- 稍微一丢丢的学习成本（用啥不需要学😠）。
