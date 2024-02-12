/*
 * @LastEditTime: 2023-08-08 17:11:35
 * @Description:
 * @Date: 2023-08-07 18:27:39
 * @Author: @周星星同学
 */
import { Modal, Button } from "antd";
import { useModal } from "./hooks/useModel";
import { useState, useEffect } from "react";

interface IData {
  title?: string;
}

export default () =>
  useModal<IData>(({ visible, hide, destroy, data = {} }) => {
    const { title = "新建" } = data;

    const [count, setCount] = useState(0);

    return (
      <Modal
        title={title}
        onOk={() => hide()}
        open={visible}
        onCancel={() => hide()}
        // afterClose={() => destroy()}
      >
        Hello World!
        <Button
          onClick={() => {
            setCount((prev) => prev + 1);
          }}
        >
          add
        </Button>
        <div>{count}</div>
        <Button
          onClick={() => {
            setCount((prev) => prev - 1);
          }}
        >
          minus
        </Button>
      </Modal>
    );
  });
