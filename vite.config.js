// vite.config.js
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        bmi: resolve(__dirname, 'bmi.html'),
        login: resolve(__dirname, 'login.html'),
        paivakirja: resolve(__dirname, 'paivakirja.html'),
        verenpaine: resolve(__dirname, 'verenpaine.html'),
      },
    },
  },
  base: './',
});