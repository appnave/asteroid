<template>
  <div class="container q-py-lg">
    <qas-transfer-list :from="from" :to="to">
      <template #from-column="{ item }">
        <div class="items-center justify-between row">
          <div>
            <div class="text-weight-medium">{{ item.name }}</div>
            <div class="text-caption text-grey-7">{{ item.email }}</div>
          </div>

          <q-badge color="grey-4" text-color="grey-8">Pendente</q-badge>
        </div>
      </template>

      <template #to-column="{ item }">
        <div class="items-center justify-between row">
          <div>
            <div class="text-weight-medium">{{ item.name }}</div>
            <div class="text-caption text-grey-7">{{ item.email }}</div>
          </div>

          <q-badge color="positive" text-color="white">Aprovado</q-badge>
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
        {
          name: 'Guilherme Silva',
          email: 'guilherme@email.com'
        },
        {
          name: 'Helena Santos',
          email: 'helena@email.com'
        }
      ]
    },

    to () {
      return [
        {
          name: 'Iara Costa',
          email: 'iara@email.com'
        },
        {
          name: 'Joao Dias',
          email: 'joao@email.com'
        }
      ]
    }
  }
}
</script>
