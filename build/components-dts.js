import jetpack from 'fs-jetpack'
import path from 'node:path'

const __dirname = import.meta.dirname

const src = path.resolve(__dirname, '../ui/src')
const components = path.resolve(src, 'components')
const output = path.resolve(src, 'components.d.ts')

// Mesmo critério do "unplugin-vue-components" da app-extension, ignorando os componentes privados
const files = jetpack
  .find(components, { matching: ['**/Qas*.vue', '!**/private/**'] })
  .map(file => path.relative(src, file).replaceAll('\\', '/'))
  .sort((a, b) => path.basename(a).localeCompare(path.basename(b)))

const entries = files.map(file => {
  const name = path.basename(file, '.vue')

  return `    ${name}: typeof import('./${file}')['default']`
})

const content = `/* eslint-disable */
// Arquivo gerado automaticamente pelo "build/components-dts.js", não altere manualmente.
// Registra os componentes globais do asteroid para o autocomplete do editor (Volar).
export {}

declare module 'vue' {
  export interface GlobalComponents {
${entries.join('\n')}
  }
}
`

jetpack.write(output, content)

console.log(`${entries.length} componentes registrados em "${path.relative(process.cwd(), output)}".`)
