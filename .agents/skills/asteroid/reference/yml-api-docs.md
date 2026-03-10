# Documentação de API (YML)

Cada componente Asteroid tem um arquivo `.yml` que descreve sua API pública. Esses YMLs são processados pelo `build/api.js` para gerar JSON e pelo `build/vetur.js` para autocomplete de IDE.

## Localização

```
ui/src/components/<nome-kebab>/Qas<NomePascal>.yml
```

## Estrutura Completa

```yaml
type: component

# Mixins de API do Quasar (herda props)
mixins:
  - quasar/dist/api/QBtn.json

meta:
  desc: "Descrição do componente em português brasileiro."

props:
  label:
    desc: "Label principal do componente."
    type: String
    default: "''"
    required: false
    examples: ["'Minha label'"]

  model-value:
    desc: "Valor do v-model."
    type: [String, Number]
    model: true           # Marca como v-model prop

  callback:
    desc: "Função de callback."
    type: Function
    params:
      value:
        desc: "Valor atual"
        type: String

events:
  click:
    desc: "Emitido ao clicar no componente."
    params:
      event:
        desc: "Evento nativo do click"
        type: Event

  "update:model-value":
    desc: "Emitido ao alterar o valor."
    params:
      value:
        desc: "Novo valor"
        type: [String, Number]

slots:
  default:
    desc: "Conteúdo principal do componente."
  header:
    desc: "Cabeçalho customizado."
    scope:
      title:
        desc: "Título atual"
        type: String
```

## Regras

- **Todas as descrições em português brasileiro (pt-BR).**
- Props em **kebab-case** no YML (mesmo sendo camelCase no JS) — ex: `model-value`, não `modelValue`.
- `model: true` para props que suportam `v-model`.
- `mixins` faz merge com API JSON do componente Quasar base.
- Valores `default` entre aspas simples quando string — ex: `default: "''"`.
- O campo `type` aceita tipos simples (`String`, `Number`, `Boolean`, `Array`, `Object`, `Function`) ou arrays de tipos (`[String, Number]`).
- O campo `values` lista valores possíveis para props enum — ex: `values: ["primary", "secondary"]`.
- O campo `examples` lista exemplos de uso — ex: `examples: ["'Minha label'"]`.
