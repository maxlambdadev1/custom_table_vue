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
        <div class="flex items-center space-x-4">
          <select
            v-model="selectedCustomTable"
            @change="handleCustomTableSelect"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">-- Access Custom Table ({{ customTables.length }}) --</option>
            <option 
              v-for="table in customTables" 
              :key="table.id" 
              :value="table.id"
            >
              {{ table.name }}
            </option>
          </select>
          <button 
            class="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
            @click="createCustomTable"
          >
            Create custom table
          </button>
        </div>
      </div>
      
      <EntitiesTable 
        :globalSearch="searchString"
        :customTableId="selectedCustomTable"
        class="flex-1 flex flex-col min-h-0"
      />
    </div>
  </main>
</template>

<script>
import EntitiesTable from './EntitiesTable.vue'
import { customTablesService } from '../services/api.js'

export default {
  name: 'MainContent',
  components: {
    EntitiesTable
  },
  data() {
    return {
      searchString: '',
      customTables: [],
      selectedCustomTable: ''
    }
  },
  async mounted() {
    await this.fetchCustomTables()
  },
  methods: {
    async fetchCustomTables() {
      try {
        const result = await customTablesService.fetchCustomTables()
        if (result.success) {
          this.customTables = result.data || []
        } else {
          console.error('Failed to fetch custom tables:', result.error)
        }
      } catch (error) {
        console.error('Error fetching custom tables:', error)
      }
    },
    handleCustomTableSelect() {
      // Pass the selected custom table ID to EntitiesTable
      // EntitiesTable will handle the data fetching
    },
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