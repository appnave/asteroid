<template>
  <div class="column q-gutter-md">
    <div class="items-center q-gutter-sm row">
      <qas-btn
        :icon="isDark ? 'sym_r_dark_mode' : 'sym_r_light_mode'"
        :label="isDark ? 'Modo escuro ativo' : 'Modo claro ativo'"
        @click="toggle"
      />
    </div>

    <div class="q-gutter-sm row">
      <div
        class="q-pa-md rounded-borders"
        :style="{
          background: 'var(--qas-surface-color)',
          color: 'var(--qas-text-primary)',
          border: '1px solid var(--qas-border-grey)'
        }"
      >
        Surface color
      </div>

      <div
        class="q-pa-md rounded-borders"
        :style="{
          background: 'var(--qas-surface-variant)',
          color: 'var(--qas-text-secondary)'
        }"
      >
        Surface variant
      </div>
    </div>

    <div class="q-gutter-sm row">
      <qas-btn :color="buttonColor" flat label="Botão adaptável" />
      <qas-btn :color="spinnerColor" flat label="Spinner color" />
    </div>

    <div>
      <strong :style="{ color: 'var(--qas-text-primary)' }">Tema atual:</strong>
      <span :style="{ color: 'var(--qas-text-secondary)' }">
        {{ isDark ? 'dark' : 'light' }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { QasBtn } from '@bildvitta/quasar-ui-asteroid'
import { useDarkMode, useThemeColor } from 'asteroid'

const { isDark, toggle } = useDarkMode()

const buttonColor = useThemeColor('grey-10')
const spinnerColor = useThemeColor('grey')
</script>
