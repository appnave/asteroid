import { computed, ref } from 'vue'
import { LocalStorage, is } from 'quasar'

const filterQuery = ref({})

const defaultFiltersHooks = {
  defaultFiltersChange: []
}

/**
 * Define os filtros padrão antes de entrar na rota.
 *
 * Prioridade de aplicação dos filtros:
 * 1 - Se o filtro estiver salvo no estado global, então utiliza ele.
 * 2 - Se o filtro já estiver na query, então utiliza ele.
 * 3 - Se o filtro já estiver salvo no LocalStorage, então utiliza ele.
 *
 * Comportamento entre mesma entidade variando telas com multiple: true|false:
 * 1 - Se minha tela atual for de múltiplos registros e a próxima for de um único registro,
 * então o filtro será aplicado apenas no primeiro item.
 * 2 - Se minha tela atual for de um único registro e a próxima for de múltiplos registros,
 * então o filtro será aplicado em todos os registros.
 * 3 - Se minha tela atual e a próxima forem de múltiplos registros, então o filtro será aplicado
 * em todos os registros.
 *
 * @param {object} to - Rota de destino.
 * @param {object} _from - Rota de origem.
 * @param {function} next - Função de redirecionamento.
 * @param {array|object} queryList='company' - Lista de filtros a serem aplicados.
 *
 * @example
 * ```js
 * setDefaultFiltersBeforeEnter(to, from, next)
 * setDefaultFiltersBeforeEnter(to, from, next, ['company', 'properties'])
 * setDefaultFiltersBeforeEnter(to, from, next, { company: false, properties: true // multiple })
 * ```
 */
export function setDefaultFiltersBeforeEnter (to, _from, next, queryList = ['company']) {
  const { getDefaultFiltersFromStorage, setFilterQuery } = useDefaultFilters()

  const { query } = to
  const newQuery = { ...query }

  const isQueryListArray = Array.isArray(queryList)
  const normalizedQueryList = isQueryListArray ? {} : queryList

  /**
   * Meta no qual será utilizado para recuperar os filtros padrão de determinada rota.
   * Será utilizado no boot beforeEach, sendo que ele sempre garantirá que caso eu vá para a mesma tela de origem (normalmente
   * em caso de menu ou breadcrumb), os filtros padrões não se percam, pois o beforeEnter não é chamado novamente ao ir
   * para a mesma rota.
   */
  to.meta = { ...to.meta, defaultFilters: normalizedQueryList }

  // normaliza sempre o queryList para um objeto
  if (isQueryListArray) {
    queryList.forEach(name => { normalizedQueryList[name] = false })
  }

  // recupera os filtros padrão do LocalStorage
  const defaultFiltersFromStorage = getDefaultFiltersFromStorage()

  for (const key in normalizedQueryList) {
    const filterQueryValue = filterQuery.value[key]

    // 1. se o filtro já estiver salvo no estado, então utiliza ele
    if (filterQueryValue) {
      // se normalizedQueryList[key] for "true" (multiple) então utiliza o filtro completo
      if (normalizedQueryList[key]) {
        newQuery[key] = filterQueryValue
        continue
      }

      // filterQueryValue é um array, então pega o primeiro item
      newQuery[key] = Array.isArray(filterQueryValue) ? filterQueryValue?.at(0) : filterQueryValue
      continue
    }

    // 2. se o filtro já estiver na query, então utiliza ele
    if (query[key]) {
      setFilterQuery(query[key], key)

      continue
    }

    const storedFilter = defaultFiltersFromStorage[key]

    // 3. se o filtro já estiver salvo no LocalStorage, então utiliza ele
    if (storedFilter) {
      setFilterQuery(storedFilter, key)
      newQuery[key] = storedFilter
    }
  }

  /**
   * Verifica se houve mudanças na query antes de redirecionar, sem essa validação
   * o redirecionamento ocorre mesmo que a query seja a mesma, gerando loop infinito.
   */
  if (!is.deepEqual(newQuery, query)) return next({ ...to, query: newQuery, replace: true })

  next()
}

/**
 * Função na qual valida os seguintes cenários:
 * 1 - Se estou indo para a mesma rota;
 * 2 - Se a rota tem o beforeEnter (normalmente usado com o método setDefaultFiltersBeforeEnter);
 * 3 - Se a rota de origem tem filtros padrões.
 * 4 - Se a rota de destino nao tem query.
 *
 * Devido o beforeEnter não ser chamado caso tente ir para a mesma rota (caso eu clique no menu ou no breadcrumbs), os filtros serao
 * perdidos. Sendo assim, necessário validar pelo beforeEach as regras acima, para assim eu garantir que quando eu for para a mesma tela,
 * eu tenha os filtros padrões aplicados (que são definidos no beforeEntar pelo método setDefaultFiltersBeforeEnter).
 *
 * @param {object} to - Rota de destino.
 * @param {object} from - Rota de origem.
 * @param {function} next - Função de redirecionamento.
 */
export function setDefaultFiltersBeforeEach (to, from, next) {
  const isSameRoute = to.name === from.name
  const hasBeforeEnter = () => to.matched.some(record => record.beforeEnter)
  const defaultFiltersFromQuery = from.meta.defaultFilters

  if (isSameRoute && !!defaultFiltersFromQuery && hasBeforeEnter()) {
    // Caso for a mesma rota e tenha beforeEnter, necessário setar o to.meta também para não perder os filtros padrões.
    to.meta = { ...to.meta, defaultFilters: defaultFiltersFromQuery }

    const defaultFiltersList = Object.keys(from.meta.defaultFilters || {})
    const defaultFilters = {}

    // Loopa com base na lista de filtros padrões da rota e seto as chaves com os filtros da rota de origem.
    defaultFiltersList.forEach(key => {
      defaultFilters[key] = from.query[key]
    })

    const hasQuery = !!Object.keys(to.query).length

    // Se a rota de destino nao tem query, eu redireciono para ela com os filtros padrões aplicados.
    if (!hasQuery) return next({ ...to, query: defaultFilters, replace: true })
  }

  next()
}

/**
 * Este composable recupera os filtros default salvos no LocalStorage na chave 'defaultFilters'.
 */
export default function useDefaultFilters () {
  const hasFilterQuery = computed(() => !!Object.keys(filterQuery.value).length)

  function setFilterQuery (query, name = 'company') {
    filterQuery.value[name] = query
  }

  function getDefaultFiltersFromStorage () {
    const defaultFiltersFromStorage = LocalStorage.getItem('defaultFilters') || {}

    return defaultFiltersFromStorage
  }

  function triggerDefaultFiltersChange (newFilters, oldFilters) {
    // necessário verificar se houve mudanças antes de disparar o evento para não duplicar.
    if (is.deepEqual(newFilters, oldFilters)) return

    defaultFiltersHooks.defaultFiltersChange.forEach(hook => hook(newFilters, oldFilters))
  }

  function onDefaultFiltersChange (callback) {
    defaultFiltersHooks.defaultFiltersChange.push(callback)
  }

  function removeOnDefaultFiltersChange (callback) {
    const index = defaultFiltersHooks.defaultFiltersChange.indexOf(callback)

    if (~index) defaultFiltersHooks.defaultFiltersChange.splice(index, 1)
  }

  return {
    filterQuery,
    hasFilterQuery,
    getDefaultFiltersFromStorage,
    onDefaultFiltersChange,
    removeOnDefaultFiltersChange,
    setFilterQuery,
    triggerDefaultFiltersChange
  }
}
