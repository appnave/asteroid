import { LocalStorage } from 'quasar'

import { computed, ref } from 'vue'

const user = ref(LocalStorage.getItem('user'))

export default function useAuthUser () {
  window.addEventListener('message', ({ data }) => {
    if (data.type !== 'updateUser') return

    user.value = data.user
  })

  const hasUser = computed(() => !!user.value)

  return {
    user,
    hasUser
  }
}
