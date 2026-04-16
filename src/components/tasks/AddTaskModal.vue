<template>
  <div class="fields">
    <div class="fields__item">
      <label for="taskname" :class="['font-semibold w-24', { 'required-text': errors.name }]"
        >Task name</label
      >
      <div class="field">
        <InputText
          v-model="formData.name"
          id="taskname"
          :class="{ invalid: errors.name }"
          autocomplete="off"
        />
        <small v-if="errors.name" class="required-text">Task name is required.</small>
      </div>
    </div>

    <div class="fields__item">
      <label for="performer" :class="['font-semibold w-24', { 'required-text': errors.performer }]"
        >Performer</label
      >
      <div class="field">
        <Dropdown
          v-model="formData.performer"
          :options="performers"
          optionLabel="label"
          optionValue="value"
          placeholder="Select a performers"
          class="flex-auto w-full md:w-56"
          :class="{ invalid: errors.performer }"
          showClear
        />
        <small v-if="errors.performer" class="required-text">Performer is required.</small>
      </div>
    </div>

    <div class="fields__item">
      <label for="status" :class="['font-semibold w-24', { 'required-text': errors.status }]"
        >Status</label
      >
      <div class="field">
        <Dropdown
          v-model="formData.status"
          :options="statuses"
          optionLabel="label"
          optionValue="value"
          placeholder="Select a status"
          class="flex-auto w-full md:w-56"
          :class="{ invalid: errors.status }"
          showClear
        />
        <small v-if="errors.status" class="required-text">Status is required.</small>
      </div>
    </div>

    <div class="fields__item">
      <label for="deadline" class="font-semibold w-24">Deadline</label>
      <InputText v-model="formData.deadline" id="deadline" class="flex-auto" autocomplete="off" />
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
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'

// Types
import type { Performer, FormT } from '@/types/tasks'
import type { Status } from '@/types/table'

// Data
const formData = reactive<FormT>({
  name: '',
  performer: null,
  status: null,
  deadline: '',
})
const performers = ref<Performer[]>([
  { label: 'J. Smith', value: 'J.Smith' },
  { label: 'A. Johnson', value: 'A.Johnson' },
  { label: 'P. Blocks', value: 'P.Blocks' },
  { label: 'U. Usher', value: 'U. Usher' },
])
const statuses = ref<Status[]>([
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Done', value: 'done' },
])

const errors = reactive({
  name: false,
  performer: false,
  status: false,
})

// Emits
const emit = defineEmits<{
  (e: 'create', { ...formData }: FormT): void
  (e: 'close', value: boolean): void
}>()

// Watchers
watch(() => formData.name, () => (errors.name = false))
watch(() => formData.performer, () => (errors.performer = false))
watch(() => formData.status, () => (errors.status = false))

// Methods
function validate() {
  errors.name = !formData.name
  errors.performer = !formData.performer
  errors.status = !formData.status

  return !errors.name && !errors.performer && !errors.status
}

function create() {
  if (!validate()) return

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
