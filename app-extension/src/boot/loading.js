import { Loading } from 'quasar'

export default () => {
  Loading.setDefaults({
    backgroundColor: 'white',
    boxClass: 'text-body1',
    customClass: 'qas-loading',
    message: 'Carregando...',
    messageColor: 'primary',
    spinnerColor: 'primary'
  })
}
