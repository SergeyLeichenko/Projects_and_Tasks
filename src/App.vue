<script setup lang="ts">
import Default from './layouts/default.vue'
import Toast from 'primevue/toast'
</script>

<template>
  <div class="main">
    <Default>
      <Toast />
      
      <router-view />
    </Default>
  </div>
</template>

<style scoped></style>
