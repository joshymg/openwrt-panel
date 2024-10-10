import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_OPENWRT_API_URL': JSON.stringify(process.env.VITE_OPENWRT_API_URL || 'http://192.168.8.1/cgi-bin/luci/rpc'),
    'import.meta.env.VITE_OPENWRT_USERNAME': JSON.stringify(process.env.VITE_OPENWRT_USERNAME || 'root'),
    'import.meta.env.VITE_OPENWRT_PASSWORD': JSON.stringify(process.env.VITE_OPENWRT_PASSWORD || ''),
  },
})