<template>
  <div class="container spaced">
    <qas-box>
      <qas-uploader v-model="model" v-bind="uploaderProps">
        <template #bottom-list="{ context }">
          <qas-input>
            <template #append>
              <qas-btn color="grey-10" icon="sym_r_attach_file" label="Anexar arquivo" @click="context.dispatchUpload" />
            </template>
          </qas-input>
        </template>
      </qas-uploader>

      <qas-debugger :inspect="[model]" />
    </qas-box>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({ name: 'ExUploaderCustom' })

const model = ref([
  'https://placehold.co/600x400/orange/white?text=img1',
  'https://placehold.co/600x400/red/white?text=img2',
  'https://placehold.co/600x400/blue/white?text=img3'
])

const uploaderProps = {
  entity: 'serviceOrders',
  useEmptyResultText: false,
  useHeader: false,
  useDownload: false,
  multiple: true,
  useGalleryCard: false,
  maxFileSize: 20000000
}
</script>
