<template>
  <div class="card">
    <h3>{{ element.name }}</h3>
    <p class="text"><strong>Performer:</strong> {{ element.performer }}</p>
    <p class="text">
      <strong>Status:</strong>
      <span class="status" :style="{color: getSeverity(element.status), fontWeight: 600}">{{ element.status }}</span>
    </p>

    <p class="text"><strong>Deadline: </strong>{{ element.deadline }}</p>
  </div>
</template>

<script setup lang="ts">
// Props
const props = defineProps({
  element: {
    type: Object,
    default: () => {},
  },
})

// Methods
const getSeverity = (status: string) => {
  switch (status) {
    case 'done':
      return 'green'
    case 'in_progress':
      return 'red'
    case 'todo':
      return 'gray'
    default:
      return undefined
  }
}
</script>

<style scoped lang="scss">
.card {
  padding: 20px;
  background: white;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: grab;
  .text {
    margin-top: 15px;
    font-size: 16px;
  }
  .status {
    margin-left: 10px;
  }
}
</style>
