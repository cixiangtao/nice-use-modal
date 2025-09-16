/*
 * @LastEditTime: 2025-05-19 16:48:47
 * @Description: A React modal hook with TypeScript support
 * @Date: 2023-08-25 17:44:55
 * @Author: @周星星同学
 */
import type { FC, ReactNode } from "react";
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";

/**
 * Generate a random key for modal identification
 */
function getRandomKey(length: number = 6): string {
  const allChars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  while (result.length < length) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    result += allChars.charAt(randomIndex);
  }

  return result;
}

/**
 * Base modal type with generic data and props
 */
export interface ModalType<D = unknown, P = unknown> {
  data?: D;
  props?: P;
}

/**
 * Modal result interface returned by useModal hook
 */
export interface ModalResult<T = unknown> {
  show: (data?: T) => void;
  hide: () => void;
  destroy: () => void;
}

/**
 * Props passed to modal components
 */
export interface ModalProps<T extends ModalType = ModalType> {
  visible: boolean;
  hide: () => void;
  destroy: () => void;
  data?: T["data"];
  props?: T["props"];
}

/**
 * Modal component type
 */
export type ModalComponent<T extends ModalType = ModalType> = FC<ModalProps<T>>;

/**
 * Internal modal state
 */
interface ModalState {
  component: ModalComponent<any>;
  data?: unknown;
  props?: unknown;
  visible: boolean;
}

/**
 * Modal context value type
 */
interface ModalContextValue {
  show: <T extends ModalType>(
    key: string,
    component: ModalComponent<T>,
    data?: T["data"],
    props?: T["props"]
  ) => void;
  hide: (key: string) => void;
  destroy: (key: string) => void;
  modals: Record<string, ModalState>;
}

/**
 * Modal provider props
 */
export interface ModalProviderProps {
  children: ReactNode;
}

/**
 * Modal context
 */
const ModalContext = createContext<ModalContextValue | null>(null);

/**
 * Hook to access modal context (for advanced usage)
 */
export const useModalContext = (): ModalContextValue => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};

/**
 * Modal provider component that manages all modals
 */
export const ModalProvider: FC<ModalProviderProps> = ({ children }) => {
  const [modals, setModals] = useState<Record<string, ModalState>>({});

  const show = useCallback(
    <T extends ModalType>(
      key: string,
      component: ModalComponent<T>,
      data?: T["data"],
      props?: T["props"]
    ) => {
      setModals((prev) => ({
        ...prev,
        [key]: { component, data, props, visible: true },
      }));
    },
    []
  );

  const hide = useCallback((key: string) => {
    setModals((prev) => {
      const modal = prev[key];
      if (!modal) return prev;
      return {
        ...prev,
        [key]: { ...modal, visible: false },
      };
    });
  }, []);

  const destroy = useCallback((key: string) => {
    setModals((prev) => {
      if (!prev[key]) return prev;
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const contextValue = useMemo<ModalContextValue>(
    () => ({
      show,
      hide,
      destroy,
      modals,
    }),
    [show, hide, destroy, modals]
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {Object.entries(modals).map(([key, modal]) => {
        const { component: Component, data, props, visible } = modal;
        return (
          <Component
            key={key}
            visible={visible}
            hide={() => hide(key)}
            destroy={() => destroy(key)}
            data={data}
            props={props}
          />
        );
      })}
    </ModalContext.Provider>
  );
};

/**
 * Custom hook for managing modals
 * @param component - The modal component to render
 * @param props - Static props to pass to the modal component
 * @returns Modal control methods
 */
export function useModal<T extends ModalType>(
  component: ModalComponent<T>,
  props?: T["props"]
): ModalResult<T["data"]> {
  const context = useContext(ModalContext);
  
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  
  const key = useMemo(() => getRandomKey(), []);

  const show = useCallback(
    (data?: T["data"]) => {
      context.show(key, component, data, props);
    },
    [component, key, context, props]
  );

  const hide = useCallback(() => {
    context.hide(key);
  }, [key, context]);

  const destroy = useCallback(() => {
    context.destroy(key);
  }, [key, context]);

  return {
    show,
    hide,
    destroy,
  };
}
