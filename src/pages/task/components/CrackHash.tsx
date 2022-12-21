import React from 'react';
import { Modal, Form, Input, InputNumber, message, Button } from 'antd';
import { confirm } from '@/utils/uiUtils';
import { startCrackHash } from '@/services/crack';
import isEmpty from 'lodash/isEmpty';

interface Props {
  visible: boolean;
  onCancel: () => void;
  reload: () => void;
}

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

// 恢复Hash
const CrackHash: React.FC<Props> = (props: Props) => {
  const { visible, onCancel, reload } = props;
  const [form] = Form.useForm();

  // 提交表单
  const onOk = async (isClose: boolean) => {
    const fieldsValue = await form.validateFields();
    if (fieldsValue) {
      confirm('确定要恢复该文件吗?', async () => {
        const result = await startCrackHash({
          email: fieldsValue.email,
          hash: fieldsValue.hash,
        });
        if (!result.success) {
          return;
        }
        if (!isEmpty(result.data)) {
          message.success(`该Hash已破解成功，密码为：${result.data}`);
        } else {
          message.success('开始破解中...');
        }
        // 刷新表格
        reload();
        if (isClose) {
          onCancel();
        } else {
          form.resetFields();
        }
      });
    }
  };

  React.useEffect(() => {
    // 每次打开清空表单
    if (visible) {
      form.resetFields();
    }
  }, [visible]);

  return (
    <Modal
      title="恢复Hash"
      visible={visible}
      onCancel={onCancel}
      className="form-modal"
      footer={
        <React.Fragment>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={() => onOk(false)}>
            确定
          </Button>
          <Button type="primary" onClick={() => onOk(true)}>
            确定并关闭
          </Button>
        </React.Fragment>
      }
    >
      <Form {...formLayout} form={form}>
        <Form.Item
          name="hash"
          label="Hash值"
          rules={[{ required: true, message: '请输入Hash值!' }]}
        >
          <Input placeholder="请输入Hash值" />
        </Form.Item>
        <Form.Item
          name="email"
          label="发送邮箱"
          rules={[
            { required: true, message: '请输入邮箱!' },
            { type: 'email', message: '邮箱格式不正确!' },
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CrackHash;
