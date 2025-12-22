<template>
  <qas-table-generator class="with-virtual-scroll" :fields="fields" max-height="300px" :results="resultsTest" row-key="uuid" use-virtual-scroll />
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'WithVirtualScroll' })

const fields = {
  name: { type: 'text', name: 'name', label: 'Nome' },
  email: { type: 'text', name: 'email', label: 'E-mail' },
  phone: { type: 'text', name: 'phone', label: 'Telefone', mask: 'phone' }
}

const resultsTest = computed(() => {
  const results = []

  for (let i = 0; i < 100; i++) {
    const name = `${['Alice', 'Bob', 'Charlie'][i % 3]} ${['Johnson', 'Smith', 'Brown'][i % 3]}`
    const email = `${name.replace(' ', '.').toLowerCase()}@example.com`
    const phone = `99999999${i.toString().padStart(2, '0')}`

    results.push({ name, email, phone })
  }

  return results
})
</script>
