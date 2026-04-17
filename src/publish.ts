import fs from 'node:fs'
import path from 'node:path'

import type { VersionInfo } from './types/build'
import { buildPackageName, getConfig, ROOT_DIR } from './utils'

export const run = async () => {
  const config = await getConfig()
  const filePath = path.join(ROOT_DIR, 'publish/version.json')
  let versionInfo = await fs.promises
    .readFile(filePath, 'utf-8')
    .then((d) => JSON.parse(d) as VersionInfo)
    .catch(() => null)
  if (versionInfo) {
    if (versionInfo.version === config.version) {
      console.warn(`Version (v${config.version}) already published`)
      process.exit(1)
    }
    versionInfo.history ||= []
    versionInfo.history.push({
      version: versionInfo.version,
      download_url: versionInfo.download_url,
      log: versionInfo.log,
      date: versionInfo.date,
    })
  } else {
    versionInfo = { version: '', download_url: '', log: '', date: new Date().toISOString() }
  }
  versionInfo.version = config.version
  if (config.download_url_template) {
    versionInfo.download_url = `${config.download_url_template.replaceAll('{version}', config.version)}/${buildPackageName(config)}`
  }
  versionInfo.log = await fs.promises
    .readFile(path.join(ROOT_DIR, 'publish/changeLog.md'), 'utf-8')
    .then((d) => d.toString().trim())
    .catch(() => '')
  versionInfo.date = new Date().toISOString()

  await fs.promises.rm(filePath, { recursive: true, force: true })
  await fs.promises.writeFile(filePath, JSON.stringify(versionInfo))
}

void run()
