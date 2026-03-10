# Build e Release (`build/`)

Scripts para build, publicação NPM e criação de releases do Asteroid.

## Estrutura

```
build/
├── build.js                         # CLI interativa de release (principal)
├── api.js                           # Gera JSONs de API a partir dos YMLs
├── vetur.js                         # Gera arquivos de autocomplete Vetur
└── release/
    ├── changelog-handler.js         # Parse e update do CHANGELOG.md
    ├── create-github-release.js     # Cria release no GitHub via API
    ├── create-github-release-from-browser.js  # Abre browser para release manual
    ├── get-app-extension-package.js # Dados do package do app-extension
    ├── get-latest-versions.js       # Busca últimas versões publicadas no NPM
    ├── get-nearest-version.js       # Encontra versão mais próxima
    ├── get-normalized-versions.js   # Normaliza versões semver
    ├── get-version-link-compare.js  # Gera link de comparação entre versões
    ├── git-handler.js               # Operações git (commit, tag, push)
    ├── install-next-ui.js           # Instala nova versão do ui no app-extension
    ├── notify-discord-chat.js       # Notifica Discord via webhook
    ├── release-app-extension.js     # Publica app-extension no NPM
    └── release-ui.js                # Publica ui no NPM
```

## Processo de Release (`build.js`)

CLI interativa executada com `npm run build` na raiz do projeto.

### Fluxo Completo

```
1. Validação de branch
   ├── main     → stable release
   ├── develop  → beta release
   └── feature/* → alpha release

2. Prompt de versão
   └── Sugere próximo patch/minor/major com pre-release tag

3. Bump de versão
   ├── package.json (root)
   ├── app-extension/package.json
   ├── docs/package.json
   └── ui/package.json

4. npm install em cada diretório

5. npm run lint (root)

6. Validação do CHANGELOG.md
   └── Busca seção "## Não publicado" (obrigatório para non-alpha)

7. Publicação ui/ no NPM
   ├── npm publish (stable)
   ├── npm publish --tag beta (beta)
   └── npm publish --tag alpha (alpha)

8. Publicação app-extension/ no NPM
   └── Mesma lógica de tags

9. Atualização do CHANGELOG.md
   └── Substitui "Não publicado" pelo header da nova versão + data

10. Git operations
    ├── git add .
    ├── git commit -m "v{version}"
    ├── git push
    ├── git tag v{version}
    └── git push --tags

11. GitHub Release
    ├── Via API (se GITHUB_TOKEN existe)
    └── Via browser (fallback manual)

12. Notificação Discord
    └── Via webhook (se DISCORD_WEBHOOK_CHANGELOG existe)
```

## Build de API (`api.js`)

Converte todos os `.yml`/`.yaml` de `ui/src/components/` para JSON em `ui/dist/api/`:

```
ui/src/components/btn/QasBtn.yml → ui/dist/api/QasBtn.json
```

Usado pela documentação e pelo ESLint plugin para validação de props.

## Build Vetur (`vetur.js`)

Gera arquivos de autocomplete para o Vetur (extensão VS Code):

1. Escaneia todos `.yml` em `ui/src/components/`
2. Gera `ui/dist/vetur/asteroid-tags.json` — mapa componente → atributos + descrição
3. Gera `ui/dist/vetur/asteroid-attributes.json` — mapa `componente/prop` → tipo + descrição
4. Nomes convertidos para kebab-case

## CHANGELOG.md

Formato **Keep a Changelog** em português:

```markdown
## [3.20.0-beta.10] - 10-02-2026
### Adicionado
- `QasFilters`: Alterado largura de 270px para 300px.

### Modificado
- `QasFormView`: modificado lógica quando `useStore: false`.

### Corrigido
- `QasBtn`: Corrigido tamanho do botão.
```

### Seções usadas:
- **Adicionado** — Novas features
- **Modificado** — Alterações em features existentes
- **Corrigido** — Bug fixes
- **Removido** — Features removidas

### Convenção do "Não publicado"
A seção `## Não publicado` agrupa mudanças da próxima versão. O build script substitui automaticamente pelo header da versão + data no momento do release.

### Comentário `<!-- N/A -->`
Usado para marcar itens que não devem ser adicionados ao changelog de releases estáveis.

## ESLint Plugin (`eslint/`)

Plugin ESLint customizado para validação de componentes Asteroid.

### Estrutura
```
eslint/
├── package.json        # eslint-plugin-asteroid
└── lib/
    ├── index.js        # Auto-exports via requireindex
    ├── configs/
    │   ├── base.js     # Parser vue-eslint-parser, env browser
    │   └── essential.js # Extends base
    ├── rules/
    │   └── no-invalid-props.js  # Valida props dos componentes Qas*
    └── utils/
        ├── global-allowed-props.js  # Whitelist de atributos HTML/Vue
        └── helpers.js               # API reader, resolvers de nome
```

### Regra `no-invalid-props`
Valida que somente props declaradas são usadas em componentes Asteroid nos templates:
1. Identifica componentes `Qas*` nos templates
2. Carrega API do componente (de `dist/api/<name>.json`, incluindo mixins)
3. Reporta atributos não reconhecidos
4. Ignora atributos globais (`class`, `style`, `key`, `ref`, `v-*`, `aria-*`, `disabled`)
