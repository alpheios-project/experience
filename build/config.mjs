const webpack = {
  common: {
    entry: './index.js',
    externals: {
      'uuid': 'uuid'
    }
  },

  production: {
    output: {filename: 'alpheios-experience.min.js'}
  },
  development: {
    output: {filename: 'alpheios-experience.js'}
  }
}

export { webpack }
