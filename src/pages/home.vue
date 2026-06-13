<template>
  <div class="card">
    <Chart
      type="pie"
      :data="chartData"
      :options="chartOptions"
      class="diagram w-full md:w-[30rem]"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Chart from 'primevue/chart'
import { useTasksStore } from '@/stores/tasks'
import { storeToRefs } from 'pinia'

const { tasks } = storeToRefs(useTasksStore())
const { allTasks } = useTasksStore()

const chartData = ref()
const chartOptions = ref()

//Methods
const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement)

  return {
    labels: tasksByStatus.value.map((item) => item.name),
    datasets: [
      {
        data: tasksByStatus.value.map((item) => item.value),
        backgroundColor: [
          documentStyle.getPropertyValue('--blue-500'),
          documentStyle.getPropertyValue('--yellow-500'),
          documentStyle.getPropertyValue('--green-500'),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue('--blue-400'),
          documentStyle.getPropertyValue('--yellow-400'),
          documentStyle.getPropertyValue('--green-400'),
        ],
      },
    ],
  }
}

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--gray-800')

  return {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor,
        },
      },
    },
  }
}

// Computed
const tasksByStatus = computed(() => {
  const statuses = {
    todo: 0,
    in_progress: 0,
    review: 0,
    done: 0,
  }

  tasks.value.forEach((task) => {
    if (task.status && task.status in statuses) {
      statuses[task.status as keyof typeof statuses]++
    }
  })

  return [
    { name: 'To Do', value: statuses.todo },
    { name: 'In Progress', value: statuses['in_progress'] },
    { name: 'Done', value: statuses.done },
  ]
})

// lifecicle hooks
onMounted(async () => {
  await allTasks()

  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})
</script>

<style scoped lang="scss">
.card {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  .p-chart.diagram {
    max-width: 600px;
    width: 100%;
    height: 600px;
  }
}
</style>
