const WindiCSSWebpackPlugin = require('windicss-webpack-plugin')
const path = require('path')

module.exports = {
  reactStrictMode: true,
  images: {
    loader: 'custom'
  },
  trailingSlash: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  },
  webpack: (config) => {
    config.plugins.push(new WindiCSSWebpackPlugin())
    return config
  },
  eslint: {
    ignoreDuringBuilds: true
  }
}
