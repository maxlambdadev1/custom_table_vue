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
            <option value="">
              -- Access Custom Table ({{ customTables.length }}) --
            </option>
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
        ref="entitiesTable"
        @columns-loaded="handleColumnsLoaded"
        class="flex-1 flex flex-col min-h-0"
      />
    </div>

    <!-- Table Builder Modal -->
    <TableBuilderModal
      :isVisible="showTableBuilderModal"
      :entityFields="entityFields"
      @close="closeTableBuilderModal"
      @create="handleCreateTable"
    />
  </main>
</template>

<script>
import EntitiesTable from "./EntitiesTable.vue";
import TableBuilderModal from "./TableBuilderModal.vue";
import { customTablesService } from "../services/api.js";

export default {
  name: "MainContent",
  components: {
    EntitiesTable,
    TableBuilderModal,
  },
  data() {
    return {
      searchString: "",
      customTables: [],
      selectedCustomTable: "",
      showTableBuilderModal: false,
      entityFields: [],
      isCreatingTable: false,
    };
  },
  async mounted() {
    await this.fetchCustomTables();
  },
  methods: {
    async fetchCustomTables() {
      try {
        const result = await customTablesService.fetchCustomTables();
        if (result.success) {
          this.customTables = result.data || [];
        } else {
          console.error("Failed to fetch custom tables:", result.error);
        }
      } catch (error) {
        console.error("Error fetching custom tables:", error);
      }
    },
    handleCustomTableSelect() {
      // Pass the selected custom table ID to EntitiesTable
      // EntitiesTable will handle the data fetching
    },
    handleColumnsLoaded(columns) {
      this.entityFields = columns;
    },
    createCustomTable() {
      this.showTableBuilderModal = true;
    },
    closeTableBuilderModal() {
      this.showTableBuilderModal = false;
    },
    async handleCreateTable(tableData) {
      if (this.isCreatingTable) {
        return;
      }

      this.isCreatingTable = true;

      try {
        // Format the data according to the API specification
        const apiData = {
          name: tableData.name,
          src_table: "entities",
          rows: tableData.selectedFields, // Array of original column names from entities table
          datapoints: tableData.selectedFields.map(
            (field) => tableData.fieldNames[field] || field
          ), // Array of updated names from right section
          columns: tableData.selectedFields.map((field) => ({
            name: tableData.fieldNames[field] || field,
            type: tableData.fieldTypes[field] || "TEXT",
          })),
          sharedWith: tableData.sharedWith || "",
        };
        const result = await customTablesService.createCustomTable(apiData);

        if (result.success) {
          // Close modal
          this.showTableBuilderModal = false;

          // Refresh custom tables list
          await this.fetchCustomTables();

          // Select the newly created table if it has a config_id
          if (result.data && result.data.config_id) {
            this.selectedCustomTable = result.data.config_id.toString();
          }

          console.log("Table created successfully:", result.data);
        } else {
          console.error("Failed to create table:", result.error);
          alert("Failed to create table: " + result.error);
        }
      } catch (error) {
        console.error("Error creating table:", error);
        alert("Error creating table: " + error.message);
      } finally {
        this.isCreatingTable = false;
      }
    },
  },
  computed: {
    baseUrl() {
      return import.meta.env.VITE_BASE_URL;
    },
  },
};
</script>
