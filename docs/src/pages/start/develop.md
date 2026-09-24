---
title: Desenvolvendo
---

## Antes de tudo
Para testar, vamos instalar todas as dependências necessárias, rode o comando dentro das seguintes pastas:
- `/` (raiz)
- `/ui`
- `/docs`
- `app-extension`
- `/ui/dev`

```bash
npm i
```

#### 1. Usando documentação para testar **(recomendado)**.
Você pode utilizar a documentação para fazer os testes necessários dentro do asteroid, dentro de `/docs`, rode os seguintes comandos:

```js
quasar dev
```

#### 3. Usando o asteroid local e alterações refletindo no projeto.
Este passo **não** é um `npm link` e funciona apenas para alterações feitas dentro da pasta `/ui`.

Primeiro, você precisa pegar o caminho relativo que se encontra o `asteroid` localmente na sua maquina, vamos supor que o nosso seja: `~/Documents/bild/asteroid`.

Dentro do seu projeto que está usando asteroid, no terminal, vá até `node_modules/@appnave/quasar-app-extension-asteroid`, e digite este comando:

```js
npm add file:~/Documents/bild/asteroid/ui
```

Agora o `quasar-app-extension-asteroid` dentro do `node_modules` do seu projeto está redirecionado para o `ui/` do asteroid localmente.

:::warning

Caso esteja utilizando a versão do Asteroid superior à **3.11.0-beta.0**, deverá ser incluído este alias dentro do `chainWebpack` em seu `quasar.conf.js`.

```js
chain.resolve.alias.set('vue', path.resolve('./node_modules/vue'))
```
:::

### Passos para criar um componente no asteroid.
Vamos imaginar que iremos criar um componente chamado `AutoComplete.vue`.

##### Passo 1
Em `/ui/src/components` crie a pasta com o arquivo `auto-complete/AutoComplete.vue`, ficando assim: `/ui/src/components/auto-complete/AutoComplete.vue`.

##### Passo 2
Precisamos registrar este componente, vá até `/ui/src/vue-plugin.js` e registre o componente seguindo os exemplos dos demais componentes.

##### Passo 3
Considerando que nosso componente esteja pronto, está na hora de criar a documentação, dentro de `/ui/src/components/auto-complete/` crie o arquivo `AutoComplete.yml`, ficando assim: `/ui/src/components/auto-complete/AutoComplete.yml`, com o arquivo criado, basta seguir os demais exemplos para a criação da documentação.

##### Passo 4
Agora, precisamos criar uma pagina para este componente na documentação, para isto, vá até `/docs/src/pages/components` e crie o arquivo `auto-complete.md`, ficando assim: `/docs/src/pages/components/auto-complete.md`.

Precisamos criar componentes para serem utilizados como exemplos através do componente `<doc-example />`, para isto, vá até `/docs/src/examples` e crie a pasta com o arquivo `QasAutocomplete/Basic.vue` (o nome do arquivo dentro da pasta pode ser qualquer coisa, em exemplos básicos normalmente é chamado de `Basic.vue`).

Dentro do `auto-complete.md` também iremos utilizar o arquivo `QasAutoComplete.yml` através do componente `<doc-api />`.

De uma forma geral, a pagina `auto-complete.md` deve conter o seguinte conteúdo seguindo nossos exemplos:

```md
---
title: QasAutoComplete
---

Aqui nós declaramos uma descrição do nosso componente.

<doc-api file="auto-complete/QasAutoComplete" name="QasAutoComplete" />

## Uso

<doc-example file="QasAutoComplete/Basic" title="Básico" />
```

##### Passo 5
Agora está na hora de adicionar esta pagina no menu da documentação, para isto vá até `/docs/src/assets/menu.js` encontre um `children` referente ao de componentes, e adicione o seguinte código:

```js
{
  name: 'Actions',
  path: '/components/actions'
}
```

:::tip
Para saber mais sobre a documentação, leia o `README.md` dentro de `/docs`.
:::
