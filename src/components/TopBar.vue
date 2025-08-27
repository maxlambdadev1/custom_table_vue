<template>
  <header class="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
    <div class="flex items-center justify-between px-6 py-4">
      <div class="flex items-center space-x-4">
        <h1 class="text-xl font-semibold text-gray-900">{{ appName }}</h1>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {{ env }}
        </span>
      </div>
      <div>
        <span class="text-lg font-medium text-gray-700">Entities</span>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'TopBar',
  computed: {
    appName() {
      return import.meta.env.VITE_APP_NAME || 'Custom Table Vue'
    },
    env() {
      return import.meta.env.VITE_ENV || 'Development'
    }
  }
}
</script>