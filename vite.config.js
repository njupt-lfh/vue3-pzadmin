import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// 自动导入vue相关api
import AutoImport from 'unplugin-auto-import/vite'
// 自动导入element-plus相关组件
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 项目站子路径：本地构建可设 VITE_BASE_PATH=/vue3-pzadmin/ npm run build
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
