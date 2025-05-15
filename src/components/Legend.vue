<script setup lang="ts">
import { useAppStore } from '../store/app.store'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

const store = useAppStore()
const { legend } = storeToRefs(store)

const steps = computed(() => {
  const tmp = []
  let ii = 0
  for (let i = 0; i < legend.value.length; i += 2) {
    tmp[ii++] = {
      value: Math.floor(legend.value[i] as number),
      color: legend.value[i + 1] as string,
    }
  }
  return tmp
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="capitalize">count</div>
    <div class="flex flex-col">
      <div v-for="step in steps" :key="step.value" class="flex items-center gap-2">
        <span :style="{ backgroundColor: step.color }" class="h-4 w-4"></span>
        <span>> {{ step.value }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
