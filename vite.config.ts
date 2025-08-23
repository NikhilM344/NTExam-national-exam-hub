// vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'), // <-- maps "@/..." to "<root>/src"
      },
    },
    server: { host: true, port: 5173, strictPort: true },
    preview: { host: true, port: 4173, strictPort: true },
    build: { outDir: 'dist', sourcemap: false, target: 'es2020' },
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    // base: env.VITE_BASE_PATH || '/', // uncomment if deploying under a subpath
  };
});
