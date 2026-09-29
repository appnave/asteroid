function isIndex (fileName) {
  return !!fileName.toLowerCase().match(/^index\./)
}

const pageModules = import.meta.glob('../pages/**/*.{md,vue}')

export default function () {
  return Object.keys(pageModules).map(key => {
    const filePath = key.replace(/^\.\.\/pages\//, '')
    const fileName = filePath.replace(/^.*[\\/]/, '')

    const path = filePath.replace(isIndex(fileName) ? /[^/]*$/ : /\.\w+$/, '')

    return { component: pageModules[key], path }
  })
}
