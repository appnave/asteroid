# Contracts — Dark Mode v1

## 1. Composable: `useDarkMode`

**Arquivo**: `ui/src/composables/use-dark-mode.js`
**Export**: Named export em `ui/src/composables/index.js`

### Interface

```javascript
/**
 * Composable para gerenciamento do dark mode no Asteroid.
 *
 * @returns {Object}
 * @property {import('vue').Ref<boolean>} isDark - Estado reativo do dark mode
 * @property {Function} toggle - Alterna entre light e dark
 * @property {Function} setTheme - Define tema explicitamente ('light' | 'dark')
 */
export function useDarkMode () {
  return {
    isDark,     // Ref<boolean> — true quando dark mode ativo
    toggle,     // () => void — alterna o tema
    setTheme    // (theme: 'light' | 'dark') => void — define tema
  }
}
```

### Comportamento
- `isDark`: Sincronizado com `$q.dark.isActive`.
- `toggle()`: Inverte estado, persiste em localStorage, atualiza `$q.dark`.
- `setTheme('dark')`: Aplica tema específico, persiste, atualiza `$q.dark`.
- localStorage key: `qas-theme-preference`.
- Fallback: `light` sempre que localStorage indisponível ou valor inválido.

---

## 2. Composable: `useThemeColor`

**Arquivo**: `ui/src/composables/use-theme-color.js`
**Export**: Named export em `ui/src/composables/index.js`

### Interface

```javascript
/**
 * Resolve a cor para o tema atual baseado no mapa de cores dark.
 *
 * @param {import('vue').Ref<string>|string} color - Cor no formato Quasar (ex: 'grey-10')
 * @returns {import('vue').ComputedRef<string>} - Cor resolvida para o tema atual
 */
export function useThemeColor (color) {
  return computedColor // ComputedRef<string>
}
```

### Comportamento
- Recebe uma cor (string ou Ref).
- Quando `$q.dark.isActive === false`: retorna a cor original.
- Quando `$q.dark.isActive === true`: retorna a cor mapeada do `DARK_COLOR_MAP`.
- Se a cor não está no mapa: retorna a cor original (sem modificação).

---

## 3. Enum: `DarkColorMap`

**Arquivo**: `ui/src/enums/DarkColorMap.js`

### Interface

```javascript
export default Object.freeze({
  'grey-10': 'grey-2',
  'grey-8': 'grey-4',
  'grey-6': 'grey-5',
  'grey-4': 'grey-7',
  'grey-3': 'grey-8',
  'grey-2': 'grey-9',
  'white': 'dark'
})
```

---

## 4. Boot File: `dark-mode.js`

**Arquivo**: `app-extension/src/boot/dark-mode.js`
**Registro**: Em `app-extension/src/index.js` na lista de boots.

### Interface

```javascript
/**
 * Boot file que inicializa dark mode baseado na preferência salva.
 * Executa antes do app montar para evitar FOUT.
 */
export default ({ app }) => {
  // 1. Ler config: featureToggle.useDarkMode
  // 2. Se false → return (não inicializar)
  // 3. Ler localStorage('qas-theme-preference')
  // 4. Validar valor
  // 5. Aplicar via $q.dark.set()
}
```

---

## 5. Prop: `QasAppBar.useDarkMode`

**Arquivo**: `ui/src/components/app-bar/QasAppBar.vue`
**Documentação**: `ui/src/components/app-bar/QasAppBar.yml`

### Interface

```yaml
# Adição ao QasAppBar.yml
props:
  use-dark-mode:
    type: Boolean
    default: undefined
    description: >
      Controla a exibição do toggle de dark mode no AppBar.
      Quando `true`, exibe o toggle.
      Quando `false`, oculta o toggle.
      Quando `undefined` (default), segue a configuração global
      de `asteroid.config.js → framework.featureToggle.useDarkMode`.
```

### Comportamento
- `undefined` (default) → lê `featureToggle.useDarkMode` da config global.
- `true` → exibe toggle independente da config global.
- `false` → oculta toggle independente da config global.
- O toggle usa internamente `useDarkMode().toggle()`.

---

## 6. CSS Custom Properties — Contrato

**Arquivo**: `ui/src/index.scss`

### Variáveis novas (adicionadas ao `:root` e `.body--dark`)

| Variável | Light | Dark | Uso |
|---|---|---|---|
| `--qas-text-primary` | `#{$grey-10}` | `#{$grey-2}` | Títulos e textos de destaque |
| `--qas-text-secondary` | `#{$grey-8}` | `#{$grey-4}` | Texto padrão do corpo |
| `--qas-text-disabled` | `#{$grey-6}` | `#{$grey-5}` | Texto inativo |
| `--qas-surface-color` | `#FFFFFF` | `#1D1D1D` | Background de superfícies |
| `--qas-surface-variant` | `#{$grey-2}` | `#{$grey-9}` | Background secundário |
| `--qas-background-color` | `rgba(15, 83, 175, 0.03)` | `#121212` | Background global (já existente, redefinida) |
| `--qas-border-grey` | `#{$grey-4}` | `#{$grey-7}` | Bordas (já existente, redefinida) |

### Overrides de classes Quasar em `.body--dark`

| Classe | Light original | Dark override |
|---|---|---|
| `.text-grey-10` | `$grey-10` | `$grey-2` |
| `.text-grey-8` | `$grey-8` | `$grey-4` |
| `.text-grey-6` | `$grey-6` | `$grey-5` |
| `.bg-white` | `#FFFFFF` | `#1D1D1D` |
| `.bg-grey-2` | `$grey-2` | `$grey-9` |
| `.bg-grey-3` | `$grey-3` | `$grey-8` |
| `.bg-grey-4` | `$grey-4` | `$grey-7` |

---

## 7. Config Global — Contrato

**Arquivo**: `app-extension/src/defaults/default-asteroid-config.js`

### Extensão

```javascript
framework: {
  featureToggle: {
    useNotifications: false,
    useDarkMode: false          // NOVO
  }
}
```

### Acesso no runtime
Via `inject('asteroidConfig')` ou helper existente `getAsteroidConfig()`.
