<template>
  <qas-btn-dropdown v-bind="btnDropdownProps">
    <!-- Seção do botão de filtrar -->
    <template v-if="props.useFilterButton" #btn-content-filtersButton>
      <q-menu ref="filtersButtonMenu" anchor="center right" class="full-width pv-filter-actions" max-width="300px" no-refocus self="top right" @before-hide="onMenuHide" @before-show="onMenuShow" @hide="emit('hide-filters-menu')">
        <div v-if="props.filtersButtonProps.loading" class="q-pa-xl text-center">
          <q-spinner color="grey" size="2em" />
        </div>

        <div v-else-if="props.filtersButtonProps.error" class="q-pa-xl text-center">
          <q-icon color="negative" name="sym_r_warning" size="2em" />
        </div>

        <q-form v-else class="pv-filter-actions__form" @submit.prevent="emit('filter')">
          <div ref="content" class="pv-filter-actions__fields-content q-gutter-y-md q-pt-md q-px-md">
            <div v-for="(field, index) in props.filtersButtonProps.fields" :key="index">
              <qas-field v-model="filtersButtonModel[field.name]" :data-cy="`filters-${field.name}-field`" :field="field" v-bind="props.filtersButtonProps.fieldsProps[field.name]" />
            </div>
          </div>

          <div class="pv-filter-actions__actions q-pa-md q-pb-md q-px-md">
            <qas-actions gutter="sm" spacing-top="none" use-equal-width>
              <template #primary>
                <qas-btn class="full-width" data-cy="filters-submit-btn" label="Filtrar" size="sm" type="submit" variant="primary" />
              </template>

              <template #secondary>
                <qas-btn class="full-width" data-cy="filters-clear-btn" label="Limpar" size="sm" variant="secondary" @click="emit('clear-filters')" />
              </template>
            </qas-actions>
          </div>
        </q-form>
      </q-menu>
    </template>

    <!-- Seção do botão de ordenar -->
    <template v-if="props.useOrderBy" #btn-content-orderBy>
      <q-menu anchor="bottom right" class="qas-menu" self="top right">
        <q-list>
          <q-item v-for="option in props.orderByOptions" :key="option.value" :active="isActive(option.value)" active-class="text-primary" clickable @click="emit('change-order', option.value)">
            <q-item-section>
              <q-item-label>
                {{ option.label }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </template>
  </qas-btn-dropdown>
</template>

<script setup>
import QasActions from '../../actions/QasActions.vue'
import QasBtn from '../../btn/QasBtn.vue'
import QasBtnDropdown from '../../btn-dropdown/QasBtnDropdown.vue'
import QasField from '../../field/QasField.vue'

import { setScrollGradient } from '../../../helpers'

import { useRoute } from 'vue-router'
import { computed, ref, nextTick } from 'vue'

defineOptions({ name: 'PvFiltersActions' })

const props = defineProps({
  filtersButtonProps: {
    default: () => ({}),
    type: Object
  },

  orderByOptions: {
    default: () => ([]),
    type: Array
  },

  useFilterButton: {
    type: Boolean
  },

  useOrderBy: {
    type: Boolean
  },

  isFetchingFilters: {
    type: Boolean
  }
})

// models
const filtersButtonModel = defineModel('filtersButton', { type: Object, default: () => ({}) })

// emits
const emit = defineEmits(['change-order', 'clear-filters', 'filter', 'hide-filters-menu'])

// expose
defineExpose({ hideFiltersMenu })

// template refs
const filtersButtonMenu = ref(null)
const content = ref(null)

// composables
const route = useRoute()

const { initializeScrollGradient, removeScrollGradient } = setScrollGradient({
  styles: {
    gradientLevel: 2
  },

  orientation: 'y'
})

// computeds
const btnDropdownProps = computed(() => {
  return {
    buttonsPropsList: {
      ...(props.useFilterButton && {
        filtersButton: {
          label: 'Filtrar',
          skeleton: props.isFetchingFilters,
          useLabelOnSmallScreen: false,
          icon: 'sym_r_filter_alt',
          'data-cy': 'filters-btn' // manter compatibilidade
        }
      }),

      ...(props.useOrderBy && {
        orderBy: {
          color: 'grey-10',
          label: 'Ordenar',
          useLabelOnSmallScreen: false,
          icon: 'sym_r_swap_vert'
        }
      })
    }
  }
})

// functions
/**
 * Retorna se a opção de ordenação está ativa.
 *
 * @param {string} value
 */
function isActive (value) {
  return route.query.order_by === value
}

function hideFiltersMenu () {
  filtersButtonMenu.value?.hide()
}

/**
 * Precisa usar nextTick com o evento `before-show` ou invés de `show` para evitar um delay na renderização
 * do gradiente, dessa forma o gradiente é aplicado imediatamente após o menu ser exibido.
 */
async function onMenuShow () {
  await nextTick()

  if (content.value) {
    initializeScrollGradient(content.value)
  }
}

function onMenuHide () {
  if (content.value) {
    removeScrollGradient(content.value)
  }
}
</script>

<style lang="scss">
.pv-filter-actions {
  &.q-menu {
    display: flex;
    flex-direction: column;
    max-height: 600px;
    overflow: hidden;
  }

  &__form {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  &__fields-content {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
  }

  &__actions {
    flex: 0 0 auto;
    width: 100%;
  }
}
</style>
