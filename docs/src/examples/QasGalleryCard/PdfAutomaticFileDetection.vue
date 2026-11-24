<template>
  <div class="container spaced">
    <div class="q-col-gutter-md row">
      <div class="col-4">
        <qas-gallery-card v-bind="galleryCardProps" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'PdfAutomaticFileDetection' })

const galleryCardProps = {
  useHeaderErrorMode: false,
  url: 'https://dhaw-crmap01-assets.s3.amazonaws.com/uploads/customers/import/upload/43e8aaef-6237-4e51-9cfd-f6b2c923f152.pdf' // detecção automática do fileType pela URL
}
</script>
