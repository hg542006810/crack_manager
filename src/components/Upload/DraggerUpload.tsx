import React from 'react';
import { message, Upload } from 'antd';
import type { UploadFile } from 'antd/lib/upload/interface';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/lib/upload';
import path from 'path';

const { Dragger } = Upload;

interface Props {
  value?: UploadFile[];
  onChange?: (info: UploadFile[]) => void;
  multiple?: boolean;
  maxCount?: number;
  disabled?: boolean;
}

const DraggerUpload: React.FC<Props> = (props: Props) => {
  const { maxCount = 5, value = [], onChange, disabled = false } = props;
  // 上传事件
  const handleChange = (params: UploadChangeParam) => {
    // 检查是否能上传
    if (!beforeUpload(params.file)) {
      return;
    }
    const fileInfo = { ...params };
    // 默认为完成状态
    fileInfo.file.status = 'done';
    if (onChange) {
      onChange(params.fileList);
    }
  };
  return (
    <Dragger
      name="file"
      maxCount={maxCount}
      customRequest={() => {}}
      fileList={value}
      onChange={handleChange}
      disabled={disabled}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
    </Dragger>
  );
};

// 上传前检查
function beforeUpload(file: UploadFile) {
  const suffix = path.extname(file.name);
  const type = [
    '.zip',
    '.rar',
    '.xlsx',
    'xls',
    '.doc',
    '.docx',
    '.ppt',
    '.pptx',
    '.7z',
    '.pdf',
  ];
  if (!type.includes(suffix)) {
    message.error(`文件格式错误,格式只能为${type.join('、')}!`);
    return false;
  }
  const maxSize: number = 500;
  const isLt2M = (file.size ?? 0) / 1024 / 1024 < maxSize;
  if (!isLt2M) {
    message.error(`文件最大只能${maxSize}MB`);
    return false;
  }
  return true;
}


export default DraggerUpload;