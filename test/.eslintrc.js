module.exports = {
  rules: {
    // These are allowed in Mocha test code
    // but not production side code
    'fp/no-unused-expression': 'off',
    'fp/no-nil': 'off'
  }
}