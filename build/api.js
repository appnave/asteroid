import jetpack from 'fs-jetpack'
import yaml from 'js-yaml'
import path from 'node:path'
import { rimrafSync } from 'rimraf'

const __dirname = import.meta.dirname

const components = path.resolve(__dirname, '../ui/src/components')
const ui = path.resolve(__dirname, '../ui')

const files = jetpack.find(components, { matching: ['**/*.yml', '**/*.yaml'] })

// Clean build artifacts!
rimrafSync('ui/dist/api')

// Create files!
jetpack.dir(`${ui}/dist/api`)

for (const file of files) {
  const name = path.basename(file, path.extname(file))

  const data = yaml.load(
    jetpack.read(file, 'utf8')
  )

  jetpack.write(
    `${ui}/dist/api/${name}.json`,
    JSON.stringify(data, null, 2)
  )
}
