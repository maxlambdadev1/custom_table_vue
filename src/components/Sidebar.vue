<template>
  <aside class="w-64 flex-shrink-0 bg-gray-50 border-r border-gray-200 h-full">
    <nav class="p-4">
      <ul class="space-y-2">
        <li>
          <button 
            class="w-full text-left px-4 py-2 rounded-lg font-medium transition-colors"
            :class="activeItem === 'entities' ? 'bg-sky-500 text-white' : 'text-gray-700 hover:bg-gray-200'"
            @click="setActiveItem('entities')"
          >
            Entities
          </button>
        </li>
        <li>
          <button 
            class="w-full text-left px-4 py-2 rounded-lg font-medium transition-colors"
            :class="activeItem === 'api-control' ? 'bg-sky-500 text-white' : 'text-gray-700 hover:bg-gray-200'"
            @click="setActiveItem('api-control')"
          >
            API Control
          </button>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      activeItem: 'entities'
    }
  },
  methods: {
    setActiveItem(item) {
      this.activeItem = item
    }
  }
}
</script>