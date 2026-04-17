import type { Manifest } from './extension_config.js'

export interface BuildConfig {
  distDir?: string
  outputDir?: string
  i18nDir?: string
  resourcesDir?: string
  srcDir?: string
  isIsolateMode?: boolean
  mainEntry?: string
  isolatePreloadEntry?: string
}

export interface ExtensionConfig extends Manifest {
  buildConfig?: BuildConfig
}

export interface VersionInfo {
  version: string
  download_url: string
  log: string
  date: string
  history?: VersionInfo[]
}
