// scripts/setup-links.js
const fs = require('fs')

function ensureLink (target, linkPath) {
  try {
    if (fs.existsSync(linkPath)) {
      const stat = fs.lstatSync(linkPath)
      if (stat.isSymbolicLink()) {
        fs.unlinkSync(linkPath)
      } else if (stat.isDirectory()) {
        fs.rmSync(linkPath, { recursive: true, force: true })
      } else {
        fs.unlinkSync(linkPath)
      }
    }
    fs.symlinkSync(target, linkPath, 'junction')
    console.log(`✔ Created symlink: ${linkPath} → ${target}`)
  } catch (err) {
    console.error(`✖ Failed creating symlink ${linkPath}:`, err.message)
  }
}

ensureLink('.agents', '.agent')
ensureLink('.agents', '.claude')

module.exports = ensureLink
