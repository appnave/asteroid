---
title: border
---

### Direction
Define qual direção será criado uma borda.

| **Nome da Classe** |          **Descrição**               |      **Adiciona**        |
|--------------------|--------------------------------------|--------------------------|
|`border-top`        | Cria uma borda no topo do objeto     |`border-top-width: 1px`   |
|`border-bottom`     | Cria uma borda na base do objeto     |`border-bottom-width: 1px`|
|`border-left`       | Cria uma borda na esquerda do objeto |`border-left-width: 1px`  |
|`border-right`      | Cria uma borda na direita do objeto  |`border-right-width: 1px` |

### Colors
Define uma cor para a borda de acordo com as variáveis `$primary` `$secondary`
|     **Nome da Classe**    |                       **Descrição**                        |            **Adiciona**               |
|---------------------------|------------------------------------------------------------|-------------------------------------  |
|`border-primary`           | Cria uma Borda com a cor da variável `$primary`            |`border: 1px solid $primary`           |
|`border-primary-contrast`  | Cria uma Borda com a cor da variável `$primary-contrast`   |`border: 1px solid $primary-contrast`  |
|`border-secondary`         | Cria uma Borda com a cor da variável `$secondary`          |`border: 1px solid $secondary`         |
|`border-secondary-contrast`| Cria uma Borda com a cor da variável `$secondary-contrast` |`border: 1px solid $secondary-contrast`|
|`border-grey`              | Cria uma Borda com a cor da variável `$border-grey`        |`border: 1px solid $border-grey`       |
|`bordered`                 | Cria uma Borda com a cor da variável `$border-grey` e arredondada        |`border: 1px solid $border-grey` `border-radius: $generic-border-radius`   |
|`border-magic-ai`          | Cria uma borda com o gradiente de magic AI (nota: `border-image` não suporta `border-radius`) |`border: 1px solid; border-image: linear-gradient(90deg, #0F54AE 0%, #C51162 100%) 1`|
