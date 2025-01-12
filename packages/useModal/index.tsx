import type { FC } from "react";
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { nanoid } from "nanoid";

interface IModel<T = IData> {
  show: (v?: T) => void;
  hide: () => void;
  destroy: () => void;
}

type IData = Record<string, any>;

export interface IProps<T> {
  visible: boolean;
  hide: () => void;
  destroy: () => void;
  data?: T;
}

export type IComponent<T = IData> = FC<IProps<T>>;

/**
 * @description: 用于创建一个上下文
 * @param {*}
 * @return {*}
 */
const Context = createContext<any>(undefined);

/**
 * @description: 用于创建一个模态框
 * @param {FC} modal
 * @return {*}
 */
export function useModal<T = IData>(component: IComponent<T>): IModel<T> {
  const context = useContext(Context);
  const key = useMemo(() => nanoid(6), []);

  const show = useCallback(
    (v?: T) => {
      context?.show(key, component, v);
    },
    [component, key, context]
  );

  const hide = useCallback(() => {
    context?.hide(key);
  }, [key, context]);

  const destroy = useCallback(() => {
    context?.destroy(key);
  }, [key, context]);

  return {
    show,
    hide,
    destroy,
  };
}

/**
 * @description: 用于创建一个模态框
 * @param {FC} modal
 * @return {*}
 */
export const ModalProvider: FC<any> = ({ children }) => {
  const [modals, setModals] = useState<
    Record<string, { component: IComponent; data?: IData; visible: boolean }>
  >({});

  const show = (key: string, component: IComponent, data?: IData) => {
    setModals((prev) => {
      return {
        ...prev,
        [key]: { component, data, visible: true },
      };
    });
  };

  const hide = (key: string) => {
    const modal = modals[key];
    if (!modal) return;
    setModals((prev) => {
      return {
        ...prev,
        [key]: { ...prev[key], visible: false },
      };
    });
  };

  const destroy = (key: string) => {
    setModals((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  return (
    <Context.Provider
      value={{
        show,
        hide,
        destroy,
      }}
    >
      {children}
      {Object.keys(modals).map((key) => {
        const { component: Component, data, visible } = modals[key];
        return (
          <Component
            key={key}
            visible={visible}
            hide={() => hide(key)}
            destroy={() => destroy(key)}
            data={data}
          />
        );
      })}
    </Context.Provider>
  );
};
