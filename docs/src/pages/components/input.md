---
title: QasInput
---

Componente para input que implementa o "QInput" repassando propriedades, slots e eventos.

<doc-api file="input/QasInput" name="QasInput" />

:::info
##### QasBtn com padrões alterados via provide
Quando utilizar o QasBtn nos slots `append` ou `prepend`, eles terão seus padrões alterados internamente, isto significa que não é recomendado passar props `variant`, `color` e principalmente `size` diretamente no componente.

**Uso recomendado:**
```html
<qas-input v-model="model">
  <template #append>
    <qas-btn label="Label 123" icon="sym_r_person" />
  </template>
</qas-input>
```
Repare que não foi utilizado props de color, variant ou size, porém `color` é uma das props que provavelmente vai ser necessário ser modificada com mais frequência.

**Definição interna**
```js
provide () {
  return {
    /**
     * @see QasBtn.vue - Injetando os valores padrões para o QasBtn.
     */
    btnPropsDefaults: computed(() => {
      return {
        size: 'md',
        variant: 'tertiary',
        ...(this.hasError && { color: 'negative' })
      }
    })
  }
}
```
:::

:::warning
Neste componente é um "wrapper" do [QInput](https://quasar.dev/vue-components/input#introduction) o que significa que ele repassa todos os slots, eventos e propriedades.
:::

:::info
##### mask
Propriedade `mask` vem do `QInput` e serve para definir um máscara para o input, porem nosso componente implementa algumas mascaras pré-definidas, como:

- `company-document` (CNPJ) → `XX.XXX.XXX/XXXX-##`
- `document` (CPF/CNPJ) → `###.###.###-##` | `XX.XXX.XXX/XXXX-##`
- `personal-document` (RG) → `###.###.###-##`
- `phone` (Telefone) → `(##) ####-#####` | `(##) #####-####`
- `postal-code` (CEP) → `#####-###`

Caso seja passado uma mask que não seja essas acima, será usado a que foi passada.

##### inputmode

É possível repassar propriedades nativas para o input, como inputmode, por padrão os inputs que possuem mascara default já possuem um inputmode default, assim como o input type `email`, porém é possível sobrescrever esse inputmode.

```bash
- company-document (CNPJ) -> text
- document (CPF/CNPJ) -> text
- personal-document (RG) -> numeric
- phone (Telefone) -> tel
- postal-code (CEP) -> numeric
- email (TYPE E-MAIL) -> email
```
:::

## Uso

<doc-example file="QasInput/Basic" title="Básico" />
<doc-example file="QasInput/Textarea" title="Textarea" />
<doc-example file="QasInput/Required" title="Obrigatório" />
<doc-example file="QasInput/Readonly" title="Readonly" />
<doc-example file="QasInput/Masks" title="Mascaras" />

:::info
As propriedades `counter` e `maxlength` são recuperadas via attrs sendo repassadas pelo Quasar, por isso não estão na lista de props do componente.
:::
<doc-example file="QasInput/Counter" title="Com contador e máximo de caracteres" />
