import { VueQueryPlugin } from '@tanstack/vue-query'

export default ({ app }) => {
  app.use(VueQueryPlugin, {
    queryClientConfig: {
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false
        }
      }
    }
  })
}
