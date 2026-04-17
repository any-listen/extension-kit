import { defineConfig } from 'vite'

import { EXTENSION } from './constants'
import { state } from './state'

const isProd = process.env.NODE_ENV == 'production'

const createBuildConfig = (name: string, filePath: string) => {
  return defineConfig({
    base: './',
    mode: process.env.NODE_ENV,
    publicDir: false,
    resolve: {
      alias: {
        '@': state.srcDir,
      },
    },
    build: {
      target: 'esnext',
      emptyOutDir: true,
      minify: false,
      watch: isProd
        ? null
        : {
            buildDelay: 500,
          },
      outDir: state.distDir,
      rolldownOptions: {
        external: ['any-listen'],
        input: {
          [name]: filePath,
        },
        output: {
          entryFileNames: '[name]',
          format: 'iife',
        },
      },
    },
  })
}

export default (isIsolateMode?: boolean) => {
  const inputs = isIsolateMode
    ? {
        [EXTENSION.entryFileName]: state.mainEntry,
        'resources/isolate-preload.js': state.isolatePreloadEntry,
      }
    : {
        [EXTENSION.entryFileName]: state.mainEntry,
      }
  return Object.entries(inputs).map(([name, filePath]) => createBuildConfig(name, filePath))
}
