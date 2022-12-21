import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/',
      component: '@/layouts/layout',
      routes: [
        { path: '/', redirect: '/task/list'},
        { path: '/task/list', component: '@/pages/task' },
        { path: '/key/list', component: '@/pages/key' },
      ]
    }
  ],
  antd: {},
  hash: true,
  title: '密码恢复站',
  locale: {
    default: 'zh-CN'
  },
  proxy: {
    '/api/': {
      target: 'http://localhost:7001/api',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  fastRefresh: {},
});
