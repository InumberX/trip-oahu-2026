import { type StorybookConfig } from '@storybook/react-vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { loadConfigFromFile, mergeConfig } from 'vite'

const __sbDirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {
      strictMode: true,
      builder: {
        viteConfigPath: 'vite-storybook.config.ts',
      },
    },
  },
  staticDirs: ['../public'],
  viteFinal: async (config, { configType }) => {
    const configPath = path.resolve(__sbDirname, '../vite-storybook.config.ts')
    const viteMode = configType === 'PRODUCTION' ? 'production' : 'development'
    const result = await loadConfigFromFile(
      { mode: viteMode, command: 'build' },
      configPath,
    )
    const userConfig = result?.config ?? {}

    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '~': path.resolve(__sbDirname, '../src'),
      }
    }

    // tsconfigの情報（resolve.tsconfigPathsによるpath alias含む）をマージする
    // plugins は framework の viteConfigPath 経由で既に読み込まれるため除外する
    const {
      // oxlint-disable-next-line no-unused-vars
      plugins: _plugins,
      ...userConfigWithoutPlugins
    } = userConfig
    return mergeConfig(config, userConfigWithoutPlugins)
  },
}

export default config
