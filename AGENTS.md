# Asteroid — AGENTS.md

## Visão Geral

## Dev environment
- No prompt responda sempre em pt-br.
- Caso exista algum conflito de skills/rules no arquivo `.agents/` considere sempre as skills/rules do `asteroid` como prioridade e sobrescreva as demais.
- Use sempre javascript ao invés de TS.
- Use sempre scss ao invés de css.

## Decisões de design

### Options API vs Composition API
- Novos componentes devem usar **Composition API** com `<script setup>`.

### Auto-import de componentes
- Dentro do `ui/`, imports são sempre explícitos.

### Idioma
- **Código:** Inglês.
- **Documentação (YML, Markdown, CHANGELOG):** Português brasileiro (pt-BR).
