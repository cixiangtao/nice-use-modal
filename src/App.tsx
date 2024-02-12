import { Button, Space, Divider } from "antd";
import useModal from "./MyModal2";

export default () => {
  const modal = useModal();
  const modal2 = useModal();

  return (
    <div>
      <Space>
        <Button
          onClick={() => {
            modal.show();
          }}
        >
          新建Modal
        </Button>
        <Button
          onClick={() => {
            modal.show({ title: "编辑" });
          }}
        >
          编辑Modal
        </Button>
        <Button
          onClick={() => {
            modal.destroy();
          }}
        >
          删除Modal
        </Button>
      </Space>
      <Divider />
      <Space>
        <Button
          onClick={() => {
            modal2.show();
          }}
        >
          新建Modal2
        </Button>
        <Button
          onClick={() => {
            modal2.show({ title: "编辑" });
          }}
        >
          编辑Modal2
        </Button>
        <Button
          onClick={() => {
            modal2.destroy();
          }}
        >
          删除Modal2
        </Button>
      </Space>
    </div>
  );
};
