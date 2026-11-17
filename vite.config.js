import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite handles the dev server and production build; the React plugin enables JSX and fast refresh.
export default defineConfig({
  plugins: [react()],
});
