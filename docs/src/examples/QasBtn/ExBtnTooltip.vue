<template>
  <div class="q-gutter-x-md q-pa-md">
    <qas-btn v-bind="btnProps" />

    <qas-btn v-bind="disabledBtnProps" />
  </div>
</template>

<script setup>
defineOptions({ name: 'ExBtnTooltip' })

const btnProps = {
  icon: 'sym_r_edit',
  label: 'Botão com tooltip',
  variant: 'tertiary',
  tooltip: 'Este é um botão com tooltip.'
}

const disabledBtnProps = {
  icon: 'sym_r_edit',
  disable: true,
  label: 'Botão com tooltip desabilitado',
  variant: 'tertiary',
  disabledTooltip: 'O botão está desabilitado.'
}
</script>
