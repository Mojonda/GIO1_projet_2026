import { defineConfig } from 'vite'
import vue from '@vue/plugin-vue'
import cesium from 'vite-plugin-cesium'

export default defineConfig({
  plugins: [vue(), cesium()]
})


