import { jsNode, typescript, typescriptParser } from './eslint/eslint.config.js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  jsNode,
  typescript,
  {
    languageOptions: {
      parserOptions: {
        parser: typescriptParser,
      },
    },
  },
]
