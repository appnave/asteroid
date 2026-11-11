import { flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import QasUploader from './QasUploader.vue'
import PvUploaderGalleryCard from './private/PvUploaderGalleryCard.vue'
import QasEmptyResultText from '../empty-result-text/QasEmptyResultText.vue'
import QasHeader from '../header/QasHeader.vue'
import NotifyError from '../../plugins/notify-error/NotifyError.js'
import { getImageSize } from '../../helpers/images.js'

import { mountQas, createAxiosMock } from '../../../../test/utils/mount-qas.js'

// o QasUploader notifica direto pelo plugin, sem passar pelo "$qas"
vi.mock('../../plugins/notify-error/NotifyError.js', () => ({ default: vi.fn() }))

// o jsdom não carrega imagens nem tem canvas: o tamanho da imagem e o pica são simulados
vi.mock('../../helpers/images.js', async importOriginal => ({
  ...(await importOriginal()),
  getImageSize: vi.fn()
}))

const picaResize = vi.fn(async (image, canvas) => canvas)

vi.mock('pica', () => ({
  default: () => ({
    resize: picaResize,
    toBlob: vi.fn(async () => new Blob(['redimensionada'], { type: 'image/png' }))
  })
}))

URL.createObjectURL ||= vi.fn(() => 'blob:imagem')

const credentials = { endpoint: 'https://storage.com/upload?assinatura=123', fullPath: 'users/abc.png' }

function mountUploader ({ props = {}, attrs = {}, axios, slots } = {}) {
  return mountQas(QasUploader, {
    props: { entity: 'users', ...props },
    attrs,
    slots,
    axios: axios || createAxiosMock(() => ({ data: credentials }))
  })
}

const getQUploader = wrapper => wrapper.findComponent({ name: 'QUploader' })
const getCards = wrapper => wrapper.findAllComponents(PvUploaderGalleryCard)

/**
 * Simula o QUploader avisando que o PUT no storage terminou.
 */
function emitUploaded (wrapper, { name = 'foto.png', type = 'image/png', fullPath, responseURL, response } = {}) {
  getQUploader(wrapper).vm.$emit('uploaded', {
    files: [{ name, type, fullPath }],
    xhr: { responseURL: responseURL || 'https://storage.com/users/foto.png?assinatura=123', response }
  })
}

describe('QasUploader', () => {
  beforeEach(() => {
    vi.mocked(NotifyError).mockClear()
    picaResize.mockClear()
  })

  describe('credenciais de envio', () => {
    it('pede as credenciais com a entidade e um nome único mantendo a extensão do arquivo', async () => {
      const { wrapper, axios } = await mountUploader({ props: { uploadCredentialsParams: { public: true } } })

      await getQUploader(wrapper).props('factory')([new File(['x'], 'minha foto.PNG', { type: 'image/png' })])

      const [url, body] = axios.post.mock.calls[0]

      expect(url).toBe('/upload-credentials/')
      expect(body).toMatchObject({ entity: 'users', public: true })
      expect(body.filename).toMatch(/^[\w-]+\.PNG$/)
      expect(body.filename).not.toContain('minha foto')
    })

    it('envia o arquivo direto para o "endpoint" das credenciais, com os headers do tipo do arquivo', async () => {
      const { wrapper } = await mountUploader()

      const config = await getQUploader(wrapper).props('factory')([new File(['x'], 'doc.pdf', { type: 'application/pdf' })])

      expect(config).toEqual({
        url: credentials.endpoint,
        sendRaw: true,
        headers: [
          { name: 'Content-Type', value: 'application/pdf' },
          { name: 'Content-Disposition', value: 'Attachment' }
        ]
      })
    })

    it('guarda o "fullPath" das credenciais no arquivo', async () => {
      const { wrapper } = await mountUploader()
      const file = new File(['x'], 'foto.png', { type: 'image/png' })

      await getQUploader(wrapper).props('factory')([file])

      expect(file.fullPath).toBe('users/abc.png')
    })

    it('não envia o arquivo quando não consegue as credenciais', async () => {
      const axios = createAxiosMock(() => { throw new Error('Network Error') })
      const { wrapper } = await mountUploader({ axios })

      const config = await getQUploader(wrapper).props('factory')([new File(['x'], 'foto.png', { type: 'image/png' })])

      expect(config).toBeUndefined()
    })

    it('quando o envio falha, avisa o usuário e encerra o "uploading"', async () => {
      const { wrapper } = await mountUploader()

      getQUploader(wrapper).vm.$emit('factoryFailed')
      await flushPromises()

      expect(NotifyError).toHaveBeenCalledWith('Falha ao carregar arquivo.')
      expect(wrapper.emitted('update:uploading').at(-1)).toEqual([false])
    })
  })

  describe('arquivo enviado', () => {
    it('atualiza o model com o "fullPath" do arquivo', async () => {
      const { wrapper } = await mountUploader()

      emitUploaded(wrapper, { fullPath: 'users/abc.png' })

      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['users/abc.png'])
    })

    it('sem "fullPath", usa a URL do storage sem os parâmetros de assinatura', async () => {
      const { wrapper } = await mountUploader()

      emitUploaded(wrapper)

      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['https://storage.com/users/foto.png'])
    })

    it('com "use-url-path" false, prioriza a resposta do storage', async () => {
      const { wrapper } = await mountUploader({ props: { useUrlPath: false } })

      emitUploaded(wrapper, { fullPath: 'users/abc.png', response: 'data:image/png;base64,AAA' })

      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['data:image/png;base64,AAA'])
    })

    it('no modo múltiplo, adiciona o arquivo aos que já existiam', async () => {
      const { wrapper } = await mountUploader({ props: { modelValue: ['users/antigo.png'] }, attrs: { multiple: true } })

      emitUploaded(wrapper, { fullPath: 'users/novo.png' })

      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([['users/antigo.png', 'users/novo.png']])
    })

    it('com "use-object-model", emite o arquivo com formato, url e nome', async () => {
      const { wrapper } = await mountUploader({ props: { useObjectModel: true, modelValue: {} } })

      emitUploaded(wrapper, { fullPath: 'users/abc.png', name: 'foto.png', type: 'image/png' })

      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([{ format: 'image/png', url: 'users/abc.png', name: 'foto.png' }])
    })

    it('emite "update:uploading" true ao começar e false ao terminar', async () => {
      const { wrapper } = await mountUploader()

      getQUploader(wrapper).vm.$emit('uploading')
      emitUploaded(wrapper, { fullPath: 'users/abc.png' })

      expect(wrapper.emitted('update:uploading')).toEqual([[true], [false]])
    })
  })

  describe('arquivos rejeitados', () => {
    const rejected = (failedPropValidation, quantity = 1) => Array.from({ length: quantity }, () => ({
      failedPropValidation,
      file: new File(['x'], 'arquivo.exe')
    }))

    async function reject (files, props = {}) {
      const { wrapper } = await mountUploader({ props })

      getQUploader(wrapper).vm.$emit('rejected', files)

      return wrapper
    }

    it('emite "rejected" com os arquivos', async () => {
      const files = rejected('accept')
      const wrapper = await reject(files)

      expect(wrapper.emitted('rejected')).toEqual([[files]])
    })

    it('avisa quando 1 arquivo tem um tipo não permitido', async () => {
      await reject(rejected('accept'))

      expect(NotifyError).toHaveBeenCalledWith('Não conseguimos selecionar 1 arquivo, este tipo não é permitido. Por favor, escolha um arquivo válido.')
    })

    it('avisa quando vários arquivos têm tipo não permitido', async () => {
      await reject(rejected('accept', 3))

      expect(NotifyError).toHaveBeenCalledWith('Não conseguimos selecionar 3 arquivos, estes tipos não são permitidos. Por favor, escolha arquivos válidos.')
    })

    it('avisa quando 1 arquivo ultrapassa o tamanho máximo, informando o limite em Mb', async () => {
      await reject(rejected('max-file-size'), { maxFileSize: 5000000 })

      expect(NotifyError).toHaveBeenCalledWith('Não conseguimos selecionar 1 arquivo, ele ultrapassa o limite de 5Mb. Por favor, escolha um arquivo dentro do limite permitido.')
    })

    it('com tipos e tamanhos inválidos ao mesmo tempo, usa uma mensagem única com o total', async () => {
      await reject([...rejected('accept'), ...rejected('max-file-size', 2)], { maxFileSize: 5000000 })

      expect(NotifyError).toHaveBeenCalledWith('Não conseguimos selecionar 3 arquivos. Por favor, escolha arquivos válidos.')
    })

    it('não avisa quando o motivo não é tipo nem tamanho', async () => {
      await reject(rejected('max-files'))

      expect(NotifyError).not.toHaveBeenCalled()
    })
  })

  describe('lista de arquivos', () => {
    it('exibe um card para cada arquivo do model', async () => {
      const { wrapper } = await mountUploader({
        props: { modelValue: ['users/a.png', 'users/b.png'] },
        attrs: { multiple: true }
      })

      expect(getCards(wrapper).map(card => card.props('fileKey'))).toEqual(['a.png', 'b.png'])
    })

    it('exibe o texto de vazio quando não há arquivos', async () => {
      const { wrapper } = await mountUploader()

      expect(wrapper.findComponent(QasEmptyResultText).exists()).toBe(true)
      expect(getCards(wrapper)).toHaveLength(0)
    })

    it('com "use-empty-result-text" false, não exibe o texto de vazio', async () => {
      const { wrapper } = await mountUploader({ props: { useEmptyResultText: false } })

      expect(wrapper.findComponent(QasEmptyResultText).exists()).toBe(false)
    })

    it('ao remover um arquivo no modo simples, limpa o model', async () => {
      const { wrapper } = await mountUploader({ props: { modelValue: 'users/a.png' } })

      await getCards(wrapper)[0].vm.$emit('remove')

      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([''])
    })

    it('ao remover um arquivo no modo múltiplo, tira só ele da lista', async () => {
      const { wrapper } = await mountUploader({
        props: { modelValue: ['users/a.png', 'users/b.png', 'users/c.png'] },
        attrs: { multiple: true }
      })

      await getCards(wrapper)[1].vm.$emit('remove')

      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([['users/a.png', 'users/c.png']])
    })

    it('não remove nenhum arquivo quando o arquivo informado não está no model', async () => {
      const { wrapper } = await mountUploader({
        props: { modelValue: ['users/a.png', 'users/b.png'] },
        attrs: { multiple: true }
      })

      wrapper.vm.removeFile('inexistente.png', { files: [] }, { isUploaded: false }, 0)

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('ao remover um arquivo, remove também o erro dele', async () => {
      const { wrapper } = await mountUploader({
        // cada item é o objeto de erros dos campos do arquivo, como a API devolve
        props: { modelValue: ['users/a.png', 'users/b.png'], errors: [{ name: ['Arquivo inválido'] }, { name: ['Outro erro'] }] },
        attrs: { multiple: true }
      })

      await getCards(wrapper)[0].vm.$emit('remove')

      expect(wrapper.emitted('update:errors').at(-1)).toEqual([[{ name: ['Outro erro'] }]])
    })
  })

  describe('cabeçalho e botão de adicionar', () => {
    const getAddAction = wrapper => wrapper.findComponent(QasHeader).props('actionsMenuProps')?.list?.add

    it('exibe o label e o botão "Adicionar"', async () => {
      const { wrapper } = await mountUploader({ props: { label: 'Fotos' } })

      expect(wrapper.findComponent(QasHeader).props('labelProps')).toMatchObject({ label: 'Fotos' })
      expect(getAddAction(wrapper)).toMatchObject({ label: 'Adicionar', icon: 'sym_r_add' })
    })

    it('usa o texto de "add-button-label"', async () => {
      const { wrapper } = await mountUploader({ props: { addButtonLabel: 'Enviar foto' } })

      expect(getAddAction(wrapper).label).toBe('Enviar foto')
    })

    it('com "readonly", não exibe o botão de adicionar', async () => {
      const { wrapper } = await mountUploader({ props: { readonly: true } })

      expect(getAddAction(wrapper)).toBeUndefined()
    })

    it('no modo múltiplo, esconde o botão ao atingir "max-files"', async () => {
      const { wrapper: below } = await mountUploader({ props: { maxFiles: 2, modelValue: ['users/a.png'] }, attrs: { multiple: true } })
      const { wrapper: reached } = await mountUploader({ props: { maxFiles: 2, modelValue: ['users/a.png', 'users/b.png'] }, attrs: { multiple: true } })

      expect(getAddAction(below)).toBeDefined()
      expect(getAddAction(reached)).toBeUndefined()
    })

    it('chama o "add-button-fn" no lugar de abrir a seleção de arquivos', async () => {
      const addButtonFn = vi.fn()
      const { wrapper } = await mountUploader({ props: { addButtonFn } })

      getAddAction(wrapper).handler()

      expect(addButtonFn).toHaveBeenCalledTimes(1)
    })

    it('com "use-header" false, não exibe o cabeçalho', async () => {
      const { wrapper } = await mountUploader({ props: { useHeader: false } })

      expect(wrapper.findComponent(QasHeader).exists()).toBe(false)
    })
  })

  describe('seleção de arquivos pelo input', () => {
    function selectFiles (wrapper, files) {
      const input = wrapper.find('input.qas-uploader__input')

      Object.defineProperty(input.element, 'files', { value: files, configurable: true })

      return input.trigger('change')
    }

    it('ao escolher arquivos, adiciona eles ao QUploader para envio', async () => {
      const { wrapper } = await mountUploader({ props: { useResize: false } })
      // o QasUploader usa a referência do QUploader guardada no mounted
      const addFiles = vi.spyOn(wrapper.vm.uploader, 'addFiles').mockImplementation(() => {})
      const file = new File(['x'], 'doc.pdf', { type: 'application/pdf' })

      await selectFiles(wrapper, [file])
      await flushPromises()

      expect(addFiles).toHaveBeenCalledWith([file])
    })
  })

  describe('redimensionamento de imagens', () => {
    const image = (type = 'image/png') => new File(['x'], 'foto.png', { type })

    it('redimensiona imagens maiores que o "size-limit" mantendo a proporção', async () => {
      vi.mocked(getImageSize).mockResolvedValue({ width: 2560, height: 1440 })

      const { wrapper } = await mountUploader()
      const result = await wrapper.vm.resizeImage(image())

      const canvas = picaResize.mock.calls[0][1]

      expect([canvas.width, canvas.height]).toEqual([1280, 720])
      expect(result).toBeInstanceOf(File)
      expect(result.name).toBe('foto.png')
    })

    // o "size-limit" é comparado com a largura, imagens em pé dentro dessa largura não são redimensionadas
    it('não redimensiona imagens em pé cuja largura está dentro do "size-limit"', async () => {
      vi.mocked(getImageSize).mockResolvedValue({ width: 900, height: 2400 })

      const { wrapper } = await mountUploader()
      const file = image()

      expect(await wrapper.vm.resizeImage(file)).toBe(file)
      expect(picaResize).not.toHaveBeenCalled()
    })

    it('não redimensiona imagens dentro do limite', async () => {
      vi.mocked(getImageSize).mockResolvedValue({ width: 800, height: 600 })

      const { wrapper } = await mountUploader()
      const file = image()

      expect(await wrapper.vm.resizeImage(file)).toBe(file)
      expect(picaResize).not.toHaveBeenCalled()
    })

    it('não redimensiona arquivos que não são imagem', async () => {
      const { wrapper } = await mountUploader()
      const file = image('application/pdf')

      expect(await wrapper.vm.resizeImage(file)).toBe(file)
      expect(getImageSize).not.toHaveBeenCalledWith(expect.anything(), 'application/pdf')
      expect(picaResize).not.toHaveBeenCalled()
    })

    it('com "use-resize" false, não redimensiona', async () => {
      vi.mocked(getImageSize).mockResolvedValue({ width: 4000, height: 3000 })

      const { wrapper } = await mountUploader({ props: { useResize: false } })
      const file = image()

      expect(await wrapper.vm.resizeImage(file)).toBe(file)
      expect(picaResize).not.toHaveBeenCalled()
    })

    it('se o redimensionamento falhar, envia o arquivo original', async () => {
      vi.mocked(getImageSize).mockRejectedValue(new Error('imagem corrompida'))

      const { wrapper } = await mountUploader()
      const file = image()

      expect(await wrapper.vm.resizeImage(file)).toBe(file)
    })
  })
})
