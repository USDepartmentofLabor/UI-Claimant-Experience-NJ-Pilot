module.exports = {
  staticDirs: ['../public'],
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    'storybook-addon-next',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  webpackFinal: async (config) => {
    config.resolve.fallback.fs = false

    config.module.rules.forEach((rule) => {
      rule.use?.forEach((loader, i) => {
        loader === 'postcss-loader' &&
          // eslint-disable-next-line security/detect-object-injection
          (rule.use[i] = {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      autoprefixer: {
                        flexbox: 'no-2009',
                        grid: 'autoplace',
                      },
                      stage: 3,
                      features: {
                        'custom-properties': false,
                      },
                    },
                  ],
                ],
              },
            },
          })
      })
    })

    return config
  },
}
