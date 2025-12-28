import type { ComponentType, ReactNode } from "react";

/**
 * Declares which inputs a modal accepts.
 *
 * `data` is supplied for each `show` call, while `props` is supplied to
 * `useModal` and captured when the modal is shown. Optional fields make the
 * corresponding call argument optional as well.
 */
export interface ModalDefinition {
  data?: unknown;
  props?: unknown;
}

/** Controls injected into every modal component by {@link ModalProvider}. */
export interface ModalControls {
  /** Whether the modal should currently be presented. */
  visible: boolean;
  /** Hides the modal without unmounting it, preserving its local state. */
  hide: () => void;
  /** Unmounts the modal and removes its captured inputs. */
  destroy: () => void;
}

/**
 * Converts a definition field into the matching call signature:
 * absent fields accept no argument, optional fields accept an optional
 * argument, and required fields require one.
 */
export type ModalFieldArguments<
  T extends ModalDefinition,
  K extends keyof ModalDefinition,
> = K extends keyof T ? ({} extends Pick<T, K> ? [value?: T[K]] : [value: T[K]]) : [];

// Only expose inputs explicitly declared by the consumer's definition.
type ModalFields<T extends ModalDefinition> = Pick<T, Extract<keyof T, keyof ModalDefinition>>;

/** Props received by a modal component. */
export type ModalProps<T extends ModalDefinition = {}> = ModalControls & ModalFields<T>;

/** A component that can be managed by {@link useModal}. */
export type ModalComponent<T extends ModalDefinition = {}> = ComponentType<ModalProps<T>>;

/** Controller returned by {@link useModal}. */
export interface ModalResult<T extends ModalDefinition = {}> {
  /** Mounts or re-shows the modal with a fresh `data` snapshot. */
  show: (...args: ModalFieldArguments<T, "data">) => void;
  /** Hides the current modal instance without unmounting it. */
  hide: () => void;
  /** Unmounts the current modal instance. */
  destroy: () => void;
}

/** Props accepted by {@link ModalProvider}. */
export interface ModalProviderProps {
  children: ReactNode;
}
