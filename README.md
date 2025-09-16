# nice-use-modal

![license MIT](https://badgen.net/npm/license/nice-use-modal)
![npm](https://badgen.net/npm/v/nice-use-modal)
![downloads](https://badgen.net/npm/dt/nice-use-modal?label=downloads)

## Docs

- [English](./README.md)
- [中文](./README-zh%E2%80%91cn.md)

## Introduction

A powerful React modal hook with TypeScript support that makes managing modals and drawers simple and type-safe.

## ✨ What's New in v2.0

- 🎯 **Enhanced TypeScript Support**: Complete type safety with better inference
- 🏗️ **Improved Build System**: Migrated from Vite to tsup for better compatibility
- 🚀 **Performance Optimizations**: Better memoization and reduced re-renders
- 📦 **Smaller Bundle Size**: Optimized build output
- 🔧 **Better API Design**: More consistent and intuitive API
- 🐛 **Bug Fixes**: Resolved edge cases and improved stability

## Features

- 🎯 **Type-safe**: Full TypeScript support with strict typing
- 🚀 **No UI Dependency**: Works with any UI library (Ant Design, Material-UI, etc.)
- 🔄 **No Side Effects**: Uses React Context to maintain clean state management
- 🎨 **Flexible**: Use as hooks or call imperatively
- 🧹 **Auto Cleanup**: Internal state automatically resets when modal closes
- 📦 **Lightweight**: Minimal dependencies and small bundle size

## Installation

```bash
# npm
npm install nice-use-modal

# pnpm
pnpm add nice-use-modal

# yarn
yarn add nice-use-modal
```

## Quick Start

### 1. Setup Provider

Wrap your app with `ModalProvider`:

**main.tsx**
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ModalProvider } from 'nice-use-modal';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ModalProvider>
      <App />
    </ModalProvider>
  </React.StrictMode>
);
```

### 2. Create Modal Component

**MyModal.tsx**
```tsx
import React, { useEffect } from 'react';
import { Modal, message } from 'antd';
import { ModalProps, ModalType } from 'nice-use-modal';

// Define your modal's data and props types
interface MyModalData {
  title?: string;
  desc?: string;
}

interface MyModalProps {
  onOk: () => void;
  onCancel?: () => void;
}

// Create typed modal type
type MyModalType = ModalType<MyModalData, MyModalProps>;

// Modal component with full TypeScript support
const MyModal: React.FC<ModalProps<MyModalType>> = ({
  visible,
  hide,
  destroy,
  data = {},
  props
}) => {
  const { title = 'New', desc = 'Hello World!' } = data;
  const { onOk, onCancel } = props || {};

  useEffect(() => {
    message.info('Modal component mounted!');
  }, []);

  return (
    <Modal
      title={title}
      open={visible}
      onOk={() => {
        onOk?.();
        hide();
      }}
      onCancel={() => {
        onCancel?.();
        hide();
      }}
      afterClose={() => destroy()} // Preserve animations
    >
      {desc}
    </Modal>
  );
};

export default MyModal;
```

### 3. Use Modal in Components

**HomePage.tsx**
```tsx
import React from 'react';
import { Button, Space, message } from 'antd';
import { useModal } from 'nice-use-modal';
import MyModal from './MyModal';

const HomePage: React.FC = () => {
  // Initialize modal with props
  const { show, hide, destroy } = useModal(MyModal, {
    onOk: () => {
      message.success('Operation confirmed!');
    },
    onCancel: () => {
      message.info('Operation cancelled');
    },
  });

  return (
    <Space>
      <Button
        type="primary"
        onClick={() => show()}
      >
        Create New
      </Button>
      
      <Button
        onClick={() => show({
          title: 'Edit Item',
          desc: 'You can pass dynamic data when showing the modal.',
        })}
      >
        Edit Item
      </Button>
      
      <Button 
        danger 
        onClick={() => destroy()}
      >
        Destroy Modal
      </Button>
    </Space>
  );
};

export default HomePage;
```

### 4. Alternative: Inline Modal Definition

You can also define modals inline for simpler use cases:

```tsx
import React from 'react';
import { useModal, ModalProps, ModalType } from 'nice-use-modal';
import { Modal } from 'antd';

interface SimpleModalData {
  message: string;
}

interface SimpleModalProps {
  onConfirm: () => void;
}

type SimpleModalType = ModalType<SimpleModalData, SimpleModalProps>;

const useSimpleModal = (props: SimpleModalProps) => {
  return useModal<SimpleModalType>(
    ({ visible, hide, destroy, data, props: modalProps }) => (
      <Modal
        open={visible}
        title="Confirmation"
        onOk={() => {
          modalProps?.onConfirm();
          hide();
        }}
        onCancel={hide}
        afterClose={destroy}
      >
        {data?.message || 'Are you sure?'}
      </Modal>
    ),
    props
  );
};

// Usage
const MyComponent: React.FC = () => {
  const { show } = useSimpleModal({
    onConfirm: () => console.log('Confirmed!')
  });

  return (
    <button onClick={() => show({ message: 'Delete this item?' })}>
      Delete
    </button>
  );
};
```

## API Reference

### useModal

The main hook for managing modals.

```tsx
import { useModal } from 'nice-use-modal';
import type { ModalProps, ModalResult, ModalType } from 'nice-use-modal';

const result: ModalResult<T['data']> = useModal<T extends ModalType>(
  component: ModalComponent<T>,
  props?: T['props']
);
```

**Parameters:**
- `component`: Modal component or render function
- `props`: Static props passed to modal (optional)

**Returns:**
- `show(data?)`: Function to display the modal
- `hide()`: Function to hide the modal
- `destroy()`: Function to destroy the modal

### ModalProps

Props passed to modal components:

| Property | Type | Description |
|----------|------|-------------|
| `visible` | `boolean` | Whether the modal is visible |
| `hide` | `() => void` | Function to hide the modal |
| `destroy` | `() => void` | Function to destroy the modal |
| `data` | `T['data']` | Dynamic data passed when showing |
| `props` | `T['props']` | Static props passed during registration |

### ModalType

Base interface for defining modal types:

```tsx
interface ModalType<D = unknown, P = unknown> {
  data?: D;
  props?: P;
}
```

### ModalProvider

Provider component that manages modal context:

```tsx
interface ModalProviderProps {
  children: React.ReactNode;
}
```

## Migration Guide

### From v1.x to v2.0

1. **TypeScript improvements**: Better type inference, no breaking changes to existing code
2. **Build system**: Updated build output, but API remains the same
3. **Performance**: Automatic optimizations, no code changes needed

### Key Concepts

**hide vs destroy:**
- `hide()`: Hides modal but preserves state and component instance
- `destroy()`: Completely removes modal and cleans up state
- For animated modals: use `hide()` first, then `destroy()` in `afterClose`

**data vs props:**
- `data`: Dynamic data passed each time `show()` is called
- `props`: Static configuration passed once during `useModal()` initialization

## Examples with Popular UI Libraries

### Ant Design

```tsx
import { Modal } from 'antd';
import { ModalProps, ModalType } from 'nice-use-modal';

type AntModalType = ModalType<{ title: string }, { onOk: () => void }>;

const AntModal: React.FC<ModalProps<AntModalType>> = ({ visible, hide, destroy, data, props }) => (
  <Modal
    open={visible}
    title={data?.title}
    onOk={props?.onOk}
    onCancel={hide}
    afterClose={destroy}
  >
    Modal content
  </Modal>
);
```

### Material-UI

```tsx
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { ModalProps, ModalType } from 'nice-use-modal';

type MuiModalType = ModalType<{ title: string }, { onClose: () => void }>;

const MuiModal: React.FC<ModalProps<MuiModalType>> = ({ visible, hide, data, props }) => (
  <Dialog open={visible} onClose={hide}>
    <DialogTitle>{data?.title}</DialogTitle>
    <DialogContent>
      Modal content
    </DialogContent>
  </Dialog>
);
```

## License

MIT
