import { format, parseISO, isMatch } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Private
function __format (value, token, options = {}) {
  if (!value) {
    return ''
  }

  value = value instanceof Date ? value : parseISO(value)
  return format(value, token, { locale: ptBR, ...options })
}

function _formatNumericValues (value, options = {}) {
  const numericValue = Number(value)

  if (value === null || value === undefined || isNaN(numericValue)) {
    return ''
  }

  return numericValue.toLocaleString('pt-BR', options)
}

// Asset
function asset (value) {
  const bucketURL = process.env.BUCKET_URL || location.origin

  return value ? `${bucketURL}/${value}` : ''
}

// Date
function date (value, token = 'dd/MM/yyyy', options) {
  return __format(value, token, options)
}

function dateTime (value, token = "dd/MM/yyyy 'às' HH:mm:ss", options) {
  return __format(value, token, options)
}

function time (value, token = 'HH:mm', options) {
  return isMatch(value, token) ? value : __format(value, token, options)
}

function humanDate (value, token = "dd 'de' MMMM 'de' yyyy 'as' HH:mm:ss", options) {
  return __format(value, token, options)
}

// Number
function decimal (value = 0) {
  value = Number(value)
  return value ? value.toLocaleString('pt-BR') : ''
}

function money (value = 0, options = { style: 'currency', currency: 'BRL' }) {
  return _formatNumericValues(value, options)
}

function percent (value = 0, places = 2) {
  value = Number(value)
  return value ? (value / 100).toLocaleString('pt-BR', { style: 'percent', minimumFractionDigits: places }) : ''
}

function squareArea (value = 0, suffix = 'm²') {
  value = decimal(value)
  return value ? `${value} ${suffix}` : ''
}

function formatPercent (value = 0, places = 2) {
  return _formatNumericValues(value, { style: 'percent', minimumFractionDigits: places })
}

/**
 * Formata documento de empresa (CNPJ) aplicando máscara XX.XXX.XXX/XXXX-XX
 * Aceita caracteres alfanuméricos (letras e números)
 *
 * @param {string} value - String com 14 caracteres
 * @returns {string} - String formatada como CNPJ
 *
 * @example
 * formatCompanyDocument('12345678000195') // '12.345.678/0001-95'
 * formatCompanyDocument('ODH8LCRV000146') // 'OD.H8L.CRV/0001-46'
 */
function formatCompanyDocument (value) {
  return value.replace(
    /^([A-Za-z0-9]{2})([A-Za-z0-9]{3})([A-Za-z0-9]{3})([A-Za-z0-9]{4})([A-Za-z0-9]{2})/g,
    '$1.$2.$3/$4-$5'
  )
}

function formatDocument (value) {
  return value.length < 12
    ? formatPersonalDocument(value)
    : formatCompanyDocument(value)
}

function formatPersonalDocument (value) {
  return value.replace(/^(\d{3})\D*(\d{3})\D*(\d{3})\D*(\d{2})$/g, '$1.$2.$3-$4')
}

function formatPhone (value) {
  return value.replace(/^(\d{2})\D*(\d{5}|\d{4})\D*(\d{4})$/g, '($1) $2-$3')
}

function formatPostalCode (value) {
  return value.replace(/^(\d{5})\D*(\d{3})$/g, '$1-$2')
}

function handleMasks (value) {
  return {
    'company-document': () => formatCompanyDocument(value),
    document: () => formatDocument(value),
    'personal-document': () => formatPersonalDocument(value),
    phone: () => formatPhone(value),
    'postal-code': () => formatPostalCode(value),
    decimal: () => decimal(value),
    money: () => money(value),
    'square-area': () => squareArea(value)
  }
}

// Labels
function humanize (field = {}, value) {
  if (field.mask && !value) return value

  const mappedMasks = handleMasks(value)

  if (mappedMasks[field.mask]) {
    return mappedMasks[field.mask]()
  }

  switch (field.type) {
    case 'boolean': return booleanLabel(value)
    case 'select': return selectLabel(field.options, value, field.multiple)
    case 'date': return date(value)
    case 'datetime': return dateTime(value)
    case 'time': return time(value)
    case 'radio': return selectLabel(field.options, value)
    case 'percent': return formatPercent(value)
    case 'money': return money(value)
    case 'decimal': return decimal(value)
    default: return value
  }
}

function selectLabel (options, value, multiple) {
  return multiple ? multipleOptionsLabel(options, value) : optionLabel(options, value)
}

function multipleOptionsLabel (options, value) {
  return value.map(itemValue => optionLabel(options, itemValue))
}

function optionLabel (options = [], value) {
  return (options.find(option => String(option.value) === String(value)) || {}).label || ''
}

function parseValue (value) {
  try { return JSON.parse(value) } catch { return value }
}

function booleanLabel (value, trueLabel = 'sim', falseLabel = 'não') {
  try { return JSON.parse(value) ? trueLabel : falseLabel } catch { return value }
}

export {
  asset,
  booleanLabel,
  date,
  dateTime,
  decimal,
  formatCompanyDocument,
  formatDocument,
  formatPercent,
  formatPersonalDocument,
  formatPhone,
  formatPostalCode,
  handleMasks,
  humanDate,
  humanize,
  money,
  optionLabel,
  parseValue,
  percent,
  squareArea
}
