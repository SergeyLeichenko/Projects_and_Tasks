<template>
  <div class="card">
    <Menubar :model="items">
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span class="label">{{ item.label }}</span>
          </a>
        </router-link>
      </template>

      <template #end>
        <div class="block-right">
          <InputText placeholder="Пошук" type="text" class="w-32 sm:w-auto" />
          <Avatar
            image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
            shape="circle"
          />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup lang="ts">
import Menubar from 'primevue/menubar'
import InputText from 'primevue/inputtext'
import Avatar from 'primevue/avatar'

import { ref } from 'vue'

type MenuItem = {
  label: string
  icon: string
  route?: string
}

const items = ref<MenuItem[]>([
  {
    label: 'Головна',
    icon: 'pi pi-home',
    route: '/',
  },
  {
    label: 'Проекти',
    icon: 'pi pi-search',
    route: '/projects',
  },
])
</script>

<style scoped>
.block-right {
  display: flex;
  gap: 10px;
  align-items: center;
}

.label {
  margin-left: 5px;
}
</style>
