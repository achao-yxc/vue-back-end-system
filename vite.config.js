import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // host: '10.62.29.136',
  // cors: true,
  // port: 5173,
  // open: false,
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:3000', //  https://cn.bing.com/  10.62.29.136:3000
  //       changeOrigin: true,
  //       rewrite: (path) => {
  //         console.log('path', path);
  //         path.replace(/\/api/, '')
  //       }
  //     }
  //   },
  // },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 后端服务地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/'),
      },
    },
  },
})
