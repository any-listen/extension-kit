import fs from 'node:fs'
import path from 'node:path'

import { EXTENSION } from './constants'
import { state } from './state'
import type { ExtensionConfig } from './types/build'

export const createMainifest = async (config: ExtensionConfig) => {
  const mainifest = {
    id: config.id,
    name: config.name,
    description: config.description,
    icon: config.icon,
    version: config.version,
    target_engine: config.target_engine,
    author: config.author,
    homepage: config.homepage,
    license: config.license,
    categories: config.categories,
    tags: config.tags,
    grant: config.grant,
    contributes: config.contributes,
    main: EXTENSION.entryFileName,
  }

  await fs.promises.writeFile(path.join(state.distDir, EXTENSION.mainifestName), JSON.stringify(mainifest, null, 2), 'utf8')
}
