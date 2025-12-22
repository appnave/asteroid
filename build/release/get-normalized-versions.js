function getNormalizedVersions (versions = {}) {
  const normalizedVersion = {
    beta: {},
    stable: {},
    alpha: {},
    all: {}
  }

  const nonAcceptableKey = ['created', 'modified']

  for (const key in versions) {
    if (nonAcceptableKey.includes(key)) continue

    normalizedVersion.all[key] = versions[key]

    const keyVersion = key.includes('-alpha') ? 'alpha' : key.includes('-beta') ? 'beta' : 'stable'

    normalizedVersion[keyVersion][key] = versions[key]
  }

  return normalizedVersion
}

module.exports = getNormalizedVersions
