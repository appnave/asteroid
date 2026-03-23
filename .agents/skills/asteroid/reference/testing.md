# Testes no Asteroid

## Framework

- **Vitest** + **jsdom** + **@vue/test-utils**
- Config em `vitest.config.ts` na raiz do monorepo

## Como Rodar

```bash
# Todos os testes
npm run test

# Filtrar por nome
npx vitest run -t "<test name>"

# Watch mode
npx vitest
```

## Localização dos Testes

- **Helpers:** Testes inline nos próprios arquivos (usando `import.meta.vitest`):
  ```js
  // ui/src/helpers/is-empty.js
  export default function isEmpty (value) { ... }

  if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest
    describe('isEmpty', () => {
      it('should return true for null', () => {
        expect(isEmpty(null)).toBe(true)
      })
    })
  }
  ```
- **Componentes e testes maiores:** Arquivos separados na mesma pasta

## Aliases no Vitest

O `vitest.config.ts` configura aliases necessários:
```js
alias: {
  asteroid: path.resolve(__dirname, 'ui/src/asteroid.js'),
  'asteroid-config': path.resolve(__dirname, 'docs/asteroid.config.js'),
  quasar: 'quasar/dist/quasar.esm.prod.js'
}
```

## Regras

- Adicione ou atualize testes para qualquer código alterado.
- Foco atual: helpers e componentes simples.
- Rode `npm run test` antes de commitar para garantir que tudo passa.
- Nunca use stubs  nos testes.
