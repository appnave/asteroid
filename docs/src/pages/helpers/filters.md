---
title: filters
---

Conjunto de funções de formatação para ajudar no desenvolvimento.

Funções: `asset`, `booleanLabel`, `date`, `dateTime`, `decimal`, `formatCompanyDocument`, `formatDocument`, `formatPercent`, `formatPersonalDocument`, `formatPhone`, `formatPostalCode`, `handleMasks`, `humanDate`, `humanize`, `money`, `optionLabel`, `parseValue`, `percent`, `squareArea`.

- [asset](/helpers/filters/#asset)
- [booleanLabel](/helpers/filters/#booleanLabel)
- [date](/helpers/filters/#date)
- [dateTime](/helpers/filters/#dateTime)
- [decimal](/helpers/filters/#decimal)
- [formatCompanyDocument](/helpers/filters/#formatCompanyDocument)
- [formatDocument](/helpers/filters/#formatDocument)
- [formatPercent](/helpers/filters/#formatPercent)
- [formatPersonalDocument](/helpers/filters/#formatPersonalDocument)
- [formatPhone](/helpers/filters/#formatPhone)
- [formatPostalCode](/helpers/filters/#formatPostalCode)
- [handleMasks](/helpers/filters/#handleMasks)
- [humanDate](/helpers/filters/#humanDate)
- [humanize](/helpers/filters/#humanize)
- [money](/helpers/filters/#money)
- [optionLabel](/helpers/filters/#optionLabel)
- [parseValue](/helpers/filters/#parseValue)
- [percent](/helpers/filters/#percent)
- [squareArea](/helpers/filters/#squareArea)

### Funções

#### asset
Função para retornar uma URL concatenada com o BASE_URL.

```js
import { asset } from 'asteroid'

// supondo que nosso BASE_URL seja: https://uploader.nave.dev
asset('bild.png')
// retorna: 'https://uploader.nave.dev/bild.png'
```

#### booleanLabel
Função para converter valores booleano para string, em um padrão "humano".

```js
import { booleanLabel } from 'asteroid'

// Definição
booleanLabel(
  value, // valor boolean,
  trueLabel = 'sim', // se for true, retorna "sim" ("sim" já é padrão)
  falseLabel = 'não' // se for false, retorna "não" ("não" já é padrão)
)

booleanLabel(true)
// retorna: "sim"
```

#### date
Função para formatar datas, implementa o `format` do `date-fns`.

```js
import { date } from 'asteroid'

// Definição
date(
  value // valor da data,
  token = 'dd/MM/yyyy', // mascara da data,
  options // opções do `format` do `date-fns`
)

const date = new Date(2022, 4, 7, 13, 12, 50).toISOString() // '2022-05-07T03:00:00.000Z'

date(date)
// retorna: 07/04/2022
```

#### dateTime
Função para formatar datas e hora, implementa o `format` do `date-fns`.

```js
import { dateTime } from 'asteroid'

// Definição
date(
  value // valor da data,
  token = 'dd/MM/yyyy', // mascara da data,
  options // opções do `format` do `date-fns`
)

const date = new Date(2022, 4, 7, 13, 12, 50).toISOString() // '2022-05-07T03:00:00.000Z'

date(date)
// retorna: 07/05/2022 13:12:50
```

#### decimal
Função que remove pontuação de um valor decimal e transforma em string com virgula.

```js
import { decimal } from 'asteroid'

decimal(20.5)
// retorna: '20,5'
```

#### formatCompanyDocument
Função que adiciona formatação para CNPJ.

```js
import { formatCompanyDocument } from 'asteroid'

formatCompanyDocument('99999999999999')
// retorna: '99.999.999/9999-99'

formatCompanyDocument('ODH0LCRV000000')
// retorna 'OD.H0L.CRV.0000-00'
```

#### formatDocument
Função que adiciona formatação para CPF/CNPJ.

```js
import { formatDocument } from 'asteroid'

// CNPJ
formatDocument('99999999999999')
// retorna: '99.999.999/9999-99'

// CNPJ
formatDocument('ODH0LCRV000000')
// retorna 'OD.H0L.CRV.0000-00'

// CPF
formatDocument('99999999999')
// retorna: '999.999.999-99'
```

#### formatPersonalDocument
Função que adiciona formatação para CPF.

```js
import { formatPersonalDocument } from 'asteroid'

formatPersonalDocument('99999999999')
// retorna: '999.999.999-99'
```

#### formatPercent
Função que adiciona formatação para CPF.

```js
import { formatPercent } from 'asteroid'

formatPercent(0.25)
// retorna: '25,00%'
```

#### formatPhone
Função que adiciona formatação para Telefone.

```js
import { formatPhone } from 'asteroid'

formatPhone('99999999999')
// retorna: '(99) 99999-9999'

// com um digito a menos
formatPhone('99999999999')
// retorna: '(99) 9999-9999'
```

#### formatPostalCode
Função que adiciona formatação para CEP.

```js
import { formatPostalCode } from 'asteroid'

formatPostalCode('99999999')
// retorna: '99999-999'
```

#### handleMasks
Função que lida com qual função de formatação chamar.

```js
import { handleMasks } from 'asteroid'

handleMasks()
// {
//   'company-document': () => formatCompanyDocument(value),
//   document: () => formatDocument(value),
//   'personal-document': () => formatPersonalDocument(value),
//   phone: () => formatPhone(value),
//   'postal-code': () => formatPostalCode(value),
//   decimal: () => decimal(value),
//   money: () => money(value),
//   'square-area': () => squareArea(value)
// }

handleMasks()['postal-code']('99999999')
// retorna: '99999-999'
handleMasks()['personal-document']('99999999999')
// retorna: '999.999.999-99'
```

#### humanize
Função para "humanizar" dados.

```js
import { humanize } from 'asteroid'

const fields = {
  isActive: {
    name: 'isActive',
    label: 'Ativo',
    type: 'boolean'
  },

  company: {
    name: 'company',
    label: 'Empresa',
    type: 'select',
    options: [
      {
        label: 'Empresa 1',
        value: 'empresa-1'
      },
      {
        label: 'Empresa 2',
        value: 'empresa-2'
      },
      {
        label: 'Empresa 3',
        value: 'empresa-3'
      }
    ]
  }
}

humanize(fields.isActive, true)
// retorna: sim'

humanize(fields.company, 'empresa-2')
// retorna: 'Empresa 2'
```

#### money
Função para adicionar formação de dinheiro em números e decimais.

```js
import { money } from 'asteroid'

money(25.5)
// retorna: 'R$ 25,50'

money(25)
// retorna: 'R$ 25,00'
```

#### optionLabel
Função para retornar label dentro de um array de objetos contendo chaves "label" e "value".

```js
import { optionLabel } from 'asteroid'

const options = [
  {
    label: 'Empresa 1',
    value: 'empresa-1'
  },
  {
    label: 'Empresa 2',
    value: 'empresa-2'
  },
  {
    label: 'Empresa 3',
    value: 'empresa-3'
  }
]

optionLabel(options, 'empresa-3')
// retorna: 'Empresa 3'
```

#### parseValue
Função para transformar valores string de "true" ou "false" em booleanos.

```js
import { parseValue } from 'asteroid'

parseValue('true')
// retorna: true

parseValue('false')
// retorna: false
```

#### percent
Função para transformar valores bruto em porcentagem, sem fazer nenhuma conversão, diferente do `formatPercent`.

```js
import { percent } from 'asteroid'

percent(0.25)
// retorna: '0,25%'
```

#### squareArea
Função para transformar valores em área quadrada.


```js
import { squareArea } from 'asteroid'

squareArea(25)
// retorna: '25 m²'

squareArea('25')
// retorna: '25 m²'
```
