import React, { useEffect } from "react";
import { Modal, message } from "antd";
import { ModalProps, ModalType } from "../packages/useModal";

interface MyModalData {
  title?: string;
  desc?: string;
}

interface MyModalProps {
  onOk: () => void;
  onCancel?: () => void;
}

type MyModalType = ModalType<MyModalData, MyModalProps>;

export default (p: ModalProps<MyModalType>) => {
  const { visible, hide, destroy, data = {}, props } = p;

  const { title = "新建", desc = "Hello World!" } = data;
  const { onOk, onCancel } = props || {};

  useEffect(() => {
    // message.info("执行show方法才会注册组件");
  }, []);

  return (
    <Modal
      title={title}
      onOk={() => {
        onOk?.();
      }}
      open={visible}
      onCancel={() => {
        onCancel?.();
      }}
      afterClose={() => destroy()} // 对于有关闭动画的组件，需要在动画结束后再选择销毁组件，这样可以保留动画效果
    >
      {desc}
    </Modal>
  );
};
