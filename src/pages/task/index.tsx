import styles from './style/index.less';
import { Button, message, Modal } from 'antd';
import { FileAddOutlined, FileTextOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import type { TableListParams, TableListItem } from './data';
import {
  getTask,
  killProcess as killProcessRequest,
  sendEmail as sendEmailRequest,
  queued as queuedRequest,
  getProgress,
} from '@/services/crack';
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import {
  getSearchDateRangeProps,
  confirm,
  cancelModal,
  openModal,
} from '@/utils/uiUtils';
import { useImmer } from 'use-immer';
import CrackFile from './components/CrackFile';
import CrackHash from './components/CrackHash';
import { useRequest } from 'ahooks';

interface State {
  progress: { visible: boolean; record: TableListItem | null };
  crackFile: { showComponent: boolean; visible: boolean };
  crackHash: { showComponent: boolean; visible: boolean };
}

export default function Task() {
  const [{ crackFile, crackHash, progress }, setState] = useImmer<State>({
    progress: {
      visible: false,
      record: null,
    },
    crackFile: {
      showComponent: false,
      visible: false,
    },
    crackHash: {
      showComponent: false,
      visible: false,
    },
  });
  const ref = React.useRef<ActionType>();

  // 发送邮件
  const sendEmail = (id: string) => {
    confirm('发送后指定的邮箱将收到密码，确定发送邮件通知吗?', async () => {
      const hide = message.loading('发送中...', 0);
      const result = await sendEmailRequest({ id });
      hide();
      if (!result.success) {
        return;
      }
      message.success('发送成功!');
    });
  };

  // 杀掉进程
  const killProcess = (id: string) => {
    confirm('结束任务将会杀掉恢复进程，确定要结束吗?', async () => {
      const hide = message.loading('执行中...', 0);
      const result = await killProcessRequest({ id });
      hide();
      if (!result.success) {
        return;
      }
      ref.current?.reload();
      message.success('执行成功!');
    });
  };

  // 结束排队
  const queued = (id: string) => {
    confirm('结束排队后会开始任务，确定要结束吗?', async () => {
      const hide = message.loading('执行中...', 0);
      const result = await queuedRequest({ id });
      hide();
      if (!result.success) {
        return;
      }
      ref.current?.reload();
      message.success('执行成功!');
    });
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '文件名称',
      dataIndex: 'fileName',
      search: false,
      width: 350,
      render: (text) => <span style={{ wordBreak: 'break-all' }}>{text}</span>,
    },
    {
      title: '发送邮箱',
      dataIndex: 'email',
      fieldProps: {
        placeholder: '请输入发送邮箱',
      },
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      valueEnum: {
        '0': { text: '未开始' },
        '1': { text: '进行中' },
        '2': {
          text: '恢复成功',
        },
        '3': {
          text: '恢复失败',
        },
        '4': {
          text: '手动结束',
        },
        '5': {
          text: '排队中',
        },
      },
      fieldProps: {
        placeholder: '请选择任务状态',
      },
      render: (text, record) => (
        <div>
          {record.status === 1 && (
            <div>
              <p>
                <span style={{ color: '#1990ff' }}>恢复中</span>
              </p>
              <p>
                <Button
                  type="link"
                  style={{ padding: 0 }}
                  onClick={() => openModal('progress', setState, { record })}
                >
                  点击查看进度
                </Button>
              </p>
            </div>
          )}
          {record.status === 0 && (
            <div>
              <p>
                <span style={{ color: '#1990ff' }}>未开始</span>
              </p>
            </div>
          )}
          {record.status === 2 && (
            <div>
              <p>
                <span style={{ color: '#52c41b' }}>恢复成功</span>
              </p>
              <p>密码：{record.password}</p>
            </div>
          )}
          {record.status === 3 && (
            <div>
              <p>
                <span style={{ color: '#ff4d4f' }}>恢复失败</span>
              </p>
            </div>
          )}
          {record.status === 4 && (
            <div>
              <p>
                <span style={{ color: '#ff4d4f' }}>手动结束</span>
              </p>
            </div>
          )}
          {record.status === 5 && (
            <div>
              <p>
                <span style={{ color: '#1990ff' }}>排队中</span>
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      sorter: true,
      width: 200,
      valueType: 'dateTimeRange',
      fieldProps: getSearchDateRangeProps(),
      render: (_, record) => record.createdAt,
    },
    {
      title: '破解码',
      dataIndex: 'key',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 120,
      render: (_, record) => (
        <React.Fragment>
          {!isEmpty(record.password) && (
            <Button type="link" onClick={() => sendEmail(record.id)}>
              发送邮件通知
            </Button>
          )}
          {record.status === 1 && (
            <Button type="link" onClick={() => killProcess(record.id)} danger>
              结束任务
            </Button>
          )}
          {record.status === 5 && (
            <Button type="link" onClick={() => queued(record.id)} danger>
              结束排队
            </Button>
          )}
        </React.Fragment>
      ),
    },
  ];

  return (
    <PageContainer
      className={styles.container}
      header={{
        title: '任务列表',
        breadcrumb: {
          routes: [
            {
              path: '',
              breadcrumbName: '首页',
            },
            {
              path: '',
              breadcrumbName: '密码恢复页',
            },
            {
              path: '',
              breadcrumbName: '任务列表',
            },
          ],
        },
      }}
    >
      <ProTable<TableListItem, TableListParams>
        rowKey="id"
        columns={columns}
        headerTitle="恢复任务"
        polling={10000}
        actionRef={ref}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => openModal('crackFile', setState)}
          >
            <FileAddOutlined /> 恢复文件
          </Button>,
          <Button
            type="primary"
            onClick={() => openModal('crackHash', setState)}
          >
            <FileTextOutlined /> 恢复Hash
          </Button>,
        ]}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          defaultPageSize: 30,
          showTotal: (total) => `共有 ${total} 条数据`,
          pageSizeOptions: ['5', '15', '30', '50'],
          size: 'default',
        }}
        request={async (params, sort) => {
          let orderBy;
          let sortBy;
          // 按照时间排序
          if (sort?.createdAt) {
            sortBy = 'createdAt';
            orderBy = sort.createdAt === 'ascend' ? 'ASC' : 'DESC';
          }
          const result = await getTask({
            page: params.current || 1,
            pageSize: params.pageSize || 15,
            createdAt:
              params.createdAt && typeof params.createdAt === 'object'
                ? params.createdAt.join(',')
                : '',
            email: params.email ?? undefined,
            hash: params.hash ?? undefined,
            status: params.status ?? undefined,
            sortBy,
            orderBy,
          });
          return {
            data: result.data.rows,
            success: true,
            total: result.data.count,
          };
        }}
      />

      {/* 恢复文件 */}
      {crackFile.showComponent && (
        <CrackFile
          visible={crackFile.visible}
          onCancel={() => cancelModal('crackFile', setState)}
          reload={() => ref.current?.reload()}
        />
      )}

      {/* 恢复Hash */}
      {crackHash.showComponent && (
        <CrackHash
          visible={crackHash.visible}
          onCancel={() => cancelModal('crackHash', setState)}
          reload={() => ref.current?.reload()}
        />
      )}

      {progress.record && (
        <ProgressModal
          record={progress.record}
          visible={progress.visible}
          onCancel={() => cancelModal('progress', setState)}
        />
      )}
    </PageContainer>
  );
}

const ProgressModal = ({
  record,
  visible,
  onCancel,
}: {
  record: TableListItem;
  visible: boolean;
  onCancel: () => void;
}) => {
  const { data, cancel, run } = useRequest(
    () => getProgress({ id: record.id }),
    {
      pollingInterval: 5000,
      manual: true,
    },
  );

  React.useEffect(() => {
    if (visible) {
      run();
    }
  }, [visible]);

  return (
    <Modal
      title="破解进度"
      visible={visible}
      onCancel={onCancel}
      afterClose={() => {
        cancel();
      }}
    >
      <div>
        <p>
          进度：
          <span style={{ color: '#52c41b' }}>{data?.data?.progress}</span>
        </p>
        {data?.data?.progressText && <p>{data?.data?.progressText}</p>}
        <p>{data?.data?.message}</p>
        <p>
          速度：
          <span style={{ color: '#1990ff' }}>{data?.data?.speed}</span>
        </p>
      </div>
    </Modal>
  );
};
