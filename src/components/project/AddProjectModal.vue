<template>
  <div class="fields">
    <div class="fields__item">
      <label for="projectname" :class="['font-semibold w-24', { 'required-text': required }]"
        >Project name</label
      >
      <div class="field">
        <InputText
          v-model="formData.name"
          id="projectname"
          :class="['flex-auto', { invalid: required }]"
          autocomplete="off"
        />
        <small v-if="required" class="required-text">Project name is required.</small>
      </div>
    </div>

    <div class="fields__item">
      <label for="desc" class="font-semibold w-24">Descriptions</label>
      <Textarea v-model="formData.description" autoResize rows="5" cols="30" />
    </div>
  </div>

  <div class="buttons flex justify-end gap-2">
    <Button type="button" label="Cancel" severity="secondary" @click="close" />
    <Button type="button" label="Save" @click="create" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

// Data
const formData = reactive({
  name: '',
  description: '',
})
const required = ref<boolean>(false)

// Emits
const emit = defineEmits<{
  (e: 'create', data: { name: string; description: string }): void
  (e: 'close', value: boolean): void
}>()

// Watcher
watch(formData, (val) => {
  if(val.name !== '') {
    required.value = false
  }
})

// Methods
function create() {
  if (!formData.name) {
    required.value = true
    return
  }
  emit('create', { ...formData })
}

function close() {
  emit('close', false)
}
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
    .field {
      width: 100%;
      display: flex;
      flex-direction: column;
    }
    .required-text {
      color: red;
    }
    .invalid {
      border: 1px solid red;
    }
  }
}

.buttons {
  margin-top: 20px;
  gap: 12px;
  display: flex;
  justify-content: end;
}
</style>
