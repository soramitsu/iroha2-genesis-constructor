import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svg from 'vite-svg-loader';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svg({
      svgoConfig: {
        plugins: [{ name: 'removeViewBox', active: false }],
      },
    }),
  ],
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, './src') },
    ],
  },
  build: {
    target: 'esnext',
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
  clearScreen: false,
  server: {
    strictPort: true,
  },
  envPrefix: ['VITE_', 'TAURI_'],
});
