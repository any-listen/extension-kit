import { cpResources } from './cpResources'
import { createMainifest } from './mainifest'
import { pack } from './pack'
import { state } from './state'
import { build, getConfig, loadEnvFile } from './utils'
import createConfigs from './vite.config'

const run = async () => {
  await loadEnvFile()
  const config = await getConfig()
  const appConfigs = createConfigs(state.isIsolateMode)
  await Promise.all(appConfigs.map(async (appConfig) => build(appConfig)))
  await Promise.all([cpResources(), createMainifest(config)])
  await pack(config)
}

void run()
