import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server : {
    // we did this to avoid CORS issues when fetching data from the backend
    // this will proxy all requests starting with /api to the backend server running on port 3000
    // so when we make a request to /api/quote, it will be proxied to http://localhost:3000/api/quote
    proxy :{
      '/api' : 'http://localhost:3000',
    },
  },
  plugins: [react()],
})
