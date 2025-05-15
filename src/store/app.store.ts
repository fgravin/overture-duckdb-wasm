import { type Ref, ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const query: Ref<string> = ref('')
  const queryLoading: Ref<boolean> = ref(false)
  const queryError: Ref<boolean> = ref(false)
  const legend: Ref<(string | number)[]> = ref([])

  function setLegend(value: (string | number)[]) {
    legend.value = value
  }
  function setQuery(value: string) {
    query.value = value
  }
  function setQueryLoading(value: boolean) {
    queryLoading.value = value
  }
  function setQueryError(value: boolean) {
    queryError.value = value
  }
  return {
    legend,
    setLegend,
    query,
    setQuery,
    queryLoading,
    setQueryLoading,
    queryError,
    setQueryError,
  }
})
