# Any Listen Extension Kit

[English](../README.md) | 简体中文

Any Listen 的扩展开发套件，提供构建工具、类型定义和通用配置，用于打包 `.alix` 扩展。

## 功能

- 扩展宿主 API 类型
- 扩展构建与打包（`.alix`）
- ESLint 配置预设
- TypeScript 配置预设

## 安装

```bash
pnpm add -D @any-listen/extension-kit
```

## 快速开始

1) 项目结构（示例）

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

2) 创建 `config.ts`

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

1) 配置 `.env`（签名）

```text
PRI_KEY=<base64-or-pem-single-line>
PUB_KEY=<base64-or-pem-single-line>
```

4) 构建

```bash
npx @any-listen/extension-kit --build
```

构建产物：

- `dist/main.js`
- `dist/manifest.json`
- `dist/resources/*`
- `dist/i18n/*`
- `build/<id>_v<version>.alix`

## 发布元数据

```bash
npx @any-listen/extension-kit --publish
```

该命令会基于 `publish/changeLog.md` 和 `download_url_template` 生成/更新 `publish/version.json`，并阻止重复版本发布。

## 构建配置

`config.ts` 中的 `buildConfig`：

- `srcDir`：源码目录（默认 `src`）
- `distDir`：构建输出目录（默认 `dist`）
- `outputDir`：打包输出目录（默认 `build`）
- `i18nDir`：i18n 资源目录（默认 `i18n`）
- `resourcesDir`：资源目录（默认 `resources`）
- `isIsolateMode`：启用 isolate 构建（默认 `false`）
- `mainEntry`：主入口文件（默认 `src/index.ts`）
- `isolatePreloadEntry`：isolate 预加载入口（默认 `src/isolate-preload/index.ts`）

## Manifest 字段

扩展 manifest 由 `config.ts` 生成，常用字段：

- `id`, `name`, `version`
- `description`, `icon`, `author`, `homepage`, `license`
- `target_engine`, `categories`, `tags`, `grant`
- `contributes.resource`, `contributes.listProviders`, `contributes.settings`, `contributes.commands`
- `download_url_template`

## Isolate 模式

启用 `isIsolateMode` 后，会额外输出 `resources/isolate-preload.js`。如需 isolate 上下文权限，请设置 `grant: ['isolate_context']`。

## TypeScript 与 ESLint

可使用内置预设：

```json
{
  "extends": ["@any-listen/extension-kit/tsconfig.app.json"]
}
```

```js
import config from '@any-listen/extension-kit/eslint.config.js'

export default config
```

## 许可证

Apache License 2.0
