<template>
  <div class="fields">
    <div class="fields__item">
      <label for="taskname" class="font-semibold w-24">Назва завдання</label>
      <div class="field">
        <InputText
          v-model.trim="formData.name"
          id="taskname"
          :class="{ error: v$.name.$error }"
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

    <div class="fields__item">
      <label for="projectname" class="font-semibold w-24">Назва проекту</label>
      <div class="field">
        <Dropdown
          v-model="formData.projectName"
          :options="projectsList"
          optionLabel="label"
          optionValue="value"
          placeholder="Виберіть проект"
          class="flex-auto w-full md:w-56"
          :class="{ error: v$.projectName.$error }"
          showClear
        />
        <div v-for="error in v$.projectName.$errors" :key="error.$uid" class="input-errors">
          <div class="error-msg">
            {{ error.$message }}
          </div>
        </div>
      </div>
    </div>

    <div class="fields__item">
      <label for="performer" class="font-semibold w-24">Виконавець</label>
      <div class="field">
        <Dropdown
          v-model="formData.performer"
          :options="performers"
          optionLabel="label"
          optionValue="value"
          placeholder="Select a performers"
          class="flex-auto w-full md:w-56"
          showClear
        />
      </div>
    </div>

    <div class="fields__item">
      <label for="status" class="font-semibold w-24">Статус</label>
      <div class="field">
        <Dropdown
          v-model="formData.status"
          :options="statuses"
          optionLabel="label"
          optionValue="value"
          placeholder="Виберіть статус"
          class="flex-auto w-full md:w-56"
          :class="{ error: v$.status.$error }"
          showClear
          @blur="v$.status.$touch()"
        />
        <div v-for="error in v$.status.$errors" :key="error.$uid" class="input-errors">
          <div class="error-msg">
            {{ error.$message }}
          </div>
        </div>
      </div>
    </div>

    <div class="fields__item">
      <label for="deadline" class="font-semibold w-24">Термін виконання</label>

      <div class="field">
        <InputText
          v-model="formData.deadline"
          type="date"
          id="deadline"
          class="flex-auto"
          :class="{ error: v$.deadline.$error }"
          @change="v$.deadline.$touch()"
        />
        <div v-for="error in v$.deadline.$errors" :key="error.$uid" class="input-errors">
          <div class="error-msg">{{ error.$message }}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="buttons flex justify-end gap-2">
    <Button type="button" label="Відмінити" severity="secondary" @click="close" />
    <Button type="button" label="Зберегти" @click="create" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'

import useVuelidate from '@vuelidate/core'
import { required, helpers, minLength, maxLength } from '@vuelidate/validators'

import { useProjectsStore } from '@/stores/projects'
import { storeToRefs } from 'pinia'

// Types
import type { Performer, FormT, Task } from '@/types/tasks'
import type { Status } from '@/types/table'

const { fetchProjects } = useProjectsStore()
const { projects } = storeToRefs(useProjectsStore())

// Props
const props = defineProps<{
  task?: Task | null
}>()

// Data
const formData = reactive<FormT>({
  name: '',
  projectName: null,
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

// Validation rules
const notFutureDate = helpers.withMessage(
  'Дата виконання не може бути більшою за поточну дату',
  (value: string) => {
    if (!value) return true

    const selectedDate = new Date(`${value}T00:00:00`)
    const today = new Date()

    today.setHours(0, 0, 0, 0)

    return selectedDate <= today
  },
)

const rules = {
  name: {
    required: helpers.withMessage('Назва завдання є обов’язковою', required),
    minLength: helpers.withMessage(
      'Назва завдання повинна містити щонайменше 3 символи',
      minLength(3),
    ),
    maxLength: helpers.withMessage(
      'Назва завдання не може перевищувати 120 символів',
      maxLength(120),
    ),
  },
  projectName: {
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
  status: {
    required: helpers.withMessage('Поле статус є обов’язковим', required),
  },
  deadline: {
    notFutureDate,
  },
}

const v$ = useVuelidate(rules, formData)

// Emits
const emit = defineEmits<{
  (e: 'create', { ...formData }: FormT): void
  (e: 'close', value: boolean): void
}>()

//Watch
watch(
  () => props.task,
  (task) => {
    if (task) {
      const project = projects.value.find((p) => p.id === task.projectId)

      Object.assign(formData, { ...task, projectName: project })
    } else {
      Object.assign(formData, {
        name: '',
        projectName: null,
        status: null,
        deadline: '',
      })
    }
  },
  { immediate: true },
)

// Computed
const projectsList = computed(() => {
  return projects.value.map((project) => ({
    label: project.name,
    value: project,
  }))
})

// Methods
async function create() {
  const isValid = await v$.value.$validate()

  if (!isValid) {
    return
  }

  emit('create', {
    ...formData,
  })
}

function close() {
  emit('close', false)
}

// lificicle hooks
onMounted(async () => {
  if (!projects.value?.length) await fetchProjects()
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
