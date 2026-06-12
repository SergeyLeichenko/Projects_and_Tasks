<template>
  <div class="fields">
    <div class="fields__item">
      <label for="projectname" class="font-semibold w-24">Назва проекту</label>
      <div class="field">
        <InputText
          v-model.trim="formData.name"
          id="projectname"
          :class="['flex-auto', { error: v$.name.$error }]"
          autocomplete="off"
          @blur="v$.name.$touch()"
        />
        <div v-for="error in v$.name.$errors" :key="error.$uid" class="input-errors">
          <div class="error-msg">
            {{ error.$message }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="project" class="fields__item">
      <label for="status" class="font-semibold w-24">Статус</label>
      <div class="field">
        <Dropdown
          v-model="formData.status"
          :options="statuses"
          optionLabel="label"
          optionValue="value"
          placeholder="Виберіть статус"
          class="flex-auto w-full md:w-56"
          showClear
        />
      </div>
    </div>

    <div class="fields__item">
      <label for="desc" class="font-semibold w-24">Опис проекту</label>
      <Textarea v-model="formData.description" autoResize rows="5" cols="30" />
    </div>
  </div>

  <div class="buttons flex justify-end gap-2">
    <Button type="button" label="Cancel" severity="secondary" @click="close" />
    <Button type="button" label="Save" @click="create" />
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'

import useVuelidate from '@vuelidate/core'
import { required, helpers, minLength, maxLength } from '@vuelidate/validators'

// Types
import type { CreateProject, Project } from '@/types/projects'
import type { Status } from '@/types/table'

// Props
const props = defineProps<{
  project?: Project | null
}>()

// Data
const formData = reactive<CreateProject>({
  name: '',
  status: null,
  description: '',
})
const statuses = reactive<Status[]>([
  { label: 'Active', value: 'active' },
  { label: 'Archived', value: 'archived' },
])
// Validation rules
const rules = {
  name: {
    required: helpers.withMessage('Назва проекту є обов’язковою', required),
    minLength: helpers.withMessage(
      'Назва проекту повинна містити щонайменше 2 символи',
      minLength(2),
    ),
    maxLength: helpers.withMessage(
      'Назва проекту не може перевищувати 100 символів',
      maxLength(100),
    ),
  },
}

const v$ = useVuelidate(rules, formData)

// Emits
const emit = defineEmits<{
  (e: 'create', data: { name: string; description: string }): void
  (e: 'close', value: boolean): void
}>()

//Watch
watch(
  () => props.project,
  (project) => {
    if (project) {
      Object.assign(formData, project)
    } else {
      Object.assign(formData, {
        name: '',
        description: '',
      })
    }
  },
  { immediate: true },
)

// Methods
async function create() {
  const isValid = await v$.value.$validate()

  if (!isValid) {
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
  }
}

.buttons {
  margin-top: 20px;
  gap: 12px;
  display: flex;
  justify-content: end;
}

.error {
  border: 1px solid red;
}

.error-msg {
  color: red;
  font-size: 12px;
  margin-top: 4px;
}
</style>
