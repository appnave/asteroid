<template>
  <div class="container spaced">
    <div class="q-col-gutter-md row">
      <div class="col-6">
        <qas-card v-model:selected="selected" v-bind="cardProps" :actions-menu-props :expansion-props :title>
          <template #default>
            <div>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Similiqu
            </div>

            <div>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Similiqu
            </div>
          </template>
        </qas-card>
      </div>

      <div class="col-6">
        <qas-card v-model:selected="selected" v-bind="cardProps" :title :use-selection="false">
          <template #default>
            <div>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Similiqu
            </div>

            <div>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Similiqu
            </div>
          </template>
        </qas-card>
      </div>

      <div class="col-6">
        <qas-card v-model:selected="selected" v-bind="cardProps" title="" :use-selection="false">
          <template #default>
            <div>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Similiqu
            </div>

            <div>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Similiqu
            </div>
          </template>
        </qas-card>
      </div>
    </div>

    <qas-btn class="q-mt-lg" :label="buttonLabel" @click="onClick" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({ name: 'PageSkeleton' })

// refs
const selected = ref(false)
const showSkeleton = ref(true)

const expansionProps = {
  label: 'Mostrar mais',
  content: 'Conteúdo expandido'
}

const actionsMenuProps = {
  list: {
    show: {
      label: 'Ir para detalhes',
      icon: 'sym_r_visibility'
    },

    edit: {
      label: 'Editar',
      icon: 'sym_r_edit'
    }
  }
}

const title = 'Titulo do Card'

const cardProps = computed(() => {
  return {
    route: { name: 'Root' },
    useSelection: true,
    skeleton: showSkeleton.value
  }
})

// computeds
const buttonLabel = computed(() => showSkeleton.value ? 'Desativar skeleton' : 'Ativar skeleton')

// functions
function onClick () {
  showSkeleton.value = !showSkeleton.value
}
</script>
