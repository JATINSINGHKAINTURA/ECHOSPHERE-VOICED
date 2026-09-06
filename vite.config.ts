import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handleApiRequest } from './api-dev-server';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'echosphere-api-middleware',
      configureServer(server) {
        server.middlewares.use('/api', (req, res, next) => {
          handleApiRequest(req, res, next);
        });
      },
    },
  ],
});
