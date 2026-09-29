import jetpack from 'fs-jetpack' // https://github.com/szwacz/fs-jetpack
import path from 'node:path' // https://nodejs.org/api/path.html

function getAppExtensionPackage (packages) {
  // recupera o package.json
  const appExtensionPackage = packages['app-extension']
  const packagePath = `${appExtensionPackage.path}package.json`
  const resolvedPackagePath = path.resolve(packagePath)

  return {
    packageData: jetpack.read(resolvedPackagePath, 'json'),
    resolvedPackagePath
  }
}

export default getAppExtensionPackage
