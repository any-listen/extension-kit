import fs from 'node:fs/promises'
import path from 'node:path'

import { build as viteBuild, type UserConfig } from 'vite'

import { EXTENSION } from './constants'
import { state } from './state'
import type { ExtensionConfig } from './types/build'

export const ROOT_DIR = path.join(import.meta.dirname.split('node_modules')[0])

const buildPath = (subPath: string) => {
  if (path.isAbsolute(subPath)) return subPath
  return path.join(ROOT_DIR, subPath)
}

export const getConfig = async () => {
  const configPath = path.join(ROOT_DIR, 'config.ts')
  await fs.access(configPath, fs.constants.F_OK)
  const config = ((await import(`file://${configPath}`)) as { default: ExtensionConfig }).default

  state.srcDir = buildPath(config.buildConfig?.srcDir || 'src')
  state.distDir = buildPath(config.buildConfig?.distDir || 'dist')
  state.outputDir = buildPath(config.buildConfig?.outputDir || 'build')
  state.i18nDir = buildPath(config.buildConfig?.i18nDir || 'i18n')
  state.resourcesDir = buildPath(config.buildConfig?.resourcesDir || 'resources')
  state.isIsolateMode = config.buildConfig?.isIsolateMode || false
  if (state.isIsolateMode) {
    state.mainEntry = buildPath(config.buildConfig?.mainEntry || path.join(state.srcDir, 'main/index.ts'))
    state.isolatePreloadEntry = buildPath(
      config.buildConfig?.isolatePreloadEntry || path.join(state.srcDir, 'isolate-preload/index.ts')
    )
  } else {
    state.mainEntry = buildPath(config.buildConfig?.mainEntry || path.join(state.srcDir, 'index.ts'))
  }

  return config
}

export const loadEnvFile = async () => {
  const envPath = path.join(ROOT_DIR, '.env')
  let envContent: string
  try {
    await fs.access(envPath, fs.constants.F_OK)
    envContent = (await fs.readFile(envPath, 'utf-8')).trim()
  } catch {
    return
  }
  if (!envContent) return
  const lines = envContent.split('\n')
  for (const line of lines) {
    let [key, ...rest] = line.split('=')
    key = key.trim()
    if (key.startsWith('#') || key === '') continue
    process.env[key] = rest.join('=').trim()
  }
}

export const buildPackageName = (config: ExtensionConfig) => {
  return `${config.id}_v${config.version}.${EXTENSION.pkgExtName}`
}

/**
 * build code
 */
export const build = async (config: UserConfig) => {
  if (config.build) config.build.watch = null
  return viteBuild({ ...config, configFile: false })
    .then(() => {
      // output
      // console.log(output)
      return true
    })
    .catch((error) => {
      console.log(error)
      return false
    })
}
