<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="closeModal"
  >
    <div
      class="bg-white rounded-lg shadow-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto"
    >
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Table Builder</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="px-6 py-6 space-y-6">
        <!-- Row 1: Table Configuration -->
        <div class="grid grid-cols-2 gap-6">
          <!-- Left Section: Datapoints Selection -->
          <div>
            <!-- Table Name Input -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Insert Table Name
              </label>
              <input
                type="text"
                v-model="tableName"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter table name..."
              />
            </div>

            <!-- Select Datapoints -->
            <div class="border border-gray-300 rounded-lg p-4">
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Select Datapoints
              </label>
              <div
                class="flex text-xs font-medium text-gray-600 mb-2 pb-2 border-b border-gray-200"
              >
                <div class="flex-1">Column</div>
                <div class="w-16 text-center">Includes</div>
              </div>
              <div class="space-y-2 max-h-64 overflow-y-auto">
                <div
                  v-for="field in entityFields"
                  :key="field"
                  class="flex items-center py-2 hover:bg-gray-50"
                >
                  <div class="flex-1 text-sm text-gray-700">{{ field }}</div>
                  <div class="w-16 flex justify-center">
                    <input
                      type="checkbox"
                      :checked="selectedFields.includes(field)"
                      @change="toggleField(field)"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Section: New Table -->
          <div>
            <div class="mb-4 h-10"></div>
            <!-- Spacer to align with left section -->

            <div class="border border-gray-300 rounded-lg p-4">
              <label class="block text-sm font-medium text-gray-700 mb-3">
                New Table
              </label>
              <div
                class="flex text-xs font-medium text-gray-600 mb-2 pb-2 border-b border-gray-200"
              >
                <div class="flex-1">Column Name</div>
                <div class="w-32">Select Column Type</div>
              </div>
              <div class="space-y-2 max-h-64 overflow-y-auto">
                <div
                  v-for="field in selectedFields"
                  :key="field"
                  class="flex items-center py-2 space-x-2"
                >
                  <input
                    type="text"
                    :value="field"
                    @input="updateFieldName(field, $event.target.value)"
                    class="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <select
                    v-model="fieldTypes[field]"
                    class="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="TEXT">TEXT</option>
                    <option value="NUMBER">NUMBER</option>
                    <option value="DATE">DATE</option>
                    <option value="BOOLEAN">BOOLEAN</option>
                  </select>
                </div>
                <div
                  v-if="selectedFields.length === 0"
                  class="text-sm text-gray-500 text-center py-4"
                >
                  Select datapoints from the left to configure columns
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Row 2: Share With -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Share with
          </label>
          <input
            type="text"
            v-model="sharedWith"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Use @ to tag user names OR user groups to share this table with"
          />
        </div>

        <!-- Row 3: Action Buttons -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            @click="closeModal"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="createTable"
            :disabled="!canCreate"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TableBuilderModal",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    entityFields: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["close", "create"],
  data() {
    return {
      tableName: "",
      selectedFields: [],
      fieldTypes: {},
      fieldNames: {},
      sharedWith: "",
    };
  },
  computed: {
    canCreate() {
      return this.tableName.trim() !== "" && this.selectedFields.length > 0;
    },
  },
  watch: {
    isVisible(newVal) {
      if (newVal) {
        this.resetForm();
      }
    },
  },
  methods: {
    resetForm() {
      this.tableName = "";
      this.selectedFields = [];
      this.fieldTypes = {};
      this.fieldNames = {};
      this.sharedWith = "";
    },
    closeModal() {
      this.$emit("close");
    },
    toggleField(field) {
      const index = this.selectedFields.indexOf(field);
      if (index > -1) {
        // Remove field
        this.selectedFields.splice(index, 1);
        delete this.fieldTypes[field];
        delete this.fieldNames[field];
      } else {
        // Add field
        this.selectedFields.push(field);
        this.fieldTypes[field] = "TEXT"; // Default type
        this.fieldNames[field] = field; // Default name
      }
    },
    updateFieldName(originalField, newName) {
      this.fieldNames[originalField] = newName;
    },
    createTable() {
      if (!this.canCreate) {
        return;
      }

      const tableData = {
        name: this.tableName.trim(),
        selectedFields: this.selectedFields,
        fieldTypes: this.fieldTypes,
        fieldNames: this.fieldNames,
        sharedWith: this.sharedWith.trim(),
      };

      this.$emit("create", tableData);
    },
  },
};
</script>
