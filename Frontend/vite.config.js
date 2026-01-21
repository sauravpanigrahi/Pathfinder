import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteCompression from 'vite-plugin-compression'

export default defineConfig(({ command, mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    // Gzip compression for production
    command === 'build' && viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240 // Only compress files > 10kB
    })
  ].filter(Boolean),
  
  build: {
    // Split CSS by chunks/routes
    cssCodeSplit: true,
    
    // Manual chunking for vendor libraries
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'toastify': ['react-toastify']
        },
        // Ensure chunks are named consistently
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    
    // Optimize sourcemaps in production
    sourcemap: command === 'serve',
    
    // Minify aggressively
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  
  // Optimize dev server
  server: {
    // Enable file watching optimizations
    watch: {
      usePolling: process.env.CI === 'true'
    },
    
    // Preload critical resources
    fs: {
      strict: true
    }
  },
  
  // Optimize CSS handling
  css: {
    devSourcemap: command === 'serve',
    
    // PostCSS config (Tailwind already handles this)
    postcss: {
      plugins: []
    }
  },
  
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-toastify'
    ]
  }
}))
