module.exports = {
  extends: "airbnb",
  env: {
    mocha: true
  },
  parserOptions:{
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  }
}
