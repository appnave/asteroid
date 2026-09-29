import { computed } from 'vue'

export default function useDevelopmentBadge () {
  const developmentBadgeLabel = computed(() => {
    const hosts = {
      localhost: 'Local',
      '.dev.': 'Develop'
    }

    if (import.meta.env.DEV) return hosts.localhost

    const current = Object.keys(hosts).find(host => window.location.hostname.includes(host))

    return current ? hosts[current] : ''
  })

  const hasDevelopmentBadge = computed(() => !!developmentBadgeLabel.value)

  return {
    developmentBadgeLabel,
    hasDevelopmentBadge
  }
}
