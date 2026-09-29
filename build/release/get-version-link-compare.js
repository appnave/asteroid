function getVersionLinkCompare ({ nextVersion, latestVersions, isBeta }) {
  const currentVersion = isBeta ? latestVersions.appExtension.latest : latestVersions.appExtension.stable

  return (
    `[${nextVersion}]: https://github.com/bildvitta/asteroid/compare/v${currentVersion}...v${nextVersion}?expand=1`
  )
}

export default getVersionLinkCompare
