import { Modal } from 'antd';
import moment from 'moment';

// 通用confirm
const confirm = (content: string, onOk: () => void, onCancel?: () => void) => {
  Modal.confirm({
    title: '提示',
    okText: '确认',
    cancelText: '取消',
    content,
    onOk,
    onCancel,
  });
};

// dateRange快捷选项
const getRanges = () => {
  return {
    今天: [moment().startOf('day'), moment().endOf('day')],
    昨天: [moment().subtract(1, 'day').startOf('day'), moment().subtract(1, 'day').endOf('day')],
    一周: [moment().subtract(7, 'day').startOf('day'), moment().endOf('day')],
    这个月: [moment().startOf('month'), moment().endOf('day')],
    最近三个月: [moment().subtract(3, 'month').startOf('day'), moment().endOf('day')],
  };
};

// 获得搜索框时间选择器props
const getSearchDateRangeProps = () => {
  return {
    ranges: getRanges(),
    className: 'search-range-picker',
    placeholder: ['开始时间', '结束时间'],
  };
};

// 打开弹窗
const openModal = (type: string, setState: any, params = {}) => {
  setState((draft: any) => {
    const payload = draft;
    payload[type] = {
      ...params,
      showComponent: true,
      visible: true,
    };
    return payload;
  });
};

// 关闭弹窗
const cancelModal = (type: string, setState: any) => {
  setState((draft: any) => {
    const payload = draft;
    payload[type].visible = false;
    return payload;
  });
};

export { confirm, getRanges, getSearchDateRangeProps, openModal, cancelModal };
