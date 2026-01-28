import { Modal } from "antd";

import { useModal } from "~/packages/useModal";
import type { ModalProps } from "~/packages/useModal";

interface MyModalData {
  title?: string;
  desc?: string;
}

interface MyModalProps {
  onOk: () => void;
  onCancel?: () => void;
}

function MyModal({
  visible,
  hide,
  destroy,
  data,
  props,
}: ModalProps<{ data?: MyModalData; props: MyModalProps }>) {
  const { title = "新建", desc = "Hello World!" } = data || {};
  const { onOk, onCancel } = props;

  return (
    <Modal
      title={title}
      onOk={() => {
        onOk();
        hide();
      }}
      open={visible}
      onCancel={() => {
        onCancel?.();
        hide();
      }}
      // 延迟到关闭动画结束后销毁，避免组件提前卸载导致动画被截断。
      afterClose={() => destroy()}
    >
      <h2>{title}</h2>
      <p>{desc}</p>
    </Modal>
  );
}

export const useMyModal = (props: MyModalProps) => useModal(MyModal, props);
