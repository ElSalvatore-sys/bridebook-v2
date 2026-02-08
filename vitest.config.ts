import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: [
        'src/lib/**/*.ts',
        'src/services/**/*.ts',
        'src/hooks/**/*.ts',
        'src/hooks/**/*.tsx',
        'src/stores/**/*.ts',
      ],
      exclude: [
        'src/**/index.ts',
        'src/**/*.d.ts',
        'src/test/**',
        'src/**/__tests__/**',
        'src/lib/sentry.ts',
        'src/lib/query-client.ts',
        'src/services/supabase.ts',
        'src/lib/utils.ts',
        'src/hooks/useAuth.ts',       // re-export only
        'src/hooks/useTheme.ts',      // re-export only
        'src/hooks/use-filter-sync.ts', // router-dependent, tested via E2E
      ],
      thresholds: {
        statements: 80,
        branches: 70,
        functions: 75,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
