# Any Listen Extension Kit

English | [简体中文](docs/README.zh-CN.md)

Any Listen extension kit for developing Any Listen extensions. It provides build tooling, type definitions, and shared configs to package extensions as `.alix` bundles.

## Features

- Extension host API types
- Extension build and packaging (`.alix`)
- ESLint config preset
- TypeScript config presets

## Install

```bash
pnpm add -D @any-listen/extension-kit
```

## Quick Start

1) Project layout (example)

```text
your-extension/
  src/
    index.ts
  resources/
  i18n/
  config.ts
  .env
  publish/
    changeLog.md
```

2) Create `config.ts`

```ts
import type { ExtensionConfig } from '@any-listen/extension-kit/config'

const config: ExtensionConfig = {
  id: 'my_extension',
  name: 'My Extension',
  version: '1.0.0',
  description: 'Example extension',
  author: 'Your Name',
  homepage: 'https://example.com',
  license: 'MIT',
  target_engine: '1.0.0',
  categories: ['music'],
  tags: ['example'],
  grant: ['internet'],
  contributes: {
    resource: [
      {
        id: 'example',
        name: 'Example Source',
        resource: ['musicSearch', 'musicUrl'],
      },
    ],
  },
  download_url_template: 'https://example.com/downloads/{version}',
  buildConfig: {
    srcDir: 'src',
    distDir: 'dist',
    outputDir: 'build',
    i18nDir: 'i18n',
    resourcesDir: 'resources',
    isIsolateMode: false,
    mainEntry: 'src/index.ts',
  },
}

export default config
```

3) Add `.env` for signing

```text
PRI_KEY=<base64-or-pem-single-line>
PUB_KEY=<base64-or-pem-single-line>
```

4) Build

```bash
npx @any-listen/extension-kit --build
```

The build produces:

- `dist/main.js`
- `dist/manifest.json`
- `dist/resources/*`
- `dist/i18n/*`
- `build/<id>_v<version>.alix`

## Publish Metadata

```bash
npx @any-listen/extension-kit --publish
```

This updates `publish/version.json` using `publish/changeLog.md` and `download_url_template`. It prevents publishing the same version twice.

## Build Config

`buildConfig` in `config.ts`:

- `srcDir`: Source directory (default `src`)
- `distDir`: Build output directory (default `dist`)
- `outputDir`: Package output directory (default `build`)
- `i18nDir`: i18n assets directory (default `i18n`)
- `resourcesDir`: Resource assets directory (default `resources`)
- `isIsolateMode`: Enable isolate preload build (default `false`)
- `mainEntry`: Main entry file (default `src/index.ts`)
- `isolatePreloadEntry`: Isolate preload entry (default `src/isolate-preload/index.ts`)

## Manifest Fields

The extension manifest is derived from `config.ts`. Key fields:

- `id`, `name`, `version`
- `description`, `icon`, `author`, `homepage`, `license`
- `target_engine`, `categories`, `tags`, `grant`
- `contributes.resource`, `contributes.listProviders`, `contributes.settings`, `contributes.commands`
- `download_url_template`

## Isolate Mode

When `isIsolateMode` is enabled, the build also outputs `resources/isolate-preload.js` from `isolatePreloadEntry`. Use `grant: ['isolate_context']` if your extension needs isolate context.

## TypeScript and ESLint

Use built-in presets:

```json
{
  "extends": ["@any-listen/extension-kit/tsconfig.app.json"]
}
```

```js
import config from '@any-listen/extension-kit/eslint.config.js'

export default config
```

## License

Apache License 2.0
