<script setup lang="ts"></script>

<template>
  <nav class="flex h-16 bg-stone-200 px-6 py-3">
    <div class="flex grow md:w-96">
      <div class="flex gap-6">
        <a href="https://camptocamp.com/" class="-m-1.5 flex p-1.5">
          <span class="sr-only">Camptocamp Geospatial</span>
          <img class="" src="../assets/camptocamp.png" alt="Camptocamp" title="Camptocamp" />
        </a>
        <a href="https://overturemaps.org/" class="-m-1.5 flex p-1.5">
          <span class="sr-only">Overture Maps Foundation</span>
          <img
            class=""
            src="../assets/overture.png"
            alt="Overture Maps"
            title="Overture Maps Foundation"
          />
        </a>
      </div>
      <div
        role="separator"
        aria-hidden="true"
        class="mx-8 hidden w-[1px] bg-stone-400 sm:block"
      ></div>
      <div class="hidden grow p-1 sm:block">
        <span class="text-2xl font-bold text-stone-900">Overture Maps </span
        ><span class="text-xs text-gray-600">with </span
        ><span class="font-bold text-gray-600"> DuckDB WASM</span>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
