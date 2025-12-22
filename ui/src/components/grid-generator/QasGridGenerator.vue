<template>
  <component :is="component.is" v-bind="component.props">
    <div class="column q-col-gutter-y-lg">
      <div v-for="(fieldsetItem, fieldsetItemKey) in normalizedFields" :key="fieldsetItemKey" class="full-width">
        <q-separator v-if="hasSeparator({ item: fieldsetItem })" class="q-mb-lg" />

        <qas-header v-if="fieldsetItem.__hasHeader" v-bind="getHeaderProps({ values: fieldsetItem })" />

        <div :class="classes">
          <div v-for="(field, key) in fieldsetItem.fields" :key="key" :class="getContainerClasses({ key })">
            <slot :field="field" :name="`field-${field.name}`">
              <qas-grid-item v-bind="getGridItemProps(field)">
                <template #header>
                  <slot :field="field" :name="`header-field-${field.name}`">
                    <slot :field="field" name="header">
                      <div :class="headerClasses" :data-cy="`grid-generator-${field.name}-field`" :title="getTitle(field, 'label')">
                        {{ field.label }}
                      </div>
                    </slot>
                  </slot>
                </template>

                <template #content>
                  <slot :field="field" :name="`content-field-${field.name}`">
                    <slot :field="field" name="content">
                      <div :class="getContentClasses(field)" :data-cy="`grid-generator-${field.name}-result`" :title="getTitle(field, 'formattedResult')">
                        {{ field.formattedResult }}
                      </div>
                    </slot>
                  </slot>
                </template>
              </qas-grid-item>
            </slot>
          </div>
        </div>

        <div v-if="fieldsetItem.__hasSubset" class="q-gutter-y-md q-mt-md">
          <div v-for="(subsetItem, subsetKey) in fieldsetItem.subset" :key="subsetKey">
            <div v-if="hasSeparator({ item: subsetItem, isSubset: true })" class="q-pb-md">
              <q-separator />
            </div>

            <qas-header v-if="subsetItem.__hasHeader" v-bind="getHeaderProps({ values: subsetItem, isSubset: true })" />

            <div :class="classes">
              <div v-for="(field, key) in subsetItem.fields" :key="key" :class="getContainerClasses({ key })">
                <slot :field="field" :name="`field-${field.name}`">
                  <qas-grid-item v-bind="getGridItemProps(field)">
                    <template #header>
                      <slot :field="field" :name="`header-field-${field.name}`">
                        <slot :field="field" name="header">
                          <div :class="headerClasses" :data-cy="`grid-generator-${field.name}-field`" :title="getTitle(field, 'label')">
                            {{ field.label }}
                          </div>
                        </slot>
                      </slot>
                    </template>

                    <template #content>
                      <slot :field="field" :name="`content-field-${field.name}`">
                        <slot :field="field" name="content">
                          <div :class="getContentClasses(field)" :data-cy="`grid-generator-${field.name}-result`" :title="getTitle(field, 'formattedResult')">
                            {{ field.formattedResult }}
                          </div>
                        </slot>
                      </slot>
                    </template>
                  </qas-grid-item>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </component>
</template>

<script setup>
import QasBox from '../box/QasBox.vue'
import QasGridItem from '../grid-item/QasGridItem.vue'
import QasHeader from '../header/QasHeader.vue'

import useGenerator, { baseProps } from '../../composables/private/use-generator'
import { useScreen } from '../../composables'
import { computed } from 'vue'

// define component name
defineOptions({ name: 'QasGridGenerator' })

const screen = useScreen()

// props
const props = defineProps({
  ...baseProps,

  boxProps: {
    type: Object,
    default: () => ({})
  },

  contentClass: {
    type: [Array, Object, String],
    default: ''
  },

  fieldset: {
    type: Object,
    default: () => ({})
  },

  fieldsProps: {
    type: Object,
    default: () => ({})
  },

  headerClass: {
    type: [Array, Object, String],
    default: ''
  },

  headerProps: {
    type: Object,
    default: () => ({})
  },

  emptyResultText: {
    type: String,
    default: '-'
  },

  result: {
    type: Object,
    default: () => ({})
  },

  useBox: {
    type: Boolean
  },

  useEmptyResult: {
    type: Boolean,
    default: true
  },

  useEllipsis: {
    type: Boolean,
    default: true
  },

  useInline: {
    type: Boolean
  }
})

// composables
const {
  classes,
  getFieldClass,
  getHeaderProps,
  getNormalizedFields,
  getFieldsByResult
} = useGenerator({ props, isGrid: true })

// computeds
const component = computed(() => {
  return {
    is: props.useBox ? QasBox : 'div',
    props: props.useBox ? props.boxProps : {}
  }
})

const headerClasses = computed(() => {
  return [
    props.headerClass,

    {
      ellipsis: !screen.isSmall && props.useEllipsis
    }
  ]
})

const normalizedFields = computed(() => {
  const hasFieldset = !!Object.keys(props.fieldset).length

  // No caso de não ter "fieldset", virá via props o result e fields.
  if (!hasFieldset) {
    return {
      default: {
        fields: getFieldsByResult({ fields: props.fields, result: props.result }),
        headerProps: props.headerProps,
        __hasHeader: Object.keys(props.headerProps).length
      }
    }
  }

  // No caso de ter "fieldset", deve normalizar os fields/result de acordo com o fieldset.
  return getNormalizedFields({
    items: props.fieldset,
    fields: props.fields,
    result: props.result,
    isGrid: true
  })
})

// functions
function getContainerClasses ({ key }) {
  if (props.useInline) return 'row justify-between col-12'

  return getFieldClass({ index: key, isGridGenerator: true })
}

function getTitle (field, key) {
  return props.useEllipsis ? field[key] : ''
}

function hasEllipsis (field) {
  /**
   * Para campos do tipo "textarea" vamos sempre exibir o conteúdo por completo.
   */
  return (field.type === 'textarea') && !props.useInline ? false : props.useEllipsis
}

function getContentClasses (field) {
  return [
    props.contentClass,

    {
      ellipsis: !screen.isSmall && hasEllipsis(field)
    }
  ]
}

function getGridItemProps (field) {
  return {
    useEllipsis: hasEllipsis(field),
    useInline: props.useInline,

    ...(props.fieldsProps[field.name] || {})
  }
}

function hasSeparator ({ item, isSubset }) {
  /**
   * No caso de for subset, por padrão terá o separator, à não ser que for passado
   * o separator como false. Caso seja um fieldset, verificar se foi passado a chave "useSeparator".
   */
  return isSubset ? (item.useSeparator ?? true) : item.useSeparator
}
</script>
