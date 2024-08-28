import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import sri from "@small-tech/vite-plugin-sri";

// https://vitejs.dev/config/

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
  }
})
