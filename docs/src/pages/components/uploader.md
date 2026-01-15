---
title: QasUploader
---

Componente para upload com auto redimensionamento que implementa o "QField" e "QUploader".

<doc-api file="uploader/QasUploader" name="QasUploader" />

:::info
Por hora, este componente não funciona na documentação e é preciso testar ele em algum projeto que tenha um bucket para upload.
:::

:::info
##### Propriedade galleryCardProps

A propriedade `galleryCardProps` pode ser usada como callback function, que vai retornar as seguintes informações:

```js
galleryCardPropsFn ({
  hasError,
  file: {
    format,
    name,
    url
  }
})
```
:::

:::tip
O comportamento padrão do componente **QasUploader** é emitir/receber a `url` de upload do arquivo. Porém, ao utilizar a prop `useObjectModel` o componente começará a emitir/receber o valor como objeto.

O formato padrão do model de objeto é:
```js
{
  format: '.fileFormat',
  url: 'filePath',
  name: 'fileName'
}
```
:::

## Uso

<doc-example file="QasUploader/Basic" title="Básico" />
<doc-example file="QasUploader/ExUploaderCustom" title="Custom list e card sem imagem" />

:::info
- Caso utilize o `headerProps`, por padrão sempre teremos o item `add` para realizar a adição dos arquivos, caso queira sobrescrever a ação de upload, basta passar um outro item `add` em list.
:::
<doc-example file="QasUploader/WithHeaderProps" title="Usando HeaderProps" />
<doc-example file="QasUploader/WithError" title="Com erro" />
<doc-example file="QasUploader/ExUploaderMultiple" title="Múltiplo" />
<doc-example file="QasUploader/ExUploaderMultipleObjectModel" title="Múltiplo com useObjectModel" />
<doc-example file="QasUploader/ExUploaderSingleObjectModel" title="Múltiplo com useObjectModel" />
<doc-example file="QasUploader/ExUploaderCardCallback" title="Múltiplo com callback nos cards" />

:::info
- Para que o modo com grid funcione, é necessário utilizar a propriedade `useObjectModel` e que exista pelo menos a propriedade `fields` ou então o fields dentro de `gridGeneratorProps`.
:::

<doc-example file="QasUploader/ExUploaderMultipleGrid" title="Múltiplo e com grid" />

:::info
- Quando o componente pode ser editável, sempre que for adicionado novos arquivos **antes** de salvar, vai ter a opção de editar os campos no próprio card (não é possível simular pois o upload não funciona na documentação). Se o arquivo já esta salvo ou foi salvo, a opção de editar fica dentro do menu de ações de cada card.

- O QasUploader fica escutando o evento `submit-success` disparado pelo `QasFormView`, caso as entidades sejam as mesmas, ele seta o componente para o modo "grid" sumindo com os inputs do card e habilitando o editar no menu de ações.

- Para que o modo edição funcione, é necessário utilizar a propriedade `useObjectModel` e que exista pelo menos a propriedade `fields` ou então o fields dentro de `formGeneratorProps`.
:::

<doc-print :src="require('assets/prints/uploader-editable.png')" />

:::info
##### Como funcionam prop `errors` no QasUploader

Quando você passa erros para o componente através da propriedade `errors`, eles são tratados de forma inteligente:

- **Erros de campos** (como `format`, `name`, etc.) → Aparecem nos inputs dentro de cada card
- **Erros de `url`** → Aparecem como mensagem de erro no próprio card (não no input)

**Exemplo prático:**
```js
{
  'documents.0.format': ['Formato inválido'], // Aparece no campo "format" do 1º card
  'documents.0.url': ['Arquivo corrompido'], // Aparece como erro do 1º card
  'documents.1.format': ['Extensão não permitida'] // Aparece no campo "format" do 2º card
}
```

Isso permite mostrar tanto erros específicos de campos quanto erros gerais do arquivo de forma organizada.
:::
<doc-example file="QasUploader/ExUploaderMultipleEditable" title="Múltiplo e editável" />
