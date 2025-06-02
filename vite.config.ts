import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    'process.env.API_KEY': JSON.stringify('AIzaSyDbUjcKJPFk0LG1KfrEFjfZ2j3ld1_Wheg'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
