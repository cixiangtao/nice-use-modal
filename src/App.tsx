import { useCallback, useState } from "react";

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

type ModalStatus = "destroyed" | "hidden" | "visible";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path d="M4 10h11M11 5l5 5-5 5" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <rect height="10" rx="2" width="10" x="7" y="7" />
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

export default function App() {
  const [copied, setCopied] = useState(false);
  const [modalStatus, setModalStatus] = useState<ModalStatus>("destroyed");
  const [events, setEvents] = useState(["Provider ready — waiting for show()"]);

  const recordEvent = useCallback((event: string) => {
    setEvents((current) => [event, ...current].slice(0, 3));
  }, []);

  const modal = useModal(DemoModal, {
    onLifecycleChange: (nextStatus) => {
      setModalStatus(nextStatus);
      recordEvent(
        nextStatus === "hidden"
          ? "hide() → draft state preserved"
          : "destroy() → component unmounted",
      );
    },
    onSubmit: (name) => {
      setModalStatus("hidden");
      recordEvent(`Saved “${name}” → modal hidden`);
    },
  });

  const showExample = (example: (typeof MODAL_EXAMPLES)[keyof typeof MODAL_EXAMPLES]) => {
    modal.show(example);
    setModalStatus("visible");
    recordEvent(`show() → mounted with “${example.title}”`);
  };

  const hideModal = () => {
    modal.hide();
    setModalStatus("hidden");
    recordEvent("hide() → draft state preserved");
  };

  const destroyModal = () => {
    modal.destroy();
    setModalStatus("destroyed");
    recordEvent("destroy() → component unmounted");
  };

  const copyInstallCommand = async () => {
    await navigator.clipboard.writeText(INSTALL_COMMAND);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

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
        <section className="hero-section">
          <div className="hero-copy">
            <div className="release-pill">
              <span />
              v3.0 · React 18 &amp; 19
            </div>
            <h1>
              Modals,
              <br />
              <em>without the mess.</em>
            </h1>
            <p className="hero-lede">
              A tiny, type-safe controller for opening React modals imperatively—while keeping
              context, lifecycle, and state exactly where they belong.
            </p>

            <div className="install-row">
              <code>
                <span>$</span> {INSTALL_COMMAND}
              </code>
              <button onClick={copyInstallCommand} type="button">
                <CopyIcon />
                <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <div className="hero-notes" aria-label="Package benefits">
              <span>1.1 kB min+gzip</span>
              <span>Zero UI opinions</span>
              <span>Full type inference</span>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="floating-code code-show">
              <span>01</span>
              <code>modal.show(data)</code>
            </div>
            <div className="floating-code code-hide">
              <span>02</span>
              <code>modal.hide()</code>
            </div>
            <div className="floating-code code-destroy">
              <span>03</span>
              <code>modal.destroy()</code>
            </div>
            <div className="hero-modal-card">
              <div className="mini-window-bar">
                <i />
                <i />
                <i />
              </div>
              <div className="mini-modal-body">
                <span className="mini-eyebrow">PROJECT SETTINGS</span>
                <strong>Ship the thing?</strong>
                <div className="mini-input">Atlas launch</div>
                <div className="mini-actions">
                  <span>Cancel</span>
                  <span>Ship it →</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="playground-section" id="playground">
          <div className="section-heading">
            <div>
              <span className="kicker">01 / TRY IT</span>
              <h2>One hook. Three deliberate actions.</h2>
            </div>
            <p>
              No mirrored <code>visible</code> state. No ref plumbing. The component only exists
              after you ask for it.
            </p>
          </div>

          <div className="playground-grid">
            <div className="demo-panel">
              <div className="panel-toolbar">
                <div className="window-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                <span>modal-playground.tsx</span>
                <span className={`status-badge is-${modalStatus}`}>
                  <i /> {modalStatus}
                </span>
              </div>

              <div className="demo-content">
                <div className="demo-intro">
                  <span>INTERACTIVE DEMO</span>
                  <h3>Open it. Type something. Hide it. Open it again.</h3>
                  <p>
                    Your draft stays after <code>hide()</code>. Use <code>destroy()</code> and it
                    starts fresh.
                  </p>
                </div>

                <div className="demo-actions">
                  <button
                    className="primary-action"
                    onClick={() => showExample(MODAL_EXAMPLES.create)}
                    type="button"
                  >
                    Create project <ArrowIcon />
                  </button>
                  <button
                    className="secondary-action"
                    onClick={() => showExample(MODAL_EXAMPLES.edit)}
                    type="button"
                  >
                    Edit “Atlas launch”
                  </button>
                </div>

                <div className="controller-row">
                  <span>CONTROLLER</span>
                  <button disabled={modalStatus !== "visible"} onClick={hideModal} type="button">
                    hide()
                  </button>
                  <button
                    disabled={modalStatus === "destroyed"}
                    onClick={destroyModal}
                    type="button"
                  >
                    destroy()
                  </button>
                </div>
              </div>
            </div>

            <aside className="event-panel">
              <div className="event-panel-heading">
                <span>LIVE LIFECYCLE</span>
                <i className={modalStatus === "visible" ? "is-live" : ""} />
              </div>
              <div className="event-log" aria-live="polite">
                {events.map((event, index) => (
                  <div
                    className={index === 0 ? "event-item is-current" : "event-item"}
                    key={`${event}-${index}`}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{event}</p>
                  </div>
                ))}
              </div>
              <div className="state-map">
                <div className={modalStatus === "destroyed" ? "is-active" : ""}>
                  <span /> unmounted
                </div>
                <i>→</i>
                <div className={modalStatus === "visible" ? "is-active" : ""}>
                  <span /> visible
                </div>
                <i>→</i>
                <div className={modalStatus === "hidden" ? "is-active" : ""}>
                  <span /> hidden
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="lifecycle-section" id="lifecycle">
          <div className="section-heading compact">
            <div>
              <span className="kicker">02 / THE CONTRACT</span>
              <h2>Lifecycle you can reason about.</h2>
            </div>
          </div>

          <div className="lifecycle-grid">
            <article>
              <span className="step-number">01</span>
              <code>show(data?)</code>
              <h3>Mount on demand</h3>
              <p>The modal is created lazily with a fresh, fully typed data snapshot.</p>
            </article>
            <article>
              <span className="step-number">02</span>
              <code>hide()</code>
              <h3>Close, keep state</h3>
              <p>Make it invisible while preserving form values and local component state.</p>
            </article>
            <article>
              <span className="step-number">03</span>
              <code>destroy()</code>
              <h3>Unmount, reset</h3>
              <p>Remove the component completely and discard every captured input.</p>
            </article>
            <article className="provider-card">
              <span className="step-number">+</span>
              <code>&lt;ModalProvider&gt;</code>
              <h3>Context stays intact</h3>
              <p>Theme, locale, router, and your application context remain available.</p>
            </article>
          </div>
        </section>

        <section className="code-section">
          <div className="code-copy">
            <span className="kicker">03 / THAT’S REALLY IT</span>
            <h2>Typed at the edges. Quiet everywhere else.</h2>
            <p>
              Define runtime <code>data</code> on the modal and owner <code>props</code> on the
              hook. TypeScript derives the rest.
            </p>
            <a href="https://github.com/cixiangtao/nice-use-modal" rel="noreferrer" target="_blank">
              Read the documentation <ArrowIcon />
            </a>
          </div>
          <pre aria-label="nice-use-modal usage example">
            <div className="code-window-bar">
              <span>App.tsx</span>
              <span>TSX</span>
            </div>
            <code>{CODE_SAMPLE}</code>
          </pre>
        </section>
      </main>

      <footer>
        <div className="brand footer-brand">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span>nice-use-modal</span>
        </div>
        <p>Small API. Predictable modals. MIT licensed.</p>
        <span>Made for React.</span>
      </footer>
    </div>
  );
}
