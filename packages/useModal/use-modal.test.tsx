import { act, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vite-plus/test";

import { ModalProvider, type ModalProps, type ModalResult, useModal } from "./index";

interface TestDefinition {
  data?: { label: string };
}

const reactTestGlobal = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT: boolean;
};
reactTestGlobal.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe("useModal", () => {
  it("supports a props-only modal without a data placeholder", () => {
    interface PropsOnlyDefinition {
      props: { message: string };
    }

    let controller!: ModalResult<PropsOnlyDefinition>;

    function PropsOnlyModal({ props }: ModalProps<PropsOnlyDefinition>) {
      return <div>{props.message}</div>;
    }

    function Owner() {
      controller = useModal(PropsOnlyModal, { message: "Props only" });
      return null;
    }

    act(() =>
      root.render(
        <ModalProvider>
          <Owner />
        </ModalProvider>,
      ),
    );
    act(() => controller.show());

    expect(container.textContent).toBe("Props only");
  });

  it("shows, hides, and destroys a modal without remounting it on hide", () => {
    let controller!: ModalResult<TestDefinition>;
    let mounts = 0;

    function TestModal({ data, destroy, hide, visible }: ModalProps<TestDefinition>) {
      const [mount] = useState(() => ++mounts);

      return (
        <div data-mount={mount} data-visible={visible}>
          <span>{data?.label}</span>
          <button onClick={hide}>hide</button>
          <button onClick={destroy}>destroy</button>
        </div>
      );
    }

    function Owner() {
      controller = useModal(TestModal);
      return null;
    }

    act(() =>
      root.render(
        <ModalProvider>
          <Owner />
        </ModalProvider>,
      ),
    );
    act(() => controller.show({ label: "First" }));

    expect(container.textContent).toContain("First");
    expect(container.querySelector("[data-visible='true']")).not.toBeNull();

    act(() => controller.hide());

    expect(container.querySelector("[data-visible='false']")).not.toBeNull();
    expect(mounts).toBe(1);

    act(() => controller.destroy());

    expect(container.textContent).toBe("");
  });

  it("does not re-render the hook owner when modal state changes", () => {
    let controller!: ModalResult<TestDefinition>;
    let ownerRenders = 0;

    function TestModal() {
      return <div>Modal</div>;
    }

    function Owner() {
      ownerRenders += 1;
      controller = useModal(TestModal);
      return null;
    }

    act(() =>
      root.render(
        <ModalProvider>
          <Owner />
        </ModalProvider>,
      ),
    );
    expect(ownerRenders).toBe(1);

    act(() => controller.show({ label: "First" }));
    act(() => controller.hide());
    act(() => controller.destroy());

    expect(ownerRenders).toBe(1);
  });

  it("ignores a stale destroy callback after the modal is shown again", () => {
    let controller!: ModalResult<TestDefinition>;
    const destroyByLabel = new Map<string, () => void>();

    function TestModal({ data, destroy }: ModalProps<TestDefinition>) {
      if (data) {
        destroyByLabel.set(data.label, destroy);
      }

      return <div>{data?.label}</div>;
    }

    function Owner() {
      controller = useModal(TestModal);
      return null;
    }

    act(() =>
      root.render(
        <ModalProvider>
          <Owner />
        </ModalProvider>,
      ),
    );
    act(() => controller.show({ label: "First" }));
    const staleDestroy = destroyByLabel.get("First");

    act(() => controller.hide());
    act(() => controller.show({ label: "Second" }));
    act(() => staleDestroy?.());

    expect(container.textContent).toBe("Second");
  });

  it("destroys the hook-owned modal when its owner unmounts", () => {
    let controller!: ModalResult<TestDefinition>;

    function TestModal() {
      return <div>Owned modal</div>;
    }

    function Owner() {
      controller = useModal(TestModal);
      return null;
    }

    function renderOwner(visible: boolean) {
      act(() => root.render(<ModalProvider>{visible ? <Owner /> : null}</ModalProvider>));
    }

    renderOwner(true);
    act(() => controller.show({ label: "First" }));
    expect(container.textContent).toBe("Owned modal");

    renderOwner(false);
    expect(container.textContent).toBe("");
  });
});
