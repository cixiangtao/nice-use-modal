import { Modal } from "antd";

import type { ModalProps } from "../packages/useModal";

interface MyModalData {
  title?: string;
  desc?: string;
}

interface MyModalProps {
  onOk: () => void;
  onCancel?: () => void;
}

interface MyModalDefinition {
  data?: MyModalData;
  props: MyModalProps;
}

export default function MyModal({
  visible,
  hide,
  destroy,
  data = {},
  props,
}: ModalProps<MyModalDefinition>) {
  const { title = "新建", desc = "Hello World!" } = data;
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
      // 先通过 hide 播放关闭动画，再在动画结束后销毁组件并清理状态。
      afterClose={() => destroy()}
    >
      {desc}
    </Modal>
  );
}
