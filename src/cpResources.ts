import fs from 'node:fs'
import path from 'node:path'

import { state } from './state'

export const cpResources = async () => {
  const sourcePath = state.resourcesDir
  const targetPath = path.join(state.distDir, 'resources')
  const sourceI18nPath = state.i18nDir
  const targetI18nPath = path.join(state.distDir, 'i18n')

  await Promise.all([
    fs.promises.cp(sourcePath, targetPath, { recursive: true }),
    fs.promises.cp(sourceI18nPath, targetI18nPath, { recursive: true }),
  ])
}
