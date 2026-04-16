<template>
  <div class="card flex justify-center">
    <Dialog v-model:visible="visibleProxy" modal :header="title" :style="{ width: '30rem' }">

      <slot />

    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Dialog from 'primevue/dialog'

// Props
const props = withDefaults(
  defineProps<{
    visible: boolean
    title: string
  }>(),
  {
    visible: false,
    title: ''
  },
)

// Emits
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

// Computed
const visibleProxy = computed({
  get: () => props.visible,
  set: (val: boolean) => emit('update:visible', val),
})
</script>

<style scoped lang="scss">
.fields {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__item {
    display: grid;
    grid-template-columns: 110px 1fr;
    align-items: center;
    gap: 12px;
  }
}
</style>
