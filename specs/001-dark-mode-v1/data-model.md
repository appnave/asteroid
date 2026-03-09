# Data Model — Dark Mode v1

**Feature**: Dark Mode v1
**Data**: 09/03/2026

---

## Entidades

### UserThemePreference

Representa a preferência de tema do usuário. Persistida exclusivamente no client-side.

| Atributo | Tipo | Descrição |
|---|---|---|
| `theme` | `'light' \| 'dark'` | Tema selecionado pelo usuário |
| `updatedAt` | `string (ISO 8601)` | Data da última alteração |

**Armazenamento**: `localStorage`
- **Key**: `qas-theme-preference`
- **Value**: JSON string `{ "theme": "light|dark", "updatedAt": "..." }`
- **Default**: `{ "theme": "light" }` (FR-003)

**Regras de validação**:
- `theme` deve ser `'light'` ou `'dark'`. Qualquer outro valor → fallback para `'light'` (EC-003).
- Se `localStorage` inacessível → tema `'light'` sem erro (EC-001).

---

### ThemeToken

Representa um token de cor do design system com valores para cada modo.

| Atributo | Tipo | Descrição |
|---|---|---|
| `name` | `string` | Nome da variável CSS (ex: `--qas-text-primary`) |
| `lightValue` | `string` | Valor no modo light |
| `darkValue` | `string` | Valor no modo dark |
| `semantic` | `string` | Descrição semântica (ex: "Cor de texto principal") |

**Definição**: Centralizado em `ui/src/index.scss` via CSS custom properties.

---

### DarkColorMap

Mapeamento de cores do Quasar de light → dark, usado pelo composable `useThemeColor`.

| Cor Light | Cor Dark | Uso Semântico |
|---|---|---|
| `grey-10` | `grey-2` | Títulos, ações negativas/não-imediatas |
| `grey-8` | `grey-4` | Texto padrão |
| `grey-6` | `grey-5` | Estado inativo/desabilitado |
| `grey-4` | `grey-7` | Bordas |
| `grey-2` | `grey-9` | Backgrounds claros |
| `grey-3` | `grey-8` | Backgrounds secundários |
| `white` | `dark` | Background principal |
| `primary` | `primary` | Preservada (FR-005) |
| `secondary` | `secondary` | Preservada (FR-005) |
| `negative` | `negative` | Erro — preservada |
| `red-14` | `red-14` | Erro — preservada |
| `positive` | `positive` | Sucesso — preservada |

---

### AsteroidConfig (extensão)

Extensão da estrutura existente em `asteroid.config.js`.

```javascript
// Estrutura atual
framework: {
  featureToggle: {
    useNotifications: false,
    useDarkMode: false  // NOVO — default: false
  }
}
```

---

## Transições de Estado

### Fluxo de inicialização do tema

```
App Boot
  │
  ├── Ler asteroid.config.js → featureToggle.useDarkMode
  │     │
  │     ├── false → Não inicializar dark mode. Tema = light. FIM.
  │     │
  │     └── true → Continuar inicialização
  │           │
  │           ├── Tentar ler localStorage('qas-theme-preference')
  │           │     │
  │           │     ├── Valor válido ('light' | 'dark') → Usar valor
  │           │     ├── Valor inválido → Fallback 'light'
  │           │     └── localStorage indisponível → Fallback 'light'
  │           │
  │           └── Aplicar tema via $q.dark.set(isDark)
  │
  └── App monta com tema correto (sem FOUT)
```

### Fluxo de toggle pelo usuário

```
Usuário clica toggle no QasAppBar
  │
  ├── useDarkMode.toggle()
  │     │
  │     ├── Inverte $q.dark.isActive
  │     ├── Persiste nova preferência em localStorage
  │     └── UI reage automaticamente (CSS custom properties + .body--dark)
  │
  └── Toda aplicação reflete novo tema instantaneamente
```

---

## Relacionamentos

```
AsteroidConfig.featureToggle.useDarkMode
  │
  └── controla → Boot dark-mode.js
                    │
                    ├── lê → UserThemePreference (localStorage)
                    │
                    └── aplica → $q.dark.set()
                                   │
                                   ├── ativa → .body--dark no <body>
                                   │             │
                                   │             └── redefine → ThemeTokens (CSS custom properties)
                                   │
                                   └── computa → useThemeColor(color)
                                                   │
                                                   └── resolve → DarkColorMap[color]
```
