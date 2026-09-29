const path = require('path')
const requireIndex = require('requireindex')

module.exports = {
  meta: {
    name: 'eslint-plugin-asteroid',
    version: '2.0.0'
  },
  rules: requireIndex(path.join(__dirname, '/rules'))
}
