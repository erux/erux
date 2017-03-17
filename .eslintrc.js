module.exports = {
  extends: "eslint:recommended",
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
    'prettier'
  ],
  rules: {
    'prettier/prettier': ['error', {
      singleQuote: true
    }]
  }
}