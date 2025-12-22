<template>
  <div class="container spaced">
    <div class="row">
      <div class="col-4">
        <qas-gallery-card v-bind="galleryCardProps">
          <template #image-error-container>
            <div class="bg-negative flex full-height full-width items-center justify-center text-center">
              <div>
                conteúdo
              </div>
            </div>
          </template>
        </qas-gallery-card>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'ErrorSlot' })

const galleryCardProps = {
  useHeaderErrorMode: false,
  url: 'https://placehold1.co/600x400/orange/white?text=img1'
}
</script>
