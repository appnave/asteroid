<template>
  <div class="container q-py-lg">
    <qas-transfer-list :from="from" :to="to">
      <template #from-column="{ item }">
        <div>
          Antigo: <span class="text-bold">{{ item.label }}</span>
        </div>
      </template>

      <template #to-column="{ item }">
        <div>
          Novo: <span class="text-bold">{{ item.label }}</span>
        </div>
      </template>
    </qas-transfer-list>
  </div>
</template>

<script>
export default {
  computed: {
    from () {
      return [
        { label: 'Ana Souza' },
        { label: 'Bruno Lima' },
        { label: 'Carlos Nunes' }
      ]
    },

    to () {
      return [
        { label: 'Daniela Rocha' },
        { label: 'Fernanda Alves' }
      ]
    }
  }
}
</script>
