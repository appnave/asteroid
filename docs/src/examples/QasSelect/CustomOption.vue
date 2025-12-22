<template>
  <div class="container q-py-lg">
    <div>
      <qas-select v-model="model" :badge-props="badgeProps" label="Select com badge na option" :options="optionsWithBadge" use-custom-options />
      Model: {{ model }}

      <div class="q-mt-md">
        <qas-select v-model="model" label="Select com caption na option" :options="optionsWithCaption" use-custom-options />
        Model: {{ model }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'CustomOption' })

const model = ref('')

const companyBadgeProps = {
  company1: {
    color: 'primary',
    textColor: 'white',
    label: 'Empresa 1'
  },

  company2: {
    color: 'cyan-14',
    textColor: 'white',
    label: 'Empresa 2'
  }
}

const badgeProps = {
  isTester: {
    color: 'grey-8',
    label: 'Tester',
    textColor: 'white'
  },

  isAvailable: value => {
    return {
      show: true,
      props: {
        color: value ? 'positive' : 'negative',
        textColor: 'white',
        label: value ? 'Disponível' : 'Inativo'
      }
    }
  },

  company: value => {
    return {
      show: true,
      props: companyBadgeProps[value]
    }
  }
}

const optionsWithBadge = [
  {
    label: 'Usuario 1 ',
    value: 1
  },
  {
    label: 'Usuario 2',
    value: 2,
    isTester: true,
    isAvailable: false,
    company: 'company2'
  },
  {
    label: 'Usuario 3',
    value: 3,
    isAvailable: true,
    company: 'company2'
  },
  {
    label: 'Usuario 4',
    value: 4,
    company: 'company1'
  }
]

const optionsWithCaption = [
  {
    label: 'Usuário 1',
    value: 1,
    caption: 'CPF: 111.222.333-44'
  },
  {
    label: 'Usuário 2',
    value: 2,
    caption: ['Valor 1', 'Valor 2']
  }
]
</script>
