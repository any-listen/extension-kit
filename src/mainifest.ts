import fs from 'node:fs'
import path from 'node:path'

import { EXTENSION } from './constants'
import { state } from './state'
import type { ExtensionConfig } from './types/build'
import type { Manifest } from './types/extension_config'

export const createMainifest = async (config: ExtensionConfig) => {
  const mainifest: Manifest = {
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
  if (config.readme) mainifest.readme = await fs.promises.readFile(config.readme, 'utf8')

  await fs.promises.writeFile(path.join(state.distDir, EXTENSION.mainifestName), JSON.stringify(mainifest, null, 2), 'utf8')
}
