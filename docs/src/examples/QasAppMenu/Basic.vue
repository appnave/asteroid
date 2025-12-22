<template>
  <div>
    <q-layout class="flex items-center justify-center" :container="$qas.screen.untilLarge" style="height: 600px;">
      <qas-app-menu v-bind="appMenuProps" />
    </q-layout>
  </div>
</template>

<script setup>
defineOptions({ name: 'Basic' })

const appMenuProps = {
  brand: 'https://placehold.co/208x40',
  miniBrand: 'https://placehold.co/40x40',
  useChat: false,

  modules: [
    {
      label: 'Asteroid',
      value: 'https://asteroid.nave.dev'
    },
    {
      label: 'Asteroid - Beta',
      value: 'https://asteroid-homolog.vercel.app'
    },
    {
      label: 'Assistência Digital',
      value: 'https://develop.assistencia-digital.nave.dev'
    },
    {
      label: 'Bolso Virtual BPO',
      value: 'https://app.bolsovirtual.com.br'
    },
    {
      label: 'Crm',
      value: 'https://develop.crm.nave.dev'
    },
    {
      label: 'HUB',
      value: 'https://develop.hub.nave.dev'
    },
    {
      label: 'Produto',
      value: 'https://develop.produto.nave.dev'
    },
    {
      label: 'Vendas',
      value: 'https://develop.vendas.nave.dev'
    }
  ],

  appUserProps: {
    companyProps: {
      options: [
        {
          label: 'Empresa 1',
          value: '1'
        },
        {
          label: 'Empresa 2',
          value: '2'
        }
      ],
      modelValue: '1'
    },

    user: {
      photo: 'https://www.abc.net.au/cm/lb/6367016/data/alan2c-see-the-person-data.jpg',
      name: 'Eduardo Lima',
      email: 'eduardolima@gmail.com'
    }
  },

  title: 'Documentação',

  items: [
    {
      label: 'AppMenu',
      icon: 'sym_r_menu',
      to: { path: '/components/app-menu' }
    },
    {
      label: 'Por que asteroid?',
      icon: 'sym_r_pin',
      to: { path: '/why-asteroid' }
    },
    {
      label: 'Plugins',
      children: [
        {
          label: 'Dialog',
          to: { path: '/plugins/dialog' },
          icon: 'sym_r_settings_input_hdmi'
        },
        {
          label: 'Delete',
          to: { path: '/plugins/delete' },
          icon: 'sym_r_delete'
        },
        {
          label: 'NotifyError',
          to: { path: '/plugins/notify-error' },
          icon: 'sym_r_notifications'
        },
        {
          label: 'NotifySuccess',
          to: { path: '/plugins/notify-success' },
          icon: 'sym_r_notifications'
        },
        {
          label: 'Screen',
          to: { path: '/plugins/screen' },
          icon: 'sym_r_screen_rotation'
        }
      ]
    },
    {
      label: 'Components',
      icon: 'sym_r_apps',
      children: [
        {
          label: 'Avatar',
          to: { path: '/xpto/avatar' },
          icon: 'sym_r_account_circle'
        },
        {
          label: 'BtnDropdown',
          to: { path: '/xpto/btn-dropdown' },
          icon: 'sym_r_more_vert'
        },
        {
          label: 'Dialog',
          to: { path: '/xpto/dialog' },
          icon: 'sym_r_settings_input_hdmi'
        },
        {
          label: 'FormView',
          to: { path: '/xpto/form-view' },
          icon: 'sym_r_view_list'
        }
      ]
    }
  ]
}
</script>
