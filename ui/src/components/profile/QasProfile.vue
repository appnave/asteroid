<template>
  <component :is="tag">
    <div class="q-col-gutter-md row">
      <div class="col-lg-5 col-xs-12">
        <div class="no-wrap q-col-gutter-md" :class="directionClasses">
          <div class="justify-center lg:q-mb-none md:q-mr-lg row xs:q-mb-md">
            <qas-avatar :image="userAvatarImage" :size="avatarSize" :title="title" />
          </div>
          <slot>
            <h6 class="text-bold text-h6">{{ title }}</h6>
            <div v-if="subtitle">{{ subtitle }}</div>
          </slot>
        </div>
      </div>
      <slot name="grid">
        <qas-grid-generator class="col-lg-7 col-xs-12 items-center" :columns="columns" :fields="filterObject(fields, list)" :result="result" :use-empty-result="false">
          <template v-for="(_, name) in $slots" #[name]="context">
            <slot :name="name" v-bind="context || {}" />
          </template>
        </qas-grid-generator>
      </slot>
    </div>
  </component>
</template>

<script>
import filterObject from '../../helpers/filter-object'

import QasAvatar from '../avatar/QasAvatar.vue'
import QasBox from '../box/QasBox.vue'
import QasGridGenerator from '../grid-generator/QasGridGenerator.vue'

export default {
  name: 'QasProfile',

  components: {
    QasAvatar,
    QasBox,
    QasGridGenerator
  },

  props: {
    columns: {
      type: Object,
      default: () => ({})
    },

    fields: {
      type: Object,
      default: () => ({})
    },

    list: {
      type: Array,
      default: () => []
    },

    result: {
      type: Object,
      default: () => ({})
    },

    subtitle: {
      type: String,
      default: ''
    },

    tag: {
      type: String,
      default: 'qas-box'
    },

    title: {
      type: String,
      required: true
    }
  },

  computed: {
    directionClasses () {
      return this.$qas.screen.untilMedium ? 'col' : 'row items-center'
    },

    userAvatarImage () {
      return this.result.image
    },

    avatarSize () {
      return this.$qas.screen.isSmall ? '145px' : '188px'
    }
  },

  methods: {
    filterObject
  }
}
</script>
