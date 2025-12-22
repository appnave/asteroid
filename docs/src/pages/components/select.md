---
title: QasSelect
---

Componente para select que implementa o "QSelect" repassando propriedades, slots e eventos.

<doc-api file="select/QasSelect" name="QasSelect" />

:::warning
Neste componente é um "wrapper" do [QSelect](https://quasar.dev/vue-components/select#introduction) o que significa que ele repassa todos os slots, eventos e propriedades.
:::

:::warning
Quando usado a propriedade `useLazyLoading` o componente depende do `Vuex`, utiliza módulos com action para manipular/recuperar os dados:
- actions: fetchFieldOptions.

Hoje Utilizamos 1 biblioteca compatível:
[VuexStoreModule](https://github.com/bildvitta/vuex-store-module).
:::

## Uso

<doc-example file="QasSelect/Basic" title="Básico" />
<doc-example file="QasSelect/Required" title="Obrigatório" />

:::info
#### Modo filtro

- Utilize o modo de filtro apenas em casos onde o select serve para filtrar informações na tela.
- Sempre utilize um ícone personalizado quando utilizado no modo filtro.
- Select fora de box/dialog tem estilo com sombra, dentro de box/dialog tem estilo com borda.
:::
<doc-example file="QasSelect/FilterMode" title="Modo Filtro" />

:::info
Quando o select for `required` ou tiver a prop `use-auto-select` e houver apenas UMA opção disponível, o seu valor é setado automaticamente.
:::
<doc-example file="QasSelect/AutoSelect" title="Auto select" />

<doc-example file="QasSelect/Searchable" title="Com pesquisa" />

:::info
Para usar opções customizadas, é necessário adicionar a prop `use-custom-options`.

Caso queira usar badges nas opções, o back precisa retornar a chave em questão dizendo qual badge será mostrada, ex:
```js
[
  {
    label: 'Label 1',
    value: '1',
    isTester: true, // chave que vai ser usada pra validação da badge no nosso exemplo,
    isAvailable: false, // chave que vai ser usada pra validação da badge no nosso exemplo,
    company: 'company1' // chave que vai ser usada pra validação da badge no nosso exemplo,
  }
]
```
Por padrão caso for false, não é exibido a badge, sendo que caso queira que sempre exiba, basta passar `show: true` na key desejado da `badgeProps`, assim você consegue colocar um estilo diferente de acordo com o valor enviado pelo backend.

Devido cada chave ser um `callback`, podemos receber outros valores que não sejam booleans para assim termos um controle maior da personalização.

Obs: Caso não encontre a props da badge em questão, a mesma não é exibida na opção do select.
:::
<doc-example file="QasSelect/CustomOption" title="Com opção personalizada" />

#### Lazy loading

:::info
Quando as 'opções' são passadas externamente para o componente e o mesmo está em modo lazy loading, essas opções serão adicionadas como as primeiras opções, e as opções que vierem através do fetch serão adicionadas abaixo delas. As opções do fetch serão verificadas para evitar adicionar opções duplicadas. De acordo com nossos padrões, o backend sempre retorna as opções dentro de 'fields' dos itens que já foram selecionados. Essa é a maneira correta do componente sempre apresentar as opções selecionadas em ordem inicial.
:::

Quando usamos o `QasSelect` com grande quantidades de dados devemos ter um endpoint específico para buscar as suas opções, assim, eliminando o peso de retornar todas as opções do campo no _fields_ da página.

Para utilizar dessa funcionalidade é necessário que dois requisitos sejam realizados, são eles: Requisitos de back-end e de front-end.

##### Back-end
O back-end deverá ter um endpoint especializado em retornar as opções paginadas, com opção de busca e preparado para receber demais parâmetros de URL. O padrão acordado e que futuramente deverá ser inserido no Navpi:

**Endpoint:** :entity/options/:field-name
**Parâmetros padrões:** limit, offset e search (deverá aceitar mais parâmetros se necessário, assim, possibilitando filtros com base em outros dados)
**Retorno:** count, fields e results

Deverá haver mudanças na entidade relacionada que retorna o campo que utiliza do lazy loading:
* Em todos os endpoints da entidade deverá retornar no campo o parâmetro `useLazyLoading: true` e o `name`;
* No endpoint **new** da entidade deverá retornar as opções vazias para o respectivo campo;
* Nos endpoints **edit**, **show** e **list** deverá retornar as opções selecionadas anteriormente nas opções do campo.

##### Front-end
O front-end deverá atribuir as propriedades no uso do componentes QasSelect e QasSelectList:
* `entity`
* `name` (automático pelo Navpi)
* `useLazyLoading` (automático pelo Navpi)
* `lazyLoadingProps` (opcional)

_Opcional:_ Com base nas props `entity` e `name`, a função de fetchOptions dos componentes QasSelect e QasSelectList buscará as opções na API utilizando a URL `:entity/options/:field-name`. Porém, você poderá substituir a URL padrão utilizando a propriedade `lazyLoadingProps` e passando um objeto de configuração, como, por exemplo:

```js
{
  url: String  // URL para realizar o fetch das opções
  params: Object, // Parâmetros que poderão ser enviados para a API
  decamelizeFieldName: Boolean // Caso utilize da URL padrão, esse parâmetro irá transformar o `fieldName` para `field-name` no momento de montar a URL da API.
}
```

<doc-example file="QasSelect/Readonly" title="Readonly" />
