---
title: border-radius
---

A propriedade CSS border-radius permite definir como bordas arredondadas são.

| **Nome da Classe** |                       **Descrição**                       |                     **Adiciona**                   |
|--------------------|-----------------------------------------------------------|----------------------------------------------------|
|`rounded-borders-sm`| Cria um pequeno raio de borda em todos os lados do objeto |`border-radius: calc(#{$generic-border-radius} / 2)`|
|`rounded-borders-lg`| Cria um grande raio de borda em todos os lados do objeto  |`border-radius: calc(#{$generic-border-radius} * 2)`|

`*$generic-border-radius`: **`4px`**.

### Composições
Define qual direção será criado um arrendondamento de borda

|   **Nome da Classe**   |                  **Descrição**                  |                       **Adiciona**                           |
|------------------------|-------------------------------------------------|--------------------------------------------------------------|
|`rounded-borders-top`   | Cria um raio de borda no topo do objeto         |`border-bottom-left-radius: 0` `border-bottom-right-radius: 0`|
|`rounded-borders-bottom`| Cria um raio de borda na base do objeto         |`border-top-left-radius: 0` `border-top-right-radius: 0`      |
|`rounded-borders-right` | Cria um raio de borda do lado direito do objeto |`border-bottom-left-radius: 0` `border-top-left-radius: 0`    |
|`rounded-borders-left`  | Cria um raio de borda do lado esquerdo do objeto|`border-bottom-right-radius: 0` `border-top-right-radius: 0`  |

