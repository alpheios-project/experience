const rollup = require('rollup')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

const defaultPlugins = [
  resolve({
    // use "module" field for ES6 module if possible
    module: true, // Default: true
    jsnext: true,  // Default: false
    main: true,  // Default: true
    browser: true  // Default: false
  }),
  commonjs({
    sourceMap: true  // Default: true
  })
]

// ES6 Bundle
rollup.rollup({
  input: 'src/index.js',
  plugins: defaultPlugins
}).then(bundle => {
  bundle.write({
    file: 'dist/experience.mjs',
    format: 'es',
    sourcemap: false
  })
}).catch(reason => {
  'use strict'
  console.error(reason)
})

// CommonJS Bundle
rollup.rollup({
  input: 'src/index.js',
  plugins: defaultPlugins
}).then(bundle => {
  bundle.write({
    file: 'dist/experience.common.js',
    format: 'cjs',
    sourcemap: false
  })
}).catch(reason => {
  'use strict'
  console.error(reason)
})
