function getVersionLinkCompare ({ nextVersion, latestVersions, isBeta, previousVersion }) {
  const currentVersion = previousVersion || (isBeta ? latestVersions.appExtension.latest : latestVersions.appExtension.stable)

  return (
    `[${nextVersion}]: https://github.com/bildvitta/asteroid/compare/v${currentVersion}...v${nextVersion}?expand=1`
  )
}

module.exports = getVersionLinkCompare
