module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:fp/recommended'
  ],
  env: {
    mocha: true
  },
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  plugins: [
    'fp',
    'prettier'
  ],
  rules: {
    'prettier/prettier': ['error', {
      singleQuote: true
    }]
  }
}