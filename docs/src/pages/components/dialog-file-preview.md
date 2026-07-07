---
title: QasDialogFilePreview
---

Componente de dialog para pré-visualização de arquivos. Suporta imagens e PDFs.

<doc-api file="dialog-file-preview/QasDialogFilePreview" name="QasDialogFilePreview" />

:::info
##### Dependências
Este componente utiliza [`@panzoom/panzoom`](https://github.com/timmywil/panzoom) e [`pdfjs-dist`](https://github.com/mozilla/pdf.js).
:::

:::info
##### Detecção automática do tipo de arquivo
O componente detecta o tipo pelo final da URL:

- **Imagem** → qualquer URL que não termine em `.pdf`
- **PDF** → URL terminando em `.pdf` ou forçando com a prop `fileType="pdf"`
:::

## Uso

<doc-example file="QasDialogFilePreview/Basic" title="Visualizar imagem" />
<doc-example file="QasDialogFilePreview/WithPdf" title="Visualizar PDF" />