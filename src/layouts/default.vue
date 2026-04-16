<script setup lang="ts">
import Header from '@/components/base/Header.vue'
</script>

<template>
  <div class="container">
    <Header />

    <main class="content">
      <slot/>
    </main>
  </div>
</template>

<style scoped lang="scss">
.container {
  padding: 0 20px;
}
</style>