import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CATALOG_DIR = path.resolve(__dirname, 'src/data/catalog')

// Dev-only middleware that lets Builder mode persist items as JSON files on disk.
// In production builds this plugin is inert (no middleware attached).
function catalogServerPlugin() {
  return {
    name: 'catalog-server',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/catalog', async (req, res) => {
        try {
          await fs.mkdir(CATALOG_DIR, { recursive: true })

          if (req.method === 'POST') {
            let body = ''
            for await (const chunk of req) body += chunk
            const item = JSON.parse(body)
            if (!item.id || !item.name) {
              res.statusCode = 400
              return res.end(JSON.stringify({ error: 'id and name are required' }))
            }
            const safeId = String(item.id).replace(/[^a-z0-9-]/gi, '-').toLowerCase()
            const filePath = path.join(CATALOG_DIR, `${safeId}.json`)
            await fs.writeFile(filePath, JSON.stringify(item, null, 2) + '\n', 'utf8')
            res.setHeader('Content-Type', 'application/json')
            return res.end(JSON.stringify({ ok: true, id: safeId, path: filePath }))
          }

          if (req.method === 'DELETE') {
            const id = (req.url || '').replace(/^\/+/, '').replace(/\.json$/i, '')
            if (!id) {
              res.statusCode = 400
              return res.end(JSON.stringify({ error: 'id required' }))
            }
            const safeId = id.replace(/[^a-z0-9-]/gi, '-').toLowerCase()
            const filePath = path.join(CATALOG_DIR, `${safeId}.json`)
            try {
              await fs.unlink(filePath)
              res.setHeader('Content-Type', 'application/json')
              return res.end(JSON.stringify({ ok: true, id: safeId }))
            } catch (err) {
              if (err.code === 'ENOENT') {
                res.statusCode = 404
                return res.end(JSON.stringify({ error: 'not found' }))
              }
              throw err
            }
          }

          res.statusCode = 405
          res.end(JSON.stringify({ error: 'method not allowed' }))
        } catch (err) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: err.message }))
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    catalogServerPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: {
        name: 'HeroQuest Loot Generator',
        short_name: 'HQ Loot',
        description: 'AI-powered random loot generator for HeroQuest',
        theme_color: '#1a0a00',
        background_color: '#1a0a00',
        display: 'standalone',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
  base: '/heroquest-loot-generator/',
  server: {
    proxy: {
      '/api/claude': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: (path) => '/v1/messages',
      }
    }
  }
})
