<template>
  <qas-btn :href="whatsappLink" :icon="fabWhatsapp" target="_blank" />
</template>

<script setup>
import QasBtn from '../btn/QasBtn.vue'

import { computed } from 'vue'
import { fabWhatsapp } from '@quasar/extras/fontawesome-v5'

defineOptions({ name: 'QasWhatsappLink' })

const props = defineProps({
  callingCode: {
    type: [Number, String],
    default: 55
  },

  phone: {
    type: String,
    default: ''
  },

  text: {
    type: String,
    default: ''
  }
})

const whatsappLink = computed(() => {
  const formattedPhone = props.phone.replace(/[^a-zA-Z0-9]/g, '')
  const formattedText = props.text ? props.text.replace(/\n/g, '%0a') : ''

  return `https://wa.me/${props.callingCode}${formattedPhone}?text=${formattedText}`
})
</script>
