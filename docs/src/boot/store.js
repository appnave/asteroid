import { boot } from 'quasar/wrappers'
import createStore from '../store'

export default boot(async ({ app }) => {
  const store = await createStore()

  app.use(store)
})
