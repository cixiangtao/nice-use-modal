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
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(data.initialName);
  }, [data.id, data.initialName]);

  useEffect(() => {
    if (!visible) return;

    inputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        hide();
        props.onLifecycleChange("hidden");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [hide, props, visible]);

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
    >
      <form
        aria-labelledby={titleId}
        aria-modal="true"
        className="demo-modal"
        onSubmit={submit}
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
            onChange={(event) => setName(event.target.value)}
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
