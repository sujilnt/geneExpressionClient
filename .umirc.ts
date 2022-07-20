import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    API_URL: process.env.API_URL || 'http://localhost:8000',
  },
  fastRefresh: {},
  dva: {
    immer: true, // Enable dva-immer for elegant reducer writing experience
  },
  antd: {},
});
