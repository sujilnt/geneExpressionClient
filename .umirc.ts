import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
  ],
  fastRefresh: {},
  dva: {
    immer: true, // Enable dva-immer for elegant reducer writing experience
  },
  antd: {}
});
