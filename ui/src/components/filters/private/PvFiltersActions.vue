<template>
  <qas-btn-dropdown v-bind="btnDropdownProps">
    <!-- Seção do botão de filtrar -->
    <template v-if="props.useFilterButton" #btn-content-filtersButton>
      <q-menu ref="filtersButtonMenu" anchor="center right" class="full-width" max-width="270px" no-refocus self="top right" @hide="emit('hide-filters-menu')">
        <div v-if="props.filtersButtonProps.loading" class="q-pa-xl text-center">
          <q-spinner color="grey" size="2em" />
        </div>

        <div v-else-if="props.filtersButtonProps.error" class="q-pa-xl text-center">
          <q-icon color="negative" name="sym_r_warning" size="2em" />
        </div>

        <q-form v-else class="q-gutter-y-md q-pa-md" @submit.prevent="emit('filter')">
          <div v-for="(field, index) in props.filtersButtonProps.fields" :key="index">
            <qas-field v-model="filtersButtonModel[field.name]" :data-cy="`filters-${field.name}-field`" :field="field" v-bind="props.filtersButtonProps.fieldsProps[field.name]" />
          </div>

          <qas-actions gutter="sm" use-equal-width>
            <template #primary>
              <qas-btn class="full-width" data-cy="filters-submit-btn" label="Filtrar" size="sm" type="submit" variant="primary" />
            </template>

            <template #secondary>
              <qas-btn class="full-width" data-cy="filters-clear-btn" label="Limpar" size="sm" variant="secondary" @click="emit('clear-filters')" />
            </template>
          </qas-actions>
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

import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'

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

// composables
const route = useRoute()

// computeds
const btnDropdownProps = computed(() => {
  return {
    buttonsPropsList: {
      ...(props.useFilterButton && {
        filtersButton: {
          label: 'Filtrar',
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
</script>
