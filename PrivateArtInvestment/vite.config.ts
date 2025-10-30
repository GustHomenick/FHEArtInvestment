import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@fhevm/sdk': path.resolve(__dirname, '../../packages/fhevm-sdk/src'),
    },
  },
  optimizeDeps: {
    exclude: ['fhevmjs'],
  },
  server: {
    port: 3002,
  },
});
