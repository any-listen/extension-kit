import { builtinModules } from 'node:module'
import path from 'node:path'

import { defineConfig } from 'vite'

import { dependencies } from './package.json' with { type: 'json' }

const rootPath = path.join(import.meta.dirname, './')
const projectPath = path.join(rootPath, 'src')

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  mode: process.env.NODE_ENV,
  publicDir: false,
  resolve: {
    alias: {
      '@': projectPath,
    },
    conditions: ['module', 'node', 'default', 'development|production'],
    mainFields: ['module', 'jsnext:main', 'jsnext'],
  },
  build: {
    target: 'node16',
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    outDir: path.join(rootPath, 'dist'),
    lib: {
      entry: path.join(projectPath, 'index.ts'),
      formats: ['es'],
      fileName: 'bin',
    },
    rolldownOptions: {
      external: ['any-listen', ...builtinModules.flatMap((m) => [m, `node:${m}`]), ...Object.keys(dependencies)],
    },
  },
})
