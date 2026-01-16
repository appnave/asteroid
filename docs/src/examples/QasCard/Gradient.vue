<template>
  <div class="container spaced">
    <div class="q-col-gutter-md row">
      <div class="col-6">
        <qas-card gradient-status-color="#E3F2FD" :route="{ name: 'Root' }" status-color="blue-2" title="Titulo">
          <template #default>
            <div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde corporis iure quam inventore quasi
            </div>
          </template>
        </qas-card>
      </div>

      <div class="col-6">
        <qas-card gradient-status-color="#FFEBEE" :route="{ name: 'Root' }" status-color="red-2" title="Titulo">
          <template #default>
            <div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde corporis iure quam inventore quasi
            </div>
          </template>
        </qas-card>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'PageGradient' })

</script>
