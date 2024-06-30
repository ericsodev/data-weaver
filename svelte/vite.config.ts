import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  build: {
    sourcemap: true
  },
  preview: {
    port: 3000
  },
  server: {
    port: 3000
  }
});
