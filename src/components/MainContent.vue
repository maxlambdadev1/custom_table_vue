<template>
  <main class="flex-1 overflow-auto">
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex-1 max-w-md">
          <input
            type="text"
            v-model="searchString"
            placeholder="Search all columns..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <button 
          class="ml-4 px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
          @click="createCustomTable"
        >
          Create custom table
        </button>
      </div>
      
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 text-center text-gray-500">
          Content area - ready for custom table implementation
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'MainContent',
  data() {
    return {
      searchString: ''
    }
  },
  methods: {
    createCustomTable() {
      console.log('Create custom table clicked')
    }
  },
  computed: {
    baseUrl() {
      return import.meta.env.VITE_BASE_URL
    }
  }
}
</script>