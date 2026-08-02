import { useEffect, useId, useRef, useState } from "react";

import type { ModalProps } from "../packages/useModal";

interface DemoModalData {
  description: string;
  eyebrow: string;
  id: string;
  initialName: string;
  title: string;
}

interface DemoModalOwnerProps {
  onDraftChange: (name: string) => void;
  onLifecycleChange: (status: "destroyed" | "hidden") => void;
  onSubmit: (name: string) => void;
}

interface DemoModalDefinition {
  data: DemoModalData;
  props: DemoModalOwnerProps;
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path d="m4 4 12 12M16 4 4 16" />
    </svg>
  );
}

export default function DemoModal({
  data,
  destroy,
  hide,
  props,
  visible,
}: ModalProps<DemoModalDefinition>) {
  const [name, setName] = useState(data.initialName);
  const dialogRef = useRef<HTMLFormElement>(null);
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const { onDraftChange, onLifecycleChange } = props;

  useEffect(() => {
    setName(data.initialName);
    onDraftChange(data.initialName);
  }, [data.id, data.initialName, onDraftChange]);

  useEffect(() => {
    layerRef.current?.toggleAttribute("inert", !visible);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    inputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        hide();
        onLifecycleChange("hidden");
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocusedRef.current?.isConnected) previouslyFocusedRef.current.focus();
    };
  }, [hide, onLifecycleChange, visible]);

  const closeAndPreserve = () => {
    hide();
    props.onLifecycleChange("hidden");
  };

  const closeAndReset = () => {
    hide();
    window.setTimeout(() => {
      destroy();
      props.onLifecycleChange("destroyed");
    }, 220);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextName = name.trim();

    if (!nextName) {
      inputRef.current?.focus();
      return;
    }

    props.onSubmit(nextName);
    hide();
  };

  return (
    <div
      aria-hidden={!visible}
      className="modal-layer"
      data-visible={visible}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeAndPreserve();
      }}
      ref={layerRef}
    >
      <form
        aria-labelledby={titleId}
        aria-modal="true"
        className="demo-modal"
        onSubmit={submit}
        ref={dialogRef}
        role="dialog"
      >
        <div className="modal-topline">
          <span>{data.eyebrow}</span>
          <button aria-label="Close and preserve draft" onClick={closeAndPreserve} type="button">
            <CloseIcon />
          </button>
        </div>

        <div className="modal-heading">
          <span className="modal-index">/ 01</span>
          <div>
            <h2 id={titleId}>{data.title}</h2>
            <p>{data.description}</p>
          </div>
        </div>

        <label htmlFor={`${titleId}-name`}>
          Project name
          <input
            autoComplete="off"
            id={`${titleId}-name`}
            onChange={(event) => {
              setName(event.target.value);
              props.onDraftChange(event.target.value);
            }}
            placeholder="e.g. Midnight release"
            ref={inputRef}
            value={name}
          />
        </label>

        <div className="modal-hint">
          <span>TIP</span>
          Close and reopen this modal—your draft will still be here.
        </div>

        <div className="modal-actions">
          <button className="reset-button" onClick={closeAndReset} type="button">
            Close &amp; reset
          </button>
          <button className="save-button" type="submit">
            Save project <span>→</span>
          </button>
        </div>
      </form>
    </div>
  );
}
