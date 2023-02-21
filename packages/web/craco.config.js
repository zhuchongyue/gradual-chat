
const { CracoAliasPlugin } = require('react-app-alias')
module.exports =  {
  // devServer: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:3000/',
  //       changeOrigin: true,
  //       // pathRewrite: {
  //       // }
  //     }
  //   }
  // }
  plugins: [
    {
      plugin: CracoAliasPlugin
    }
  ]
}