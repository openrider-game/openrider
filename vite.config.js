import { defineConfig } from "vite";
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'bootstrap.js'),
      name: 'OpenRider',
      fileName: 'openrider'
    }
  },
});