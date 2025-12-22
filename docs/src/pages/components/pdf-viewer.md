---
title: QasPdfViewer
---

Componente para exibir um PDF diretamente no navegador, renderizando todas as páginas do documento.

<doc-api file="pdf-viewer/QasPdfViewer" name="QasPdfViewer" />

:::info
O componente utiliza a biblioteca `pdfjs-dist` para renderizar PDFs diretamente no canvas HTML. Ele carrega automaticamente todas as páginas do documento e as exibe sequencialmente.
:::

:::warning
O componente requer que a URL do PDF seja acessível via CORS ou esteja no mesmo domínio da aplicação para funcionar corretamente.
:::

## Uso

<doc-example file="QasPdfViewer/Basic" title="Básico" />

<doc-example file="QasPdfViewer/WithError" title="PDF inválido" />