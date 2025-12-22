<img src="https://img.shields.io/npm/v/@bildvitta/quasar-ui-asteroid.svg?label=quasar-ui-asteroid">
<img src="https://img.shields.io/npm/v/@bildvitta/quasar-app-extension-asteroid.svg?label=quasar-app-extension-asteroid">

# Asteroid
Asteroid é uma extensão do Quasar ([Quasar App Extension](https://quasar.dev/app-extensions/introduction)) contendo coleções de componentes, plugins, estilos, utilitários, etc. Inicialmente foi idealizado para nos ajudar com o desenvolvimento de aplicações web, principalmente para criações de C.R.U.D. (seguindo nossa [API](http://github.com/bildvitta/api)) de uma forma mais rápida, fácil e padronizada.

Com o passar do tempo, o asteroid se tornou mais do que apenas um facilitador e padronizador para desenvolvimento de aplicações web, mas também se tornou nosso framework de **Design System** para o frontend dentro da Inovação do grupo **Bild & Vitta**.

Observação: Alguns componentes do Quasar precisam ser importados manualmente dentro de [quasar.config.js](https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework) (por exemplo quando usar o `QasFormView` terá que importar o [QPage](https://quasar.dev/layout/page#Introduction)).

## Estrutura:

```bash
.
├── app-extension                              # Onde ficam as configurações do app-extension, como arquivos de boot/
│   └── src/
│       ├── boot/                              # Arquivos boot (https://quasar.dev/quasar-cli-vite/boot-files#introduction)
│       ├── templates/                         # Templates que serão copiados para dentro do projeto na hora de instalar o asteroid
│       ├── index.js                           # https://quasar.dev/app-extensions/development-guide/index-api
│       └── install.js                         # https://quasar.dev/app-extensions/development-guide/install-api
├── docs                                       # Aplicação quasar da documentação (https://asteroid-v3.vercel.app/)/
│   └── src/
│       ├── assets/
│       │   └── menu.js                        # Arquivo onde será adicionado os items para o menu da documentação
│       ├── components/                        # Componentes para serem usados na criação da documentação
│       ├── examples/                          # Aqui vão todos os arquivos .vue que serão usados como exemplos na documentação
│       └── pages/                             # Paginas da documentação, cada arquivo markdown é uma pagina./
│           ├── components/                    # Paginas de componentes
│           ├── composables/                   # Paginas de composables
│           ├── helpers/                       # Paginas de utilitários
│           ├── plugins/                       # Paginas de plugins
│           ├── start/                         # Paginas de iniciando
│           └── styles/                        # Paginas de estilos
├── ui/
│   ├── dev/                                   # Aplicação quasar para ser utilizada nos testes enquanto esta em desenvolvimento
│   └── src/
│       ├── assets/                            # Diretório para adicionar arquivos como images, svg, etc.
│       ├── components                         # Diretório onde ficam de fato os componentes do asteroid/
│       │   └── meu-componente                 # PASTA DE EXEMPLO/
│       │       ├── QasMeuComponente.vue       # COMPONENTE DE EXEMPLO
│       │       └── QasMeuComponente.yml       # ARQUIVO PARA DOCUMENTAÇÃO DE EXEMPLO
│       ├── composables/                       # Arquivos de composables (https://vuejs.org/guide/reusability/composables.html)
│       ├── css                                # CSS da aplicação/
│       │   ├── components/                    # CSS que alteram estilos de componentes
│       │   ├── mixins/                        # SASS mixins (https://sass-lang.com/documentation/at-rules/mixin)
│       │   ├── utils/                         # Classes utilitárias
│       │   └── variables/                     # Diretórios para alterar variáveis do sass e css
│       ├── directives/                        # Diretivas do vue (https://vuejs.org/api/built-in-directives.html#built-in-directives)
│       ├── helpers/                           # Diretório para adicionar funções utilitárias
│       ├── mixins/                            # Mixins do vue (https://vuejs.org/api/options-composition.html#mixins)
│       ├── pages/                             # Diretório para adicionar paginas para aplicação, como por exemplo: paginas de erro 404, 403, 500.
│       ├── plugins/                           # Diretórios para adicionar plugins/
│       │   └── meu-plugin                     # PASTA DE EXEMPLO/
│       │       ├── MeuPlugin.js               # PLUGIN DE EXEMPLO
│       │       └── MeuPlugin.yml              # DOCUMENTAÇÃO DO MEU PLUGIN DE EXEMPLO
│       ├── asteroid.js                        # Arquivo para importar e exportar arquivos de: helpers, mixins, veu-plugin e composables
│       ├── index.scss                         # Arquivo de configurações de algumas variáveis do sass e css e para importar todos os arquivos css do asteroid
│       └── vue-plugin.js                      # Arquivo para importar todos components, diretivas e plugins criados dentro do /ui.
└── eslint                                     # Biblioteca de lint para o asteroid.
```

## Variáveis de ambiente

| Variável | Descrição  |
| ------------ | ------------ |
| `BUCKET_URL` | Endereço de hospedagem dos arquivos |
| `SERVER_BASE_URL` | Endereço base de acesso do servidor |
| `DEBUGGING` | Habilita os loggers dos componentes |
| `MAPS_API_KEY` | Key do google maps |
| `ABLY_KEY` | Key do Ably (notificações) |
| `ME_VERSION` | Versão do endpoint /me |

## Roadmap:

- [ ] Finalizar `eslint-plugin-asteroid`;
- [ ] Desenvolver um novo `asteroid-starter-kit` para o Quasar v2 + Asteroid v3, com suporte ao Webpack e Vite;
- [ ] Adicionar componentes específicos criados nos projetos e que fazem sentido estar no Asteroid;
- [ ] Melhoria geral na documentação (adicionar mais exemplos, links etc);
- [ ] Refatoração de código dos componentes para uma melhorar a performance;
- [ ] Testes unitários nos componentes;
- [ ] Desenvolver uma CLI para facilitar o desenvolvimento dentro do Asteroid;
- [ ] Desenvolver uma CLI para facilitar o desenvolvimento fora do Asteroid;
- [ ] Adicionar exemplos de uso com lazy loading no `QasSearchBox` e `QasSelect`;
- [ ] Adicionar `handleProcess` em todas variáveis de ambiente que não são obrigatórias.
- [ ] Migrar todos componentes para Composition API:
  - [ ] QasActions.vue
  - [ ] QasActionsMenu.vue
  - [ ] QasAlert.vue
  - [ ] QasAppBar.vue
  - [ ] QasAppMenu.vue
  - [ ] QasAppUser.vue
  - [ ] QasAvatar.vue
  - [ ] QasBadge.vue
  - [ ] QasBox.vue
  - [x] QasBreakline.vue
  - [ ] QasButton.vue
  - [ ] QasBtnDropdown.vue
  - [ ] QasCard.vue
  - [ ] QasCheckboxGroup.vue
  - [ ] QasCopy.vue
  - [ ] QasDate.vue
  - [ ] QasDateTimeInput.vue
  - [ ] QasDebugger.vue
  - [ ] QasDelete.vue
  - [ ] QasDialog.vue
  - [ ] QasDialogRouter.vue
  - [ ] QasEmptyResultText.vue
  - [ ] QasField.vue
  - [ ] QasFilters.vue
  - [x] QasFormGenerator.vue
  - [ ] QasFormView.vue
  - [ ] QasGallery.vue
  - [ ] QasGalleryCard.vue
  - [ ] QasGridGenerator.vue
  - [ ] QasHeaderActions.vue
  - [ ] QasInput.vue
  - [ ] QasLabel.vue
  - [ ] QasLayout.vue
  - [ ] QasListItems.vue
  - [ ] QasListView.vue
  - [ ] QasMap.vue
  - [ ] QasNestedFields.vue
  - [ ] QasNumericInput.vue
  - [ ] QasOptionGroup.vue
  - [ ] QasPageHeader.vue
  - [ ] QasPagination.vue
  - [ ] QasPasswordInput.vue
  - [ ] QasPasswordStrengthChecker.vue
  - [ ] QasProfile.vue
  - [ ] QasResizer.vue
  - [ ] QasSearchBox.vue
  - [ ] QasSearchInput.vue
  - [ ] QasSelect.vue
  - [ ] QasSelectList.vue
  - [ ] QasSignaturePad.vue
  - [ ] QasSignatureUploader.vue
  - [ ] QasSingleView.vue
  - [ ] QasSortable.vue
  - [x] QasStatus.vue
  - [ ] QasTableGenerator.vue
  - [ ] QasTabsGenerator.vue
  - [x] QasTextTruncate.vue
  - [ ] QasTransfer.vue
  - [ ] QasTreeGenerator.vue
  - [ ] QasUploader.vue
  - [ ] QasWelcome.vue

# Licença

MIT (c) Bild & Vitta <systemteam@bild.com.br>
