<template>
  <div class="container spaced">
    <qas-expansion-item label="John Doe">
      <template #header>
        <div class="items-center justify-between row">
          <qas-label label="Meu titulo" margin="none" typography="h5" />

          <div class="text-body1 text-grey-8">
            {{ date }}
          </div>
        </div>
      </template>

      <template #content>
        Meu conteúdo customizado
      </template>
    </qas-expansion-item>
  </div>
</template>

<script setup>
import { dateTime } from '@bildvitta/quasar-ui-asteroid/src/helpers'

defineOptions({ name: 'HeaderLeftSlot' })

const date = dateTime('2023-01-11T14:58:40.000000Z')
</script>
