<template>
  <div>
    <Suspense>
      <Dashboard />
      <template #fallback>
        <div class="op50 italic">
          <span class="animate-pulse">Loading...</span>
        </div>
      </template>
    </Suspense>
  </div>
</template>
