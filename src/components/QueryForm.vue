<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppStore } from '@/store/app.store.ts'
import { storeToRefs } from 'pinia'
import HeroiconsCog6Tooth20Solid from '@/components/icons/CogIcon.vue'
import { h3DistributionQuery, spatialAggregationQuery } from '@/services/queries.ts'

const store = useAppStore()
const { queryLoading, query, queryError } = storeToRefs(store)

const parquetSource =
  import.meta.env.MODE === 'production'
    ? 'https://fgravin.github.io/overture-duckdb-wasm'
    : 'http://localhost:5173'

const queryRef = ref(spatialAggregationQuery)
function transformQuery(query: string): string {
  return query
    .replace('\n', '')
    .replace(
      'FROM places',
      `FROM read_parquet('${parquetSource}/saltlake-place.parquet', filename=true, hive_partitioning=1)`,
    )
    .replace(
      'FROM divisions',
      `FROM read_parquet('${parquetSource}/saltlake-division_area.parquet', filename=true, hive_partitioning=1)`,
    )
}
function onSubmitClick() {
  store.setQueryLoading(true)
  store.setQueryError(false)

  const query = transformQuery(queryRef.value)
  store.setQuery(query)
}

const isDisabled = computed(() => {
  return !queryRef.value || transformQuery(queryRef.value) === query.value || queryLoading.value
})
</script>

<template>
  <div class="flex flex-col gap-4 p-6 text-sm">
    <div class="">
      <h1 class="text-xl font-bold text-stone-600">Welcome to Overture WASM demo !</h1>
    </div>
    <div class="hidden flex-col gap-1 rounded bg-green-100 p-4 md:flex">
      <div class="mb-3">
        💡 You can enter a SQL query to directly interact with Overture Maps datasets.
      </div>
      <div>
        <ul class="list-disc">
          <li class="mb-2 ml-4">
            For this demo though, only <span class="font-bold">places</span> and
            <span class="font-bold">division areas</span> datasets are available, and only on
            <span class="font-bold">Salt Lake county extent</span>.
          </li>
          <li class="mb-2 ml-4">
            The layer styling expects the request to return admin boundaries, with an attribute
            named
            <span class="italic">`count`</span>. It then creates a
            <span class="font-bold">choropleth map</span> out of it.
          </li>
          <li class="mb-2 ml-4">
            As an example, you can change <span class="italic">`locality`</span> to
            <span class="italic">`county`</span> or <span class="italic">`hotel`</span> to
            <span class="italic">`school`</span>.
          </li>
        </ul>
      </div>
    </div>
    <div v-if="queryError" class="flex flex-col gap-1 rounded bg-red-100 p-4">
      ❌ An error occurred while executing the query. Please check the syntax.
    </div>

    <select
      class="rounded p-2 text-sm outline-1 outline-offset-1 outline-gray-400 focus:outline-2 focus:outline-stone-500"
      v-model="queryRef"
    >
      <option :value="spatialAggregationQuery">Spatial Aggregation</option>
      <option :value="h3DistributionQuery">H3 Distribution</option>
    </select>

    <textarea
      rows="16"
      class="rounded p-3 text-sm outline-1 outline-offset-1 outline-gray-400 focus:outline-2 focus:outline-stone-500"
      v-model="queryRef"
    />
    <button
      class="rounded px-4 py-2 text-white"
      :class="isDisabled ? 'bg-stone-500/30' : 'cursor-pointer bg-stone-400 hover:bg-stone-300'"
      :disabled="isDisabled"
      @click="onSubmitClick"
      type="button"
    >
      <div class="flex items-center justify-center" v-if="queryLoading">
        <HeroiconsCog6Tooth20Solid class="h-6 w-6 animate-spin"></HeroiconsCog6Tooth20Solid>
      </div>
      <template v-else><span class="font-bold uppercase"> Submit</span> </template>
    </button>
  </div>
</template>

<style scoped></style>
