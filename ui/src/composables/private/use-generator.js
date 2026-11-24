import isObject from 'lodash-es/isObject'
import { Spacing } from '../../enums/Spacing'
import { gutterValidator } from '../../helpers/private/gutter-validator'
import useScreen from '../use-screen'
import { isEmpty, humanize, filterObject } from '../../helpers'

import { computed, useSlots } from 'vue'

const IRREGULAR_CLASSES = ['col', 'col-auto', 'fit']

export const baseProps = {
  columns: {
    default: () => [],
    type: [Array, String, Object]
  },

  commonColumns: {
    default: () => ({}),
    type: [Object, String]
  },

  fields: {
    default: () => ({}),
    type: Object
  },

  gutter: {
    default: undefined,
    type: [String, Boolean],
    validator: gutterValidator
  }
}

/**
 * Composition para ser utilizada no QasGridGenerator e QasFormGenerator.
 *
 * @function
 * @name useGenerator
 * @param {Object} options - Opções do componente.
 * @param {baseProps} options.props - Propriedades do componente.
 * @param {boolean} options.isGrid - Propriedades do componente.
 * @returns {{
 *  classes: classes,
 *  getFieldClass: getFieldClass
 * }}
 */
export default function ({ props = {}, isGrid = false }) {
  const screen = useScreen()

  const slots = useSlots()

  /**
   * Se a propriedade gutter não for passada, será calculada automaticamente.
   * se for usado no grid e for inline, o gutter será menor.
   */
  const defaultGutter = computed(() => {
    if (props.gutter !== undefined) return props.gutter

    return isGrid && (props.useInline && !screen.isSmall) ? Spacing.Sm : Spacing.Md
  })

  /**
   * @type {{ value: string[] | string }}
   */
  const classes = computed(() => {
    const classesList = ['row']

    if (defaultGutter.value) {
      classesList.push(`q-col-gutter-${defaultGutter.value}`)
    }

    return classesList
  })

  /**
   * @function
   * @param {Object} options
   * @param {number} options.index - Index do campo.
   * @param {boolean} options.isGridGenerator - Indica se é um gerador de grid (QasGridGenerator).
   * @param {Object[string]} options.fields - Campos normalizados.
   * @returns {(string|string[])}
   */
  function getFieldClass ({ index, isGridGenerator, fields }) {
    if (typeof props.columns === 'string') return _getStringColumns(props.columns)

    return Array.isArray(props.columns)
      ? _handleColumnsByIndex({ index, isGridGenerator, fields })
      : _handleColumnsByField({ index, isGridGenerator })
  }

  function getFieldSetColumnClass (column) {
    if (!column) return 'col-12'

    return typeof column === 'string' ? _getStringColumns(column) : _getBreakpoint(column)
  }

  /**
   * Normaliza as propriedades do header, e a tipografia com base se é um subset.
   *
   * @function
   * @param {Object} options
   * @param {Object} options.values - Contém as propriedades de um fieldset/subset.
   * @param {boolean} options.isSubset - Verifica se o header será usado em um subset.
   *
   * @returns {Object} Retorna as propriedades do header.
   */
  function getHeaderProps ({ values, isSubset }) {
    const typography = isSubset ? 'h5' : 'h4'

    // Separa as propriedades de label e o restante.
    const { labelProps, ...headerProps } = values.headerProps || {}

    return {
      description: values.description,

      // Mesmo que passado a tipografia no headerProps, a tipografia é sobreposta para manter a hierarquia sempre.
      labelProps: {
        ...labelProps,
        ...(values.label && { label: values.label }),
        typography
      },

      ...headerProps
    }
  }

  /**
   * Normaliza o objeto para retornar um fieldset.
   *
   * @function
   * @param {Object} params
   * @param {Object} params.items - Objeto contendo a estrutura de um fieldset ou subset
   * @param {Object} params.fields - Campos
   * @param {Object} params.result - Resultado com base nos fields
   * @param {boolean} params.isGrid - Chave para indicar se é um grid-generator.
   * @param {boolean} params.useEmptyResult - Se o resultado de algum campo for vazio e esta propriedade for "false", ele remove todo o campo.
   *
   * @returns {Object} - Retorna um objeto com a estrutura do fieldset.
   */
  function getNormalizedFields (params) {
    const result = {}

    for (const key in params.items) {
      const item = params.items[key]

      // Propriedades que são recebidas em cada fieldset / subset desconstruida
      const {
        label,
        description,
        headerProps,
        column,
        buttonProps,
        fields = [],
        subset = {},
        useSeparator
      } = item

      // Valida caso tenha um header
      const hasHeader = !!(label || description || Object.keys(headerProps || {}).length)

      // Valida caso tenha um subset dentro de um fieldset
      const hasSubset = !!Object.keys(subset).length

      // Estrutura de um fieldset e subset
      const structure = {
        label,
        description,
        column,
        buttonProps,
        headerProps,
        useSeparator,
        fields: {},

        subset: hasSubset
          ? getNormalizedFields({
            items: subset,
            isGrid: params.isGrid,
            fields: params.fields,
            result: params.result,
            useEmptyResult: params.useEmptyResult
          })
          : {},

        // Propriedades auxiliares para controle na view
        __hasHeader: hasHeader,
        __hasSubset: hasSubset,
        __hasFieldset: true
      }

      /**
       * Pegar os fields com base na key. É feito essa lógica porque o filterObject no caso de passar um array vazio
       * para as keys, ele retorna todos os fields, e o comportamento esperado é que retorne um objeto vazio.
       */
      const fieldsByfieldsKeys = fields.length ? filterObject(params.fields, fields) : {}

      /**
       * Foi adicionado essa lógica para o grid-generator, pois cada field deve ter o "formattedResult", onde o
       * "formattedResult" é basicamente o result formatado com base no tipo do field através do humanize,
       * exemplo: field do tipo "date", virá do back "2025-08-20", e deverá exibir "20/08/2025".
       */
      if (params.isGrid) {
      // Adicionar "formattedResult" com base no result.
        const formattedFields = getFieldsByResult({
          fields: fieldsByfieldsKeys,
          result: params.result,
          useEmptyResult: params.useEmptyResult
        })

        // Adiciona o fields no structure
        Object.assign(structure.fields, formattedFields)
      } else {
        Object.assign(structure.fields, fieldsByfieldsKeys)
      }

      result[key] = structure
    }

    return result
  }

  /**
   * Para todos campos passados, adiciona o "formattedResult" já formatado com base no result
   *
   * @function
   * @param {Object} params
   * @param {Object} params.fields - Campos
   * @param {Object} params.result - Resultado com base nos fields
   * @param {boolean} params.useEmptyResult - Se o resultado de algum campo for vazio e esta propriedade for "false", ele remove todo o campo.
   *
   * @returns {Object} - Retorna os "fields" com um "formattedResult" pra cada field.
   */
  function getFieldsByResult ({ fields, result, useEmptyResult }) {
    const hasFields = Object.keys(fields).length
    const hasResult = Object.keys(result).length

    if (!hasResult || !hasFields) return {}

    const unformattedResult = { ...result }
    const fieldsByResult = {}

    /**
     * Retorna os "fields" com base na prop "useEmptyResult". se ela for "false",
     * ela remove todo campo com valor vazio.
     */
    const formattedFields = getFormattedFields({ fields, result, hasResult, useEmptyResult })

    for (const key in formattedFields) {
      const field = formattedFields[key] || {}

      if (!field.type) continue

      // Formata o result com base no "type", exemplo tipo date: "2025-08-20" -> "20/08/2025"
      const humanizedResult = humanize(field, unformattedResult[key])

      const formattedResult = isEmpty({ value: humanizedResult }) ? props.emptyResultText : humanizedResult

      fieldsByResult[key] = {
        ...field,
        formattedResult
      }
    }

    return fieldsByResult
  }

  /**
   * @private
   *
   * @function
   * @param {Object} params
   * @param {Object} params.fields - Campos
   * @param {Object} params.result - Resultado com base nos fields
   * @param {boolean} params.hasResult - Casotenha resultado
   * @param {boolean} params.useEmptyResult - Se o resultado de algum campo for vazio e esta propriedade for "false", ele remove todo o campo.
   *
   * @returns {Object} - Retorna os "fields" formatados, caso a propriedade "useEmptyResult" seja "true",
   * retorna todos os "fields", mesmo que não tenha resultado. Caso a propriedade "useEmptyResult" seja "false",
   * retorna apenas os "fields" que possuem resultado.
   */
  function getFormattedFields ({ fields, result, hasResult, useEmptyResult }) {
    if (useEmptyResult) return fields

    if (!hasResult) return {}

    const formattedFields = {}

    for (const key in fields) {
      const currentResult = result[key]

      // Verifica se o field tem result, caso tenha, adiciona no "formattedFields"
      const validate = Array.isArray(currentResult)
        ? currentResult.length
        : isObject(currentResult) ? Object.keys(currentResult).length : result

      if (validate) {
        formattedFields[key] = fields[key]
      }
    }

    return formattedFields
  }

  /**
   * @private
   */
  function _getStringColumns (columns) {
    return IRREGULAR_CLASSES.includes(columns) ? columns : `col-${columns}`
  }

  /**
   * @private
   */
  function _getBreakpoint (columns) {
    const classes = []

    const profiles = {
      col: 'col',
      xs: 'col-xs',
      sm: 'col-sm',
      md: 'col-md',
      lg: 'col-lg',
      xl: 'col-xl'
    }

    const { fieldProps, classes: renamedClasses, ...formattedColumns } = columns || {}

    for (const key in formattedColumns) {
      const value = formattedColumns[key]

      if (IRREGULAR_CLASSES.includes(value)) {
        classes.push(value === 'col' ? profiles[key] : value)
      } else {
        classes.push(`${profiles[key]}-${value}`)
      }
    }

    return [...classes, renamedClasses]
  }

  /**
   * @private
  */
  function _getDefaultColumnClass (isGridGenerator) {
    if (typeof props.commonColumns === 'string') return _getStringColumns(props.commonColumns)

    if (Object.keys(props.commonColumns).length) return _getBreakpoint(props.commonColumns)

    return isGridGenerator ? 'col-6 col-xs-12 col-sm-4' : 'col-6'
  }

  /**
   * @private
  */
  function _handleColumnsByField ({ index, isGridGenerator }) {
    /*
     * Quando não é passado columns, retornará o default.
     */
    if (!props.columns[index]) {
      return _getDefaultColumnClass(isGridGenerator)
    }

    /*
     * Quando é passado um objeto por field.
     */
    return _getBreakpoint(props.columns[index])
  }

  /**
   * @private
  */
  function _handleColumnsByIndex ({ index, isGridGenerator, fields }) {
    const normalizedFields = isGridGenerator ? props.fields : {}

    if (!isGridGenerator) {
      for (const key in fields) {
        Object.assign(normalizedFields, fields[key].fields.visible)
      }
    }

    if (!Array.isArray(normalizedFields)) {
      index = Object.keys(normalizedFields).findIndex(field => field === index)
    }

    const length = props.columns.length

    if (!length) {
      return _getDefaultColumnClass(isGridGenerator)
    }

    return _getBreakpoint(props.columns[index])
  }

  /**
   * Verifica se o slot legend-bottom está sendo utilizado para o fieldset ou subset
   * @param {Object} params - Parâmetros da função
   * @param {string} params.fieldset - Nome do fieldset
   * @param {string} [params.subset] - Nome do subset (opcional)
   * @param {string} params.type - Tipo do slot (top ou bottom)
   * @returns {boolean} true se o slot legend-bottom estiver sendo utilizado
   */
  function hasLegendSectionSlot ({ fieldset, subset, type }) {
    return subset
      ? !!slots[`legend-${type}-${fieldset}-${subset}`]
      : !!slots[`legend-${type}-${fieldset}`]
  }

  return {
    classes,

    getFieldClass,
    getFieldSetColumnClass,

    getHeaderProps,
    getNormalizedFields,
    getFieldsByResult,

    hasLegendSectionSlot
  }
}
