/**
 * Função para filtrar propriedades especificas dentro de um objeto
 *
 * @param {object} fields objeto com propriedades
 * @param {array} models array de string com nomes das propriedades que serão filtradas
 * @returns {object} objeto com propriedades filtradas
 *
 * @example
 * filterObject({
 *  name: { label: 'Nome', value: 1 },
 *  email: { label: 'E-mail', value: 2 }
 * }, ['name'])
 */
export default function (fields = {}, models) {
  if (!models.length) return fields

  if (!Object.keys(fields).length) {
    return {}
  }

  const object = {}

  models.forEach(model => {
    if (Object.hasOwn(fields, model)) {
      object[model] = fields[model]
    }
  })

  return object
}
