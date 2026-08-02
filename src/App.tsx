import { useCallback, useRef, useState } from "react";

import { useModal } from "../packages/useModal";
import DemoModal from "./MyModal";

import "./app.css";

const INSTALL_COMMAND = "pnpm add nice-use-modal";

const MODAL_EXAMPLES = {
  create: {
    description: "Start with a blank canvas. Your draft survives a regular close.",
    eyebrow: "New workspace",
    id: "new-project",
    initialName: "",
    title: "Create a project",
  },
  edit: {
    description: "Runtime data flows in when show() is called—without owner state.",
    eyebrow: "Project settings",
    id: "atlas-project",
    initialName: "Atlas launch",
    title: "Rename project",
  },
} as const;

const CODE_SAMPLE = `const projectModal = useModal(ProjectModal, {
  onSubmit: saveProject,
});

projectModal.show({
  id: "atlas-project",
  title: "Rename project",
  initialName: "Atlas launch",
});`;

type CopyTarget = "code" | "install";
type ModalExample = (typeof MODAL_EXAMPLES)[keyof typeof MODAL_EXAMPLES];
type ModalStatus = "destroyed" | "hidden" | "visible";

interface LifecycleEvent {
  action: string;
  detail: string;
  id: number;
  status: ModalStatus | "ready";
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path d="M4 10h11M11 5l5 5-5 5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path d="m4 10 4 4 8-8" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <rect height="10" rx="1.5" width="10" x="7" y="7" />
      <path d="M4 13H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.88c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.64.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.82a9.6 9.6 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

function StatusDot({ tone }: { tone: "amber" | "blue" | "muted" }) {
  return <i aria-hidden="true" className={`status-dot is-${tone}`} />;
}

export default function App() {
  const [activeExample, setActiveExample] = useState<ModalExample>(MODAL_EXAMPLES.edit);
  const [copiedTarget, setCopiedTarget] = useState<CopyTarget | null>(null);
  const [draftName, setDraftName] = useState("");
  const [modalStatus, setModalStatus] = useState<ModalStatus>("destroyed");
  const [events, setEvents] = useState<LifecycleEvent[]>([
    {
      action: "provider",
      detail: "Ready for show()",
      id: 0,
      status: "ready",
    },
  ]);
  const eventSequence = useRef(0);

  const recordEvent = useCallback(
    (action: string, detail: string, status: LifecycleEvent["status"]) => {
      eventSequence.current += 1;
      setEvents((current) =>
        [{ action, detail, id: eventSequence.current, status }, ...current].slice(0, 5),
      );
    },
    [],
  );

  const handleLifecycleChange = useCallback(
    (nextStatus: "destroyed" | "hidden") => {
      setModalStatus(nextStatus);
      if (nextStatus === "destroyed") setDraftName("");
      recordEvent(
        nextStatus === "hidden" ? "hide()" : "destroy()",
        nextStatus === "hidden" ? "Draft state preserved" : "Component unmounted",
        nextStatus,
      );
    },
    [recordEvent],
  );

  const handleSubmit = useCallback(
    (name: string) => {
      setDraftName(name);
      setModalStatus("hidden");
      recordEvent("submit", `Saved “${name}”; modal hidden`, "hidden");
    },
    [recordEvent],
  );

  const modal = useModal(DemoModal, {
    onDraftChange: setDraftName,
    onLifecycleChange: handleLifecycleChange,
    onSubmit: handleSubmit,
  });

  const showExample = (example: ModalExample) => {
    const keepsExistingDraft = modalStatus === "hidden" && activeExample.id === example.id;

    setActiveExample(example);
    if (!keepsExistingDraft) setDraftName(example.initialName);
    modal.show(example);
    setModalStatus("visible");
    recordEvent(
      "show()",
      keepsExistingDraft ? "Mounted draft shown again" : `Runtime data: ${example.id}`,
      "visible",
    );
  };

  const hideModal = () => {
    modal.hide();
    setModalStatus("hidden");
    recordEvent("hide()", "Draft state preserved", "hidden");
  };

  const destroyModal = () => {
    modal.destroy();
    setDraftName("");
    setModalStatus("destroyed");
    recordEvent("destroy()", "Component unmounted", "destroyed");
  };

  const copyText = async (value: string, target: CopyTarget) => {
    await navigator.clipboard.writeText(value);
    setCopiedTarget(target);
    window.setTimeout(() => setCopiedTarget(null), 1800);
  };

  const isMounted = modalStatus !== "destroyed";
  const isVisible = modalStatus === "visible";
  const draftValue = isMounted ? draftName || "Empty draft" : "Released";

  return (
    <div className="site-shell">
      <header className="site-header">
        <a aria-label="nice-use-modal home" className="brand" href="#top">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span>nice-use-modal</span>
        </a>

        <nav aria-label="Primary navigation">
          <a href="#playground">Playground</a>
          <a href="#lifecycle">Lifecycle</a>
          <a href="https://www.npmjs.com/package/nice-use-modal" rel="noreferrer" target="_blank">
            npm
          </a>
        </nav>

        <a
          aria-label="View nice-use-modal on GitHub"
          className="github-link"
          href="https://github.com/cixiangtao/nice-use-modal"
          rel="noreferrer"
          target="_blank"
        >
          <GithubIcon />
          <span>GitHub</span>
        </a>
      </header>

      <main id="top">
        <section className="hero-workbench" id="playground">
          <div className="hero-copy">
            <h1>
              Open it. Hide it.
              <br />
              <span>Bring the draft back.</span>
            </h1>
            <p className="hero-lede">
              See exactly what happens on <code>show()</code>, <code>hide()</code>, and{" "}
              <code>destroy()</code>. Keep drafts safe, control visibility, and clean up with
              confidence.
            </p>

            <div className="install-control">
              <code>{INSTALL_COMMAND}</code>
              <button
                aria-label="Copy install command"
                onClick={() => copyText(INSTALL_COMMAND, "install")}
                type="button"
              >
                {copiedTarget === "install" ? <CheckIcon /> : <CopyIcon />}
                <span aria-live="polite">{copiedTarget === "install" ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <div className="hero-actions">
              <button
                className="primary-action"
                onClick={() => showExample(MODAL_EXAMPLES.edit)}
                type="button"
              >
                Run show() <ArrowIcon />
              </button>
              <a
                className="secondary-action"
                href="https://github.com/cixiangtao/nice-use-modal"
                rel="noreferrer"
                target="_blank"
              >
                <GithubIcon /> GitHub
              </a>
            </div>
          </div>

          <div className="inspector-shell">
            <div className="instrument-toolbar">
              <div>
                <span className="instrument-mark" aria-hidden="true" />
                Live modal specimen
              </div>
              <span className={`live-status is-${modalStatus}`}>
                <StatusDot tone={isVisible ? "blue" : isMounted ? "amber" : "muted"} />
                {modalStatus}
              </span>
            </div>

            <div className="inspector-grid">
              <div className="specimen-stage">
                <div className="stage-ruler" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className={`specimen-card is-${modalStatus}`}>
                  <div className="specimen-topline">
                    <span>{activeExample.eyebrow}</span>
                    <span aria-hidden="true">×</span>
                  </div>
                  <h2>{activeExample.title}</h2>
                  <p>{activeExample.description}</p>
                  <label>
                    Project name
                    <input
                      aria-label="Preview project name"
                      readOnly
                      value={isMounted ? draftName : activeExample.initialName}
                    />
                  </label>
                  <div className="specimen-actions">
                    <span>Close</span>
                    <button onClick={() => showExample(activeExample)} type="button">
                      Open live modal
                    </button>
                  </div>
                </div>
                {modalStatus === "destroyed" && (
                  <p className="preview-note">Preview · component is not mounted yet</p>
                )}
              </div>

              <aside className="telemetry-panel" aria-label="Live modal telemetry">
                <div className="telemetry-heading">
                  <span>Runtime telemetry</span>
                  <span aria-hidden="true">LIVE</span>
                </div>
                <dl>
                  <div>
                    <dt>
                      <StatusDot tone={isMounted ? "blue" : "muted"} /> mounted
                    </dt>
                    <dd>{String(isMounted)}</dd>
                  </div>
                  <div>
                    <dt>
                      <StatusDot tone={isVisible ? "blue" : "muted"} /> visible
                    </dt>
                    <dd>{String(isVisible)}</dd>
                  </div>
                  <div>
                    <dt>
                      <StatusDot tone={modalStatus === "hidden" ? "amber" : "muted"} /> draft
                    </dt>
                    <dd className={modalStatus === "hidden" ? "is-preserved" : ""}>{draftValue}</dd>
                  </div>
                  <div>
                    <dt>runtime data</dt>
                    <dd>{isMounted ? activeExample.id : "—"}</dd>
                  </div>
                </dl>
                <p className="telemetry-note">
                  {modalStatus === "destroyed" && "show() will mount the component on demand."}
                  {modalStatus === "visible" && "The component is mounted and visible."}
                  {modalStatus === "hidden" && "The component remains mounted with its draft."}
                </p>
              </aside>
            </div>

            <div className="controller-strip" aria-label="Modal lifecycle controls">
              <span>Controller</span>
              <button onClick={() => showExample(activeExample)} type="button">
                show()
              </button>
              <button disabled={!isVisible} onClick={hideModal} type="button">
                hide()
              </button>
              <button disabled={!isMounted} onClick={destroyModal} type="button">
                destroy()
              </button>
            </div>
          </div>
        </section>

        <section className="proof-workbench" aria-label="Lifecycle proof">
          <div className="event-trace">
            <div className="workbench-heading">
              <div>
                <h2>Lifecycle event trace</h2>
                <p>Every row comes from the controller you just used.</p>
              </div>
              <span>
                {events.length} event{events.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="trace-table" aria-live="polite">
              <div className="trace-row trace-header" aria-hidden="true">
                <span>#</span>
                <span>Event</span>
                <span>Detail</span>
                <span>State</span>
              </div>
              {events.map((event) => (
                <div className="trace-row" key={event.id}>
                  <span>{String(event.id).padStart(2, "0")}</span>
                  <code>{event.action}</code>
                  <span>{event.detail}</span>
                  <span className={`trace-state is-${event.status}`}>{event.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="code-proof">
            <div className="workbench-heading">
              <div>
                <h2>The whole owner API</h2>
                <p>Runtime data enters only when the modal opens.</p>
              </div>
              <button onClick={() => copyText(CODE_SAMPLE, "code")} type="button">
                {copiedTarget === "code" ? <CheckIcon /> : <CopyIcon />}
                <span aria-live="polite">{copiedTarget === "code" ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <pre aria-label="nice-use-modal usage example">
              <code>{CODE_SAMPLE}</code>
            </pre>
          </div>
        </section>

        <section className="lifecycle-section" id="lifecycle">
          <div className="lifecycle-intro">
            <h2>Three actions. No mirrored visibility state.</h2>
            <p>
              The controller says exactly what happens next, so ownership stays obvious in the
              component tree.
            </p>
          </div>

          <div className="lifecycle-flow">
            <article>
              <span>1</span>
              <code>show(data?)</code>
              <h3>Mount and reveal</h3>
              <p>Create the modal lazily with a fresh, fully typed data snapshot.</p>
            </article>
            <article>
              <span>2</span>
              <code>hide()</code>
              <h3>Close, keep state</h3>
              <p>Make it invisible while preserving form values and local component state.</p>
            </article>
            <article>
              <span>3</span>
              <code>destroy()</code>
              <h3>Unmount, reset</h3>
              <p>Remove the component completely and release every captured input.</p>
            </article>
          </div>
        </section>

        <section className="closing-section">
          <div>
            <h2>Put the lifecycle in one hook.</h2>
            <p>Install the package, wrap your app once, and keep modal state where it belongs.</p>
          </div>
          <div className="closing-actions">
            <button
              className="light-action"
              onClick={() => copyText(INSTALL_COMMAND, "install")}
              type="button"
            >
              {copiedTarget === "install" ? "Copied" : INSTALL_COMMAND}
              <CopyIcon />
            </button>
            <a href="https://github.com/cixiangtao/nice-use-modal" rel="noreferrer" target="_blank">
              View on GitHub <ArrowIcon />
            </a>
          </div>
        </section>
      </main>

      <footer>
        <div className="brand footer-brand">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span>nice-use-modal</span>
        </div>
        <p>Type-safe, headless modal control for React.</p>
        <span>MIT licensed</span>
      </footer>
    </div>
  );
}
