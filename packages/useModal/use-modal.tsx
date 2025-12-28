import { createElement, useCallback, useEffect, useId, useMemo, useRef } from "react";

import { useModalActions } from "./modal-context";
import type {
  ModalComponent,
  ModalDefinition,
  ModalFieldArguments,
  ModalProps,
  ModalResult,
} from "./types";

/**
 * Creates an imperative controller for a modal component.
 *
 * The component is mounted lazily on `show`. Hiding preserves its component
 * state; destroying it, or unmounting the hook owner, removes it entirely.
 */
export function useModal<T extends ModalDefinition = {}>(
  component: ModalComponent<T>,
  ...propsArguments: ModalFieldArguments<T, "props">
): ModalResult<T> {
  const actions = useModalActions();
  // useId provides a stable, SSR-safe identity for this hook instance.
  const key = useId();
  // Each show starts a new generation so callbacks from old renders become harmless.
  const revisionRef = useRef(0);
  const props = propsArguments[0];

  const show = useCallback(
    (...dataArguments: ModalFieldArguments<T, "data">) => {
      const data = dataArguments[0];
      const revision = ++revisionRef.current;

      // Capture data and props at show time: an open modal is intentionally not
      // updated reactively when the hook owner's arguments later change.
      actions.show(key, revision, (controls) =>
        createElement(component, {
          ...controls,
          data,
          props,
        } as unknown as ModalProps<T>),
      );
    },
    [actions, component, key, props],
  );

  const hide = useCallback(() => {
    actions.hide(key, revisionRef.current);
  }, [actions, key]);

  const destroy = useCallback(() => {
    actions.destroy(key, revisionRef.current);
  }, [actions, key]);

  useEffect(
    () => () => {
      // No revision check here: owner cleanup must remove whichever generation is current.
      actions.destroy(key);
    },
    [actions, key],
  );

  return useMemo(() => ({ destroy, hide, show }), [destroy, hide, show]);
}
