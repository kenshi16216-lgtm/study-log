import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ここが重要！「/リポジトリ名/」を正確に指定します
  base: '/study-log/', 
})