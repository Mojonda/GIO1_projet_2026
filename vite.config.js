import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' // Vérifie bien : @vitejs (sans le 's' à vue)
import cesium from 'vite-plugin-cesium'

export default defineConfig({
  plugins: [vue(), cesium()]
})