<template>
  <div class="items-center justify-between no-wrap row">
    <div class="items-center row">
      <div class="q-mr-sm">
        <q-icon :color="iconColor" name="sym_r_info" size="md" />
      </div>

      <div>
        <span class="text-caption text-grey-6">
          {{ dateLabel }}
        </span>

        <div class="items-center q-mt-xs row">
          <h6 class="text-subtitle1" :class="titleClass">
            {{ props.notification.title }}
          </h6>

          <div v-if="hasBadge" class="q-ml-sm">
            <qas-badge color="indigo-1" label="Nova" text-color="grey-10" />
          </div>
        </div>

        <div class="q-mt-xs text-body1 text-grey-8">
          {{ props.notification.message }}
        </div>
      </div>
    </div>

    <qas-btn v-if="props.notification.link" v-bind="buttonProps" />
  </div>
</template>

<script setup>
import QasBadge from '../../badge/QasBadge.vue'
import QasBtn from '../../btn/QasBtn.vue'

import { dateTime } from '../../../helpers/filters'

import { computed } from 'vue'
import { date } from 'quasar'

defineOptions({ name: 'PvLayoutNotificationCard' })

const props = defineProps({
  notification: {
    type: Object,
    default: () => ({})
  }
})

const markedAsRead = computed(() => props.notification.isRead)

const iconColor = computed(() => markedAsRead.value ? 'grey-8' : 'primary')
const titleClass = computed(() => markedAsRead.value ? 'text-grey-8' : 'text-grey-10')

const isRecentNotification = computed(() => {
  const currentDate = new Date().toISOString()

  return date.getDateDiff(currentDate, props.notification.createdAt, 'minutes') < 10
})

const hasBadge = computed(() => isRecentNotification.value && !markedAsRead.value)

const dateLabel = computed(() => isRecentNotification.value ? 'Agora mesmo' : dateTime(props.notification.createdAt))

const buttonProps = computed(() => {
  const { link } = props.notification

  const urlFromLink = new URL(link)

  const isExternalURL = urlFromLink.host !== location.host

  return {
    icon: 'sym_r_chevron_right',
    color: markedAsRead.value ? 'grey-10' : 'primary',

    /**
     * Se for uma url externa, diferente da URL que ele esta acessando no momento,
     * é adicionado um "href" porque é um link para outro modulo, caso seja para o mesmo modulo,
     * é adicionado um "to" para não recarregar a pagina.
     */
    ...(isExternalURL ? { href: link } : { to: urlFromLink.pathname })
  }
})
</script>
