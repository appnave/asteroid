import { Dialog, NotifySuccess, NotifyError } from 'asteroid'
import { getAction } from '@bildvitta/store-adapter'
import { useHistory } from '../../composables'

export default function (config = {}) {
  const {
    dialogProps = {},
    deleteActionParams = {},
    useAutoDeleteRoute,
    redirectRoute,

    // callbacks
    onDelete = () => {},
    onDeleteError = () => {},
    onDeleteSuccess = () => {},
    deleteAction
  } = config

  const { entity, id, url } = deleteActionParams

  const defaultDialogProps = {
    useForm: true,

    ...dialogProps,

    card: {
      title: 'Excluir',
      description: 'Tem certeza que deseja excluir este item?',

      ...dialogProps.card
    },

    ok: {
      label: 'Excluir',
      onClick: () => destroy.call(this),

      ...dialogProps.ok
    }
  }

  const defaultNotifyMessages = {
    error: 'Não conseguimos excluir as informações. Por favor, tente novamente em alguns minutos.',
    success: 'Informações excluídas com sucesso.'
  }

  async function destroy () {
    try {
      setLoadingStateOnDialog(true)

      onDelete(true)

      const hasDeleteAction = typeof deleteAction === 'function'

      const payload = { id, url }
      const destroyActionParams = { entity, key: 'destroy', payload }

      const response = hasDeleteAction
        ? await deleteAction(payload)
        : await getAction.call(this, destroyActionParams)

      NotifySuccess(defaultNotifyMessages.success)

      if (useAutoDeleteRoute) {
        const { destroyRoutes, history } = useHistory()

        // remove todas rotas que possuem o id do item excluído.
        const routesToBeDeleted = getRoutesToBeDeletedById(history.list)
        destroyRoutes(routesToBeDeleted)
      }

      // cria um evento para notificar que o item foi excluído no "window".
      createDeleteSuccessEvent()

      onDeleteSuccess(response)

      redirectRoute && replaceRoute(this)

      dialog.hide()
    } catch (error) {
      onDeleteError(error)

      NotifyError(defaultNotifyMessages.error)
    } finally {
      onDelete(false)

      setLoadingStateOnDialog(false)
    }
  }

  function replaceRoute (context) {
    const { $router } = context

    $router.replace(redirectRoute)
  }

  function getRoutesToBeDeletedById (routes = []) {
    return routes.filter(({ params }) => params.id === id)
  }

  function createDeleteSuccessEvent () {
    const event = new CustomEvent('delete-success', {
      bubbles: false,
      cancelable: false,
      detail: deleteActionParams
    })

    window.dispatchEvent(event)
  }

  function setLoadingStateOnDialog (isDeleting) {
    dialog.update({
      ...defaultDialogProps,

      ok: {
        ...defaultDialogProps.ok,

        loading: isDeleting
      },

      cancel: {
        ...defaultDialogProps.cancel,

        disable: isDeleting
      }
    })
  }

  const dialog = Dialog(defaultDialogProps)
}
