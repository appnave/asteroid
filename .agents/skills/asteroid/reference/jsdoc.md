
# Guia de documentação JSDoc para Asteroid (.js e .vue)

Passo a passo para documentar códigos no Asteroid.

## 1. Regras Gerais

- Utilize JSDoc sempre que um comentário exceder 120 colunas.
  - Exemplo incorreto:
    ```js
    // Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
    ```
  - Exemplo correto:
    ```js
    /**
     * Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
     * standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make
     * a type specimen book.
     */
    ```
- Documente todos os parâmetros das funções com tipagem.
- Tipos primitivos: sempre em minúsculo (`boolean`, `string`, `number`).
- Tipos complexos: sempre em maiúsculo (`Object`, `Array`, etc).
- Inicie toda função ou computed com JSDoc, mesmo que o comentário seja curto.
- A documentação deve ser clara, humanizada e em português brasileiro.
- Em cenários complexos, inclua exemplos curtos e práticos.
- Não utilize emojis.
- Referencie arquivos ou funções quando necessário para contexto.

## 2. Regras específicas para .vue e composables

- Documente sempre o início de funções, props e computeds.
- Exemplo:
  ```js
  /**
   * Retorna o nome em letras maiúsculas.
   */
  const upperName = computed(() => ...)

  /**
   * Obtém o nome do usuário.
   * @param {Object} user - Objeto usuário
   * @param {string} user.name - Nome do usuário
   */
  function getName(user) {
    return user.name
  }
  ```

## 3. Exemplos de JSDoc

```js
/**
 * Soma dois números.
 *
 * @param {number} a - Primeiro número
 * @param {number} b - Segundo número
 * @returns {number} Resultado da soma
 */
function sum (a, b) {
  return a + b
}
```
