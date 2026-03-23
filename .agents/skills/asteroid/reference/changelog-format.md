# Formato do CHANGELOG.md

O Asteroid usa o formato **Keep a Changelog** em português brasileiro.

## Estrutura

```markdown
## Não publicado

## BREAKING CHANGES
- Mudanças que podem quebrar a aplicação.

### Adicionado
- `QasComponente`: Descrição da mudança.

### Modificado
- `QasComponente`: Descrição da mudança.

### Corrigido
- `QasComponente`: Descrição da mudança.

### Removido
- `QasComponente`: Descrição da mudança.
```

## Seções

| Seção | Quando usar |
|-------|-------------|
| **BREAKING CHANGES** | Mudanças que podem quebrar a aplicação, normalmente quando estão em ### Removido |
| **Adicionado** | Novas features, novos componentes, novas props |
| **Modificado** | Alterações em features existentes |
| **Corrigido** | Bug fixes |
| **Removido** | Features removidas, props deprecadas removidas |

## Regras

- Sempre usar **português brasileiro (pt-BR)** nas descrições.
- Formato de cada item: `` - `QasComponente`: Descrição da mudança. ``
- Novas mudanças vão na seção `## Não publicado` no topo do arquivo.
- O build script substitui `## Não publicado` pelo header da versão + data automaticamente no release.
- Use `<!-- N/A -->` para marcar itens que não devem ser adicionados ao changelog de releases estáveis.

## Exemplo Real

```markdown
## [3.20.0-beta.10] - 10-02-2026

### Adicionado
- `QasFilters`: Alterado largura de 270px para 300px.

### Modificado
- `QasFormView`: modificado lógica quando `useStore: false`.

### Corrigido
- `QasBtn`: Corrigido tamanho do botão.
```
