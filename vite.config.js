// vite.config.js
import {resolve} from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // List your html files here, e.g:
        main: resolve(__dirname, 'index.html'),
        bmi: resolve(__dirname, 'bmi.html'),
        login: resolve(__dirname, 'login.html'),
        paivakirja: resolve(__dirname, 'paivakirja.html'),
        verenpaine: resolve(__dirname, 'verenpaine.html'),
      },
    },
  },
  // Public base path could be set here too:
  // base: '/~username/my-app/',
  base: './',

});