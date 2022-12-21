import styles from './style/index.less';
import { Button } from 'antd';
import { PlusOutlined, ExportOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import type { TableListParams, TableListItem } from './data';
import { getKey } from '@/services/key';
import React from 'react';
import { getSearchDateRangeProps, openModal, cancelModal } from '@/utils/uiUtils';
import { useImmer } from 'use-immer';
import { ExportKey } from '@/services/data';
import Generate from './components/Generate';

interface State {
  generate: { showComponent: boolean; visible: boolean };
}

export default function Key() {
  const [{ generate }, setState] = useImmer<State>({
    generate: {
      showComponent: false,
      visible: false,
    },
  });

  const [query, setQuery] = React.useState<ExportKey>({});
  const ref = React.useRef<ActionType>();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '破解码',
      dataIndex: 'key',
      search: false,
    },
    {
      title: '类型',
      dataIndex: 'type',
      valueType: 'select',
      fieldProps: {
        placeholder: '请选择类型',
        options: [
          {
            label: '选择固定规则',
            value: 0,
          },
          {
            label: '全部规则',
            value: 1,
          },
          {
            label: '选择固定规则或全部规则',
            value: 2,
          },
        ],
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        '0': { text: '未使用' },
        '1': {
          text: '已使用',
        },
        '2': {
          text: '已全部使用',
        },
      },
      fieldProps: {
        placeholder: '请选择状态',
      },
      render: (_, record) => (
        <>
          {record.status === 0 && (
            <span style={{ color: '#1990ff' }}>未使用</span>
          )}
          {record.status === 1 && (
            <span style={{ color: '#52c41b' }}>已使用：(有效：{record.usedCount}，无效：{record.backCount})</span>
          )}
          {record.status === 2 && (
            <span style={{ color: '#fe7974' }}>已全部使用</span>
          )}
        </>
      ),
    },
    {
      title: '使用次数',
      dataIndex: 'times',
      valueType: 'select',
      sorter: true,
      fieldProps: {
        placeholder: '请选择使用时长',
        options: [
          {
            label: '1次',
            value: 1,
          },
          {
            label: '3次',
            value: 3,
          },
          {
            label: '5次',
            value: 5,
          },
          {
            label: '不限',
            value: 0,
          },
        ],
      },
      render: (_, record) =>
        record.times === 0 ? '不限' : `${record.times}次`,
    },
    {
      title: '使用时长',
      dataIndex: 'timeout',
      valueType: 'select',
      sorter: true,
      fieldProps: {
        placeholder: '请选择使用时长',
        options: [
          {
            label: '1个月',
            value: 1,
          },
          {
            label: '3个月',
            value: 3,
          },
          {
            label: '6个月',
            value: 6,
          },
          {
            label: '12个月',
            value: 12,
          },
          {
            label: '24个月',
            value: 24,
          },
          {
            label: '不限',
            value: 0,
          },
        ],
      },
      render: (_, record) =>
        record.timeout === 0 ? '不限' : `${record.timeout}个月`,
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
  ];

  let exportParams = '';
  if (query) {
    const params = new URLSearchParams();
    for (const key in query) {
      // @ts-ignore
      if (query[key]) {
        // @ts-ignore
        params.set(key, query[key]);
      }
    }
    exportParams = params.toString();
  }
  return (
    <PageContainer
      className={styles.container}
      header={{
        title: '破解码列表',
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
        headerTitle="破解码列表"
        actionRef={ref}
        toolBarRender={() => [
          <Button type="primary" href={`/api/key/exportKey?${exportParams}`}>
            <ExportOutlined /> 导出Excel
          </Button>,
          <Button
            type="primary"
            onClick={() => openModal('generate', setState)}
          >
            <PlusOutlined /> 批量生成
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
          if (sort?.times) {
            sortBy = 'times';
            orderBy = sort.times === 'ascend' ? 'ASC' : 'DESC';
          }
          if (sort?.timeout) {
            sortBy = 'timeout';
            orderBy = sort.timeout === 'ascend' ? 'ASC' : 'DESC';
          }
          setQuery({
            createdAt:
              params.createdAt && typeof params.createdAt === 'object'
                ? params.createdAt.join(',')
                : '',
            status: params.status ?? undefined,
            timeout: params.timeout ?? undefined,
            times: params.times ?? undefined,
          });
          const result = await getKey({
            page: params.current || 1,
            pageSize: params.pageSize || 15,
            createdAt:
              params.createdAt && typeof params.createdAt === 'object'
                ? params.createdAt.join(',')
                : '',
            status: params.status ?? undefined,
            timeout: params.timeout ?? undefined,
            times: params.times ?? undefined,
            type: params.type ?? undefined,
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

      {/* 生成破解码 */}
      {generate.showComponent && (
        <Generate
          visible={generate.visible}
          onCancel={() => cancelModal('generate', setState)}
          reload={() => ref.current?.reload()}
        />
      )}
    </PageContainer>
  );
}
