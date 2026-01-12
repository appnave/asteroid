<template>
  <div class="container spaced">
    <qas-form-generator v-model="model" v-bind="formGeneratorProps" />

    <qas-form-generator v-model="model" class="q-mt-lg" v-bind="formGeneratorProps2" />

    <qas-form-generator v-model="model" class="q-mt-lg" v-bind="formGeneratorProps3" />

    <qas-btn class="q-mt-lg" :label="buttonLabel" @click="onClick" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({ name: 'PageSkeleton' })

// refs
const model = ref({})
const showSkeleton = ref(true)

// consts
const baseFormGeneratorProps = computed(() => {
  return {
    commonColumns: { col: 12, sm: 4 },
    skeleton: showSkeleton.value,
    columns: { others: { col: 8 }, comment: { col: 12 } },
    fields: {
      uuid: {
        name: 'uuid',
        type: 'hidden'
      },

      company: {
        name: 'company',
        label: 'Empresa',
        multiple: true,
        type: 'select',
        options: [
          { label: 'Empresa com nome grande 1', value: 'company-1' },
          { label: 'Empresa com nome grande 2', value: 'company-2' },
          { label: 'Empresa com nome grande 3', value: 'company-3' },
          { label: 'Empresa com nome grande 4', value: 'company-4' }
        ]
      },

      name: {
        name: 'name',
        label: 'Nome',
        type: 'string'
      },

      phone: {
        name: 'phone',
        label: 'Telefone',
        type: 'text'
      },

      email: {
        name: 'email',
        label: 'Email',
        type: 'email'
      },

      others: {
        name: 'others',
        label: 'Outros',
        type: 'text'
      },

      comment: {
        name: 'comment',
        label: 'Digite um comentário aqui',
        type: 'textarea'
      }
    },

    useBox: true
  }
})

// computeds
const formGeneratorProps = computed(() => {
  return {
    fieldset: {
      informations: {
        label: 'Informações',
        description: 'Informe algumas informações do usuário.',
        fields: ['phone', 'name', 'company'],
        badges: [
          {
            label: 'Minha badge',
            textColor: 'grey-10'
          }
        ],
        subset: {
          others: {
            headerProps: {
              labelProps: { label: 'Uma subseção' },
              badges: [
                {
                  label: 'Minha badge',
                  textColor: 'grey-10'
                }
              ],
              buttonProps: {
                label: 'Atualizar',
                onClick: () => alert('Atualizando...')
              }
            },
            fields: ['email', 'others']
          }
        }
      }
    },

    ...baseFormGeneratorProps.value
  }
})

const formGeneratorProps2 = computed(() => {
  return {
    fieldset: {
      informations: {
        label: 'Informações',
        description: 'Informe algumas informações do usuário.',
        fields: ['phone', 'name', 'company', 'email', 'others']
      }
    },

    ...baseFormGeneratorProps.value
  }
})

const formGeneratorProps3 = computed(() => {
  return {
    fieldset: {
      informations: {
        label: 'Informações',
        description: 'Informe algumas informações do usuário.',
        fields: ['phone', 'name', 'company'],
        buttonProps: {
          label: 'Botão',
          icon: 'sym_r_draft'
        }
      }
    },

    ...baseFormGeneratorProps.value
  }
})

const buttonLabel = computed(() => showSkeleton.value ? 'Desativar skeleton' : 'Ativar skeleton')

// functions
function onClick () {
  showSkeleton.value = !showSkeleton.value
}
</script>
