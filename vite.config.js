import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Permite accesul pe toate interfețele de rețea
    port: 5173      // Specifică portul dorit (implicit 5173)
  }
})