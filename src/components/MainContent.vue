<template>
  <main class="flex-1 flex flex-col">
    <div class="p-6 flex-1 flex flex-col">
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
      
      <EntitiesTable 
        :globalSearch="searchString"
        class="flex-1 flex flex-col min-h-0"
      />
    </div>
  </main>
</template>

<script>
import EntitiesTable from './EntitiesTable.vue'

export default {
  name: 'MainContent',
  components: {
    EntitiesTable
  },
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