<template>
  <div class="container spaced">
    <div>
      <div class="q-col-gutter-md q-mb-lg row">
        <div class="col-12">
          <qas-label label="Caso 1" />
        </div>

        <div class="col-4">
          <qas-select label="Select" />
        </div>

        <div class="col-4">
          <qas-select label="Select" />
        </div>

        <div class="col-4">
          <qas-filters :entity="entity" search-placeholder="Pesquisar por nome do usuário" use-full-content />
        </div>
      </div>
    </div>

    <div>
      <div class="q-col-gutter-md q-mb-lg row">
        <div class="col-12">
          <qas-label label="Caso 2" />
        </div>

        <div class="col-6">
          <qas-select label="Select" />
        </div>

        <div class="col-6">
          <qas-filters :entity="entity" search-placeholder="Pesquisar por nome do usuário" use-full-content />
        </div>
      </div>
    </div>

    <div>
      <div class="q-col-gutter-md q-mb-lg row">
        <div class="col-12">
          <qas-label label="Caso 3" />
        </div>

        <div class="col-6">
          <qas-select label="Select" />
        </div>

        <div class="col-6">
          <qas-select label="Select" />
        </div>

        <div class="col-6">
          <qas-filters :entity="entity" search-placeholder="Pesquisar por nome do usuário" use-full-content />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'WithGrid' })

const entity = 'users'
</script>
