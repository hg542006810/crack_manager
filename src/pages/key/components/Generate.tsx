import React from 'react';
import { Modal, Form, Select, InputNumber, message, Button } from 'antd';
import { confirm } from '@/utils/uiUtils';
import { generateKey } from '@/services/key';

interface Props {
  visible: boolean;
  onCancel: () => void;
  reload: () => void;
}

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

// 生成破解码
const Generate: React.FC<Props> = (props: Props) => {
  const { visible, onCancel, reload } = props;
  const [form] = Form.useForm();

  // 提交表单
  const onOk = async (isClose: boolean) => {
    const fieldsValue = await form.validateFields();
    if (fieldsValue) {
      confirm('确定要生成破解码吗?', async () => {
        const result = await generateKey({
          count: fieldsValue.count,
          timeout: fieldsValue.timeout,
          times: fieldsValue.times,
          type: fieldsValue.type
        });
        if (!result.success) {
          return;
        }
        message.success('生成成功!');
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
      title="生成破解码"
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
          name="type"
          label="类型"
          rules={[{ required: true, message: '请选择类型!' }]}
        >
          <Select
            placeholder="请选择类型"
            options={[
              { label: '选择固定规则', value: 0 },
              { label: '全部规则', value: 1 },
              { label: '选择固定规则或全部规则', value: 2 },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="times"
          label="使用次数"
          rules={[{ required: true, message: '请选择使用次数!' }]}
        >
          <Select
            placeholder="请选择使用次数"
            options={[
              { label: '1次', value: 1 },
              { label: '3次', value: 3 },
              { label: '5次', value: 5 },
              { label: '不限', value: 0 },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="timeout"
          label="使用时长"
          rules={[{ required: true, message: '请选择使用时长!' }]}
        >
          <Select
            placeholder="请选择使用时长"
            options={[
              { label: '1个月', value: 1 },
              { label: '3个月', value: 3 },
              { label: '6个月', value: 6 },
              { label: '12个月', value: 12 },
              { label: '24个月', value: 24 },
              { label: '不限', value: 0 },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="count"
          label="生成数量"
          rules={[{ required: true, message: '请输入生成数量!' }]}
        >
          <InputNumber
            placeholder="请输入生成数量"
            min={1}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Generate;
