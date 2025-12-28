import type { ReactNode } from "react";
import { createContext, memo, useCallback, useContext, useMemo, useState } from "react";

import type { ModalControls, ModalProviderProps } from "./types";

// The render closure captures the component plus the data/props snapshot from show().
type ModalRender = (controls: ModalControls) => ReactNode;

interface ModalEntry {
  render: ModalRender;
  // Identifies the latest show() call for this hook-owned modal.
  revision: number;
  visible: boolean;
}

interface ModalActions {
  show: (key: string, revision: number, render: ModalRender) => void;
  hide: (key: string, revision: number) => void;
  destroy: (key: string, revision?: number) => void;
}

interface ModalHostProps {
  destroyModal: ModalActions["destroy"];
  entry: ModalEntry;
  hideModal: ModalActions["hide"];
  modalKey: string;
}

// Keep modal state out of context so state changes do not re-render hook owners.
const ModalActionsContext = createContext<ModalActions | null>(null);

// Memoization also prevents an unchanged modal from re-rendering when another entry changes.
const ModalHost = memo(function ModalHost({
  destroyModal,
  entry,
  hideModal,
  modalKey,
}: ModalHostProps) {
  const { render, revision, visible } = entry;
  const hide = useCallback(() => hideModal(modalKey, revision), [hideModal, modalKey, revision]);
  const destroy = useCallback(
    () => destroyModal(modalKey, revision),
    [destroyModal, modalKey, revision],
  );

  return render({ destroy, hide, visible });
});

export function useModalActions(): ModalActions {
  const actions = useContext(ModalActionsContext);

  if (!actions) {
    // Fail at the call site instead of silently creating a modal with no render host.
    throw new Error("useModal must be used within a ModalProvider");
  }

  return actions;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modals, setModals] = useState<Record<string, ModalEntry>>({});

  const show = useCallback<ModalActions["show"]>((key, revision, render) => {
    // Reusing the hook key replaces the previous generation with the latest snapshot.
    setModals((current) => ({
      ...current,
      [key]: { render, revision, visible: true },
    }));
  }, []);

  const hide = useCallback<ModalActions["hide"]>((key, revision) => {
    setModals((current) => {
      const modal = current[key];

      // A callback captured by an older render must not hide a newer generation.
      if (!modal || modal.revision !== revision || !modal.visible) {
        return current;
      }

      return {
        ...current,
        [key]: { ...modal, visible: false },
      };
    });
  }, []);

  const destroy = useCallback<ModalActions["destroy"]>((key, revision) => {
    setModals((current) => {
      const modal = current[key];

      // Omitting revision is reserved for owner-unmount cleanup, which removes any generation.
      if (!modal || (revision !== undefined && modal.revision !== revision)) {
        return current;
      }

      const next = { ...current };
      delete next[key];
      return next;
    });
  }, []);

  const actions = useMemo<ModalActions>(() => ({ destroy, hide, show }), [destroy, hide, show]);

  return (
    <ModalActionsContext.Provider value={actions}>
      {children}
      {Object.entries(modals).map(([key, entry]) => (
        <ModalHost destroyModal={destroy} entry={entry} hideModal={hide} key={key} modalKey={key} />
      ))}
    </ModalActionsContext.Provider>
  );
}
