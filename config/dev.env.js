'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"//localhost:8083/server"',
  BASE_API: '"//peake.mynatapp.cc/server"',
})
