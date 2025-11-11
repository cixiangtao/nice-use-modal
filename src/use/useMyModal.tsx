import { Modal } from "antd";

import { useModal, ModalProps, ModalType } from "~/packages/useModal";

interface Data {
  title?: string;
  desc?: string;
}

interface Props {
  onOk: () => void;
  onCancel?: () => void;
}

function MyModal({
  visible,
  hide,
  destroy,
  data,
  props,
}: ModalProps<{
  data: Data;
  props: Props;
}>) {
  const { title = "新建", desc = "Hello World!" } = data || {};
  const { onOk, onCancel } = props || {};

  return (
    <Modal
      title={title}
      onOk={() => {
        onOk?.();
      }}
      open={visible}
      onCancel={() => {
        onCancel?.();
        hide();
      }}
      afterClose={() => destroy()}
    >
      <h2>{title}</h2>
      <p>{desc}</p>
    </Modal>
  );
}

export const useMyModal = (props: Props) => useModal(MyModal, props);
