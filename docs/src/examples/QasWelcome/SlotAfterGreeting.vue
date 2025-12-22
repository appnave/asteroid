<template>
  <div class="container spaced text-center">
    <qas-welcome name="John Doe" :shortcuts>
      <template #after-greeting>
        <qas-select-filter :options />
      </template>
    </qas-welcome>
  </div>
</template>

<script setup>
defineOptions({ name: 'SlotAfterGreeting' })

const shortcuts = [
  {
    title: 'Assistência digital BPO',
    icon: 'sym_r_person_add_alt',
    to: { path: '/components/avatar' }
  },
  {
    title: 'Nova tarefa',
    icon: 'sym_r_edit_calendar',
    to: { path: '/components/avatar' }
  },
  {
    title: 'Troca de base',
    icon: 'sym_r_swap_horiz',
    to: { path: '/components/avatar' }
  },
  {
    title: 'Configurações',
    icon: 'sym_r_settings',
    to: { path: '/components/avatar' }
  },
  {
    title: 'Youtube',
    icon: 'sym_r_youtube_activity',
    externalLink: 'https://www.youtube.com/'
  }
]

const options = [
  {
    label: 'Company 1',
    value: '1'
  },
  {
    label: 'Company 2',
    value: '2'
  }
]
</script>
