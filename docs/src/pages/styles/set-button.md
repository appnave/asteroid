---
title: set-button
---

Em alguns casos, alguns componentes do quasar internamente podem já vir com o `QBtn` não sendo possível alterar para o nosso `QasBtn`, como no `QPagination` que cada pagina é um `<q-btn />`, nestes casos, precisamos forçar ele a ter o estilo do nosso button, então forçamos isto com este mixin, lembrando que este mixin é para ser aplicado em classes junto ao `.q-btn`, somente ele não é suficiente.


:::warning
Caso ocorra algum erro ao encontrar este mixin, use uma variável scss comentada no style `"// $"`, por exemplo:

```html
<style lang="scss">
// $

@include set-button(
  $variant,
  $icon-only: false,
  $no-hover-on-white: false,
  $color: false,
  $ellipsis: false,
  $size: lg
)
</style>
```

Isto é um problema do quasar que só consegue identificar quando existe alguma scss var declarada no arquivo, para saber mais clique <a target="_blank" href="https://quasar.dev/style/sass-scss-variables#caveat">aqui</a>.
:::

#### Definição
```scss
@mixin set-button($variant, $icon-only: false, $no-hover-on-white: false, $color: false) {
  @extend .qas-btn;
  @extend .qas-btn--#{$variant};

  @if $variant == tertiary and $color {
    @extend .qas-btn--tertiary-#{$color};
  }

  @if $icon-only {
    @extend .qas-btn--#{$variant}-icon-only;
  }

  @if $no-hover-on-white {
    @extend .qas-btn--no-hover-on-white;
  }
}

```

#### Uso
```scss
@include set-button(
  primary,
  false,
  false
); // aplica botão primary sem ser somente ícone

@include set-button(
  primary,
  true,
  false
); // aplica botão primary somente ícone

@include set-button(
  secondary,
  true,
  false
); // aplica botão secondary somente ícone

@include set-button(
  tertiary,
  true,
  true
); // aplica botão tercenário somente ícone e sem cor de hover
```
