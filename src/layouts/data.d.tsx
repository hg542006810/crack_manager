import { KeyOutlined, OrderedListOutlined, UnorderedListOutlined } from '@ant-design/icons';

export default {
  route: {
    path: '/',
    routes: [
      {
        path: '/task',
        name: '任务管理',
        icon: <OrderedListOutlined />,
        routes: [
          {
            path: '/task/list',
            name: '任务列表',
            icon: <UnorderedListOutlined />
          },
        ]
      },
      {
        path: '/key',
        name: '破解码管理',
        icon: <KeyOutlined />,
        routes: [
          {
            path: '/key/list',
            name: '破解码列表',
            icon: <UnorderedListOutlined />,
          },
        ]
      },
    ],
  },
};
