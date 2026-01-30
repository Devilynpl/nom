JavaScriptimport { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',                    // ← dodaje to – najważniejsze dla deployu

  // Konfiguracja testów Vitest (można zostawić tutaj lub przenieść do vite.config.test.js)
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    // Opcjonalnie dodaj coverage jeśli chcesz raporty
    // coverage: { provider: 'v8', reporter: ['text', 'json', 'html'] }
  },
})  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    }
  },
})
