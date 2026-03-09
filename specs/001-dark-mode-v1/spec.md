# Feature Specification: Dark Mode

**Feature Branch**: `001-dark-mode-v1`
**Created**: 09/03/2026
**Status**: Draft — Pending Clarifications
**Input**: Feature geral para adicionar suporte a modo dark no Asteroid UI.

---

## Context

O Asteroid UI segue uma convenção de cores semânticas. Todas essas cores precisam ter variações dark mode elegantes, com bom contraste e alinhadas à cor primária do projeto.

### `primary`
Utilizada para **ações imediatas e positivas**. Exemplos:
- Botão "Salvar"
- Botão "Baixar imagem"
- Qualquer CTA principal que executa uma ação direta e não-destrutiva

### `grey-10`
Utilizada para **títulos, ações negativas e ações não-imediatas**. Exemplos:
- Botão "Excluir" (ação negativa/destrutiva)
- Botão "Opções" que abre um dropdown (ação não-imediata)
- Ações listadas dentro de um `QasActionsMenu` ou dropdown
- Títulos de seções e textos de destaque

### `grey-8`
Utilizada como **cor de texto padrão** do sistema. É a cor base para corpo de texto em geral.

### `grey-6`
Utilizada para representar **estado inativo ou desativado**. Exemplos:
- Texto de um campo desabilitado
- Label de uma opção não disponível

### `grey-4`
Utilizada exclusivamente para **bordas** de componentes.

### `negative` e `red-14`
Utilizadas para **estados de erro**. Exemplos:
- Mensagem de validação de formulário
- Alerta de falha em uma operação

### `positive`
Utilizada para **estados de sucesso**, porém com uso restrito — não é amplamente aplicada no sistema. Deve ser usada com cautela para não criar inconsistências visuais.

---

## User Stories

### US-001 — Toggle de Tema pelo Usuário (Priority: P1)

**Como** usuário de um sistema que utiliza o Asteroid,
**quero** poder alternar entre modo light e modo dark,
**para** ter uma experiência mais confortável em ambientes com pouca luz.

O toggle deve estar visível no canto superior direito, dentro do componente `QasAppBar`.
Após a escolha, toda a aplicação deve refletir o tema selecionado de forma imediata.

**Por que P1**: Recurso amplamente solicitado por usuários. O modo light em ambientes noturnos gera desconforto visual significativo.

---

### US-002 — Suporte ao Modo Dark para Desenvolvedores (Priority: P2)

**Como** desenvolvedor que utiliza o Asteroid na minha aplicação,
**quero** ter todos os recursos necessários para trabalhar com modo dark,
**para** que minha aplicação suporte o tema sem gambiarras ou workarounds.

---

## Requirements

### Functional Requirements

**FR-001**: O componente `QasAppBar` deve exibir um toggle no canto superior direito para alternar entre modo light e dark.

**FR-002**: A preferência de tema escolhida pelo usuário deve persistir via `localStorage` e ser restaurada ao recarregar a aplicação.

**FR-003**: O tema padrão do sistema deve ser `light`, sem dependência da preferência do sistema operacional.

**FR-004**: O `QasAppBar` deve aceitar uma prop (ex: `use-dark-mode`) para que o desenvolvedor habilite ou desabilite o toggle de tema. Quando desabilitado, o toggle não é renderizado, caso precise configura apenas em um componente, verifica pergunta **OQ-004**.

**FR-005**: As cores `primary` e `secondary` devem ser preservadas no modo dark sem alteração.

**FR-006**: As variações de cores do modo dark devem ser definidas no arquivo `ui/src/index.scss`, utilizando CSS custom properties (variáveis).

**FR-007**: As cores do modo dark devem ter bom contraste, ser elegantes visualmente e fazer sentido em relação à cor primária do projeto.

**FR-008**: Utilizar os recursos nativos do Quasar para dark mode (`$q.dark`) como base da implementação.

**FR-009**: Todos os componentes em `ui/src/components` devem ser auditados e adaptados se necessário para suportar o modo dark corretamente.

**FR-010**: A documentação em `/docs` deve ser atualizada para suportar e demonstrar o modo dark.

**FR-011**: O `CHANGELOG.md` deve ser atualizado com todas as mudanças em `ui/` e `app-extension` (se houver alterações).

**FR-012**: O modo light não pode ter nenhuma alteração visual em relação ao comportamento atual.

---

### Non-Functional Requirements

**NFR-001**: A troca de tema deve ser instantânea, sem reload de página e sem flash visual (FOUT).

**NFR-002**: O sistema de dark mode não deve aumentar o bundle size de forma significativa.

---

## Key Entities

**UserThemePreference**: Representa a escolha de tema do usuário.
Atributos: tema selecionado (`light` | `dark`), data da última alteração.
Armazenamento: `localStorage` no cliente, sem persistência em servidor.

**ThemeToken**: Representa um token de cor do design system.
Atributos: nome da variável CSS, valor no modo light, valor no modo dark.
Relacionamento: Definidos centralmente em `ui/src/index.scss` e consumidos por todos os componentes.

---

## Edge Cases

**EC-001**: `localStorage` bloqueado (modo privado, iOS Safari restrito)
→ Sistema aplica o tema `light` como fallback silencioso, sem exibir erro.

**EC-002**: Primeiro acesso sem preferência salva
→ Sistema aplica `light` como padrão (conforme FR-003).

**EC-003**: Valor inválido ou corrompido no `localStorage`
→ Sistema ignora o valor e aplica `light` como fallback.

**EC-004**: Toggle renderizado antes do `$q.dark` do Quasar estar inicializado
→ Botão renderiza em estado neutro e sincroniza após a inicialização do Quasar.

**EC-005**: Desenvolvedor não passa a prop `use-dark-mode` no `QasAppBar`
→ Toggle não é exibido e o sistema permanece em modo `light`.

**EC-006**: Componente usa classe utilitária estática como `text-grey-10` no template
→ Ver seção Open Questions — OQ-001.

---

## Success Criteria

| ID | Critério | Como medir |
|---|---|---|
| SC-001 | Usuário alterna entre light e dark com 1 clique | Teste manual no `QasAppBar` |
| SC-002 | Preferência persiste após fechar e reabrir o navegador | Verificar `localStorage` após reload |
| SC-003 | Todos os componentes auditados respondem corretamente ao tema | Review + testes visuais em cada componente |
| SC-004 | Modo light sem nenhuma regressão visual | Comparação visual antes/depois |
| SC-005 | Desenvolvedor consegue habilitar/desabilitar o toggle via prop | Teste de integração no `QasAppBar` |
| SC-006 | Documentação clara e completa em `/docs` | Review da documentação gerada |

---

## Open Questions

Estas questões precisam ser respondidas antes da implementação começar.

**OQ-001**: Como tratar componentes que recebem cores via props estáticas (ex: `color="grey-10"`, `status="negative"`)?
- **Opção A**: Adicionar props paralelas como `color-dark` e `status-dark` para o desenvolvedor passar a cor no modo dark.
- **Opção B**: O componente resolve automaticamente com um mapeamento interno de cores light → dark.
- **Opção C**: Manter responsabilidade no consumidor — ele passa a cor correta via lógica própria.
- **Decisão necessária**: Definir qual abordagem adotar antes de iniciar FR-009.

**OQ-002**: Classes utilitárias estáticas como `text-grey-10` no template não são afetadas pelo `$q.dark`. O desenvolvedor precisará fazer controle manual nesses casos?
- Se sim, como documentar essa limitação e recomendar a abordagem correta?
- Considerar criar classes utilitárias responsivas ao tema (ex: `text-title` em vez de `text-grey-10`).

**OQ-003**: A `app-extension` terá mudanças além das já previstas em `ui/`? Quais?

**OQ-004**: No **FR-004** é dito que precisa ser feito com a prop `use-dark-mode`, isto funciona bem se precisar adicionar a prop só neste componente, porém se eu precisar usar ela em vários outros componentes, considere utilizar via configuração do arquivo `asteroid.config.js`, dentro da chave `featureToggle`, uma ve que esse arquivo defini configurações globais, e seria uma config estática.

---
