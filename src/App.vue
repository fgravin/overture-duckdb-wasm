<script setup lang="ts">
import Header from '@/components/Header.vue'
import Map from '@/components/Map.vue'
import QueryForm from '@/components/QueryForm.vue'
import Legend from '@/components/Legend.vue'
import { useAppStore } from '@/store/app.store.ts'
import { storeToRefs } from 'pinia'

const store = useAppStore()
const { legend } = storeToRefs(store)
</script>

<template>
  <div class="flex h-screen flex-col">
    <header>
      <Header />
    </header>
    <div class="flex grow flex-col md:flex-row">
      <aside class="md:w-120">
        <QueryForm></QueryForm>
      </aside>
      <main class="relative grow">
        <div
          v-if="legend?.length > 0"
          class="absolute bottom-10 left-10 z-10 bg-white/60 p-6 backdrop-blur-sm"
        >
          <Legend></Legend>
        </div>
        <Map></Map>
      </main>
    </div>
  </div>
</template>
