import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@features': path.resolve(__dirname, 'features'),
    }
  },
  test: {
    environment: 'jsdom', // necessário para jest-dom e futuras tests de componentes
    globals: true,        // garante expect/describe/it globais antes do setup
    include: ['**/__tests__/**/*.test.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      exclude: ['**/node_modules/**', '**/.next/**']
    }
  }
});