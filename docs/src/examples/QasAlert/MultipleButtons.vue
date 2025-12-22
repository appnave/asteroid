<template>
  <div class="container q-py-lg">
    <qas-alert v-bind="multipleButtonsAlertProps" />

    <qas-alert v-bind="multipleLinksAlertProps" class="q-mt-md" />
  </div>
</template>

<script setup>
defineOptions({ name: 'MultipleButtons' })

const multipleButtonsAlertProps = {
  useRegex: true,
  text: 'Exemplo com [botão 1], e também com [botão 2]',
  buttonProps: [
    {
      onClick: () => alert('Botão 1 clicado')
    },
    {
      onClick: () => alert('Botão 2 clicado')
    }
  ]
}

const multipleLinksAlertProps = {
  useRegex: true,
  text: 'Vou redirecionar para [home], e aqui para a [página de alertas]',
  routerLinkProps: [
    {
      to: '/'
    },
    {
      to: '/components/alert'
    }
  ]
}
</script>
