import React, { useEffect } from "react";
import { Button, Space, message, Divider } from "antd";
import { useModal } from "../packages/useModal";
import MyModal from "./MyModal";
import { useMyModal } from "./use/useMyModal";

export default () => {
  const { show, hide, destroy } = useModal(MyModal, {
    onOk: () => {
      message.info("点击了确定");
      hide();
    },
    onCancel: () => {
      message.info("点击了取消");
    },
  });

  const myModal = useMyModal({
    onOk: () => {
      message.info("点击了确定");
      hide();
    },
    onCancel: () => {
      message.info("点击了取消");
    },
  });

  const [count, setCount] = React.useState(0);
  const increment = () => setCount(count + 1);

  useEffect(() => {
    increment();
    console.log("app");
  }, []);

  return (
    <>
      <p>{count}</p>
      {/* <MyModal /> */} {/* 无需再手动注册组件 */}
      <Divider children="useModal" />
      <Space>
        <Button
          onClick={() => {
            show();
          }}
        >
          新建
        </Button>
        <Button
          onClick={() =>
            show({
              title: "编辑",
              desc: "你可以实时传入data，以供组件内部使用",
            })
          }
        >
          编辑
        </Button>
        <Button onClick={() => destroy()}>销毁</Button>
      </Space>
      <Divider children="useMyModal" />
      <Space>
        <Button
          onClick={() => {
            myModal.show();
          }}
        >
          新建
        </Button>
        <Button
          onClick={() =>
            myModal.show({
              title: "编辑",
              desc: "你可以实时传入data，以供组件内部使用",
            })
          }
        >
          编辑
        </Button>
        <Button onClick={() => myModal.destroy()}>销毁</Button>
      </Space>
    </>
  );
};
