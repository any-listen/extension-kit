import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

import { EXTENSION } from './constants'
import { state } from './state'
import type { ExtensionConfig } from './types/build'
import { buildPackageName } from './utils'

const buildPublicKey = (publicKey: string) => {
  if (!publicKey.includes('-----BEGIN PUBLIC KEY-----')) {
    return `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`
  }
  return publicKey
}

const signData = (data: Buffer, privateKey: string) => {
  const sign = crypto.createSign('SHA256')
  sign.update(data)
  sign.end()
  const signature = sign.sign(privateKey, 'hex')
  return signature
}
const verifySignature = (data: Buffer, publicKey: string, signature: string) => {
  const verify = crypto.createVerify('SHA256')
  verify.update(data)
  verify.end()
  const isValid = verify.verify(publicKey, signature, 'hex')
  return isValid
}

const packFile = async ({ gzip, cwd, files, dist }: { gzip: boolean; cwd: string; files: string[]; dist: string }) => {
  const { c } = await import('tar')
  return new Promise<void>((resolve, reject) => {
    c(
      {
        gzip,
        cwd,
      },
      files
    )
      .pipe(fs.createWriteStream(dist))
      .on('finish', () => {
        resolve()
      })
      .on('error', reject)
  })
}

export const pack = async (config: ExtensionConfig) => {
  let privateKey = process.env.PRI_KEY?.trim()
  let publicKey = process.env.PUB_KEY?.trim()
  if (!privateKey || !publicKey) throw new Error('Missing private key or public key')
  if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
    privateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`
  }

  const unpackedDir = path.join(state.outputDir, 'unpacked')
  await fs.promises.rm(unpackedDir, { recursive: true }).catch(() => {})
  await fs.promises.mkdir(unpackedDir, { recursive: true }).catch(() => {})
  const extBundleFilePath = path.join(unpackedDir, EXTENSION.extBundleFileName)
  await packFile({
    gzip: true,
    cwd: state.distDir,
    files: [EXTENSION.entryFileName, EXTENSION.mainifestName, 'resources', 'i18n'],
    dist: extBundleFilePath,
  })
  const buf = await fs.promises.readFile(extBundleFilePath)
  const signature = signData(buf, privateKey)
  if (!verifySignature(buf, buildPublicKey(publicKey), signature)) {
    throw new Error('Signature is valid, please check your public key')
  }
  await fs.promises.writeFile(path.join(unpackedDir, EXTENSION.signFileName), `${signature}\n${publicKey}`)
  await packFile({
    gzip: true,
    cwd: unpackedDir,
    files: [EXTENSION.extBundleFileName, EXTENSION.signFileName],
    dist: path.join(state.outputDir, buildPackageName(config)),
  })
}
