<template>
  <div class="flex flex-col h-full w-full max-w-full">
    <!-- Loading State -->
    <div
      v-if="loading"
      class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
    >
      <div class="flex items-center justify-center space-x-3">
        <div
          class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"
        ></div>
        <span class="text-blue-700 font-medium">Loading...</span>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-if="error"
      class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
    >
      <div class="flex items-center justify-between">
        <span class="text-red-700">Error loading: {{ error }}</span>
        <button
          @click="fetchData"
          class="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white rounded-lg shadow flex-1 flex flex-col" style="max-width: calc(100vw - 256px - 48px);">
      <!-- Single Table with Sticky Header -->
      <div class="overflow-auto" style="height: calc(100vh - 250px);">
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table Header -->
          <thead class="bg-gray-50 sticky top-0 z-30 shadow-sm">
            <tr>
              <!-- Select All Checkbox -->
              <th class="px-6 py-3 text-left bg-gray-50 sticky left-0 z-40 border-r border-gray-200" style="width: 64px;">
                <input
                  type="checkbox"
                  :checked="allSelected"
                  @change="toggleSelectAll"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <!-- First Column Header - Fixed -->
              <th
                v-if="columns.length > 0"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky left-16 z-40 border-r border-gray-200"
                style="width: 200px;"
              >
                <div class="flex items-center space-x-2">
                  <span>{{ columns[0] }}</span>
                  <!-- Sort Icons -->
                  <div class="flex flex-col">
                    <button
                      @click="handleSort(columns[0], 'asc')"
                      :class="[
                        'text-gray-400 hover:text-gray-600',
                        sortBy === columns[0] && sortDir === 'asc'
                          ? 'text-blue-600'
                          : '',
                      ]"
                    >
                      ▲
                    </button>
                    <button
                      @click="handleSort(columns[0], 'desc')"
                      :class="[
                        'text-gray-400 hover:text-gray-600 -mt-1',
                        sortBy === columns[0] && sortDir === 'desc'
                          ? 'text-blue-600'
                          : '',
                      ]"
                    >
                      ▼
                    </button>
                  </div>
                </div>
                <!-- Column Filter -->
                <div class="mt-2">
                  <input
                    type="text"
                    v-model="filters[columns[0]]"
                    @input="handleFilter"
                    :placeholder="`Filter ${columns[0]}...`"
                    class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </th>
              <!-- Remaining Column Headers - Scrollable -->
              <th
                v-for="column in columns.slice(1)"
                :key="column"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style="width: 200px;"
              >
                <div class="flex items-center space-x-2">
                  <span>{{ column }}</span>
                  <!-- Sort Icons -->
                  <div class="flex flex-col">
                    <button
                      @click="handleSort(column, 'asc')"
                      :class="[
                        'text-gray-400 hover:text-gray-600',
                        sortBy === column && sortDir === 'asc'
                          ? 'text-blue-600'
                          : '',
                      ]"
                    >
                      ▲
                    </button>
                    <button
                      @click="handleSort(column, 'desc')"
                      :class="[
                        'text-gray-400 hover:text-gray-600 -mt-1',
                        sortBy === column && sortDir === 'desc'
                          ? 'text-blue-600'
                          : '',
                      ]"
                    >
                      ▼
                    </button>
                  </div>
                </div>
                <!-- Column Filter -->
                <div class="mt-2">
                  <input
                    type="text"
                    v-model="filters[column]"
                    @input="handleFilter"
                    :placeholder="`Filter ${column}...`"
                    class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="entities.length === 0">
              <td
                :colspan="columns.length + 1"
                class="px-6 py-4 text-center text-gray-500"
              >
                No entities found
              </td>
            </tr>
            <tr
              v-else
              v-for="(entity, index) in entities"
              :key="index"
              class="hover:bg-gray-50"
            >
              <!-- Row Checkbox - Fixed -->
              <td class="px-6 py-4 bg-white sticky left-0 z-20 border-r border-gray-200" style="width: 64px;">
                <input
                  type="checkbox"
                  :checked="selectedRows.includes(index)"
                  @change="toggleRowSelect(index)"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </td>
              <!-- First Column Data - Fixed -->
              <td
                v-if="columns.length > 0"
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 bg-white sticky left-16 z-20 border-r border-gray-200"
                style="width: 200px;"
                v-html="highlightSearchText(entity[columns[0]], getSearchTermsForColumn(columns[0]))"
              >
              </td>
              <!-- Remaining Column Data - Scrollable -->
              <td
                v-for="column in columns.slice(1)"
                :key="column"
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                style="width: 200px;"
                v-html="highlightSearchText(entity[column], getSearchTermsForColumn(column))"
              >
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 flex-shrink-0">
        <div class="flex items-center justify-between">
          <!-- Left: Page Selection -->
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-700">Page:</label>
            <select
              v-model="currentPage"
              @change="handlePageChange"
              class="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option v-for="page in totalPages" :key="page" :value="page">
                {{ page }}
              </option>
            </select>
          </div>

          <!-- Center: Pagination Buttons -->
          <div class="flex items-center space-x-2">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage <= 1"
              class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <template v-for="page in paginationPages" :key="page">
              <button
                v-if="page !== '...'"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-1 border border-gray-300 rounded text-sm',
                  currentPage === page
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'hover:bg-gray-50',
                ]"
              >
                {{ page }}
              </button>
              <span v-else class="px-3 py-1 text-sm text-gray-500">...</span>
            </template>

            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage >= totalPages"
              class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          <!-- Right: Results Info and Page Size -->
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-700">
              {{ fromResult }} to {{ toResult }} of {{ total }}
            </div>
            <div class="flex items-center space-x-2">
              <label class="text-sm text-gray-700">Page size:</label>
              <select
                v-model="pageSize"
                @change="handlePageSizeChange"
                class="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="25">25</option>
                <option value="100">100</option>
                <option value="500">500</option>
                <option value="1000">1000</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { entitiesService } from "../services/api.js";

export default {
  name: "EntitiesTable",
  props: {
    globalSearch: {
      type: String,
      default: "",
    },
    customTableId: {
      type: [String, Number],
      default: null
    }
  },
  emits: ['columns-loaded'],
  data() {
    return {
      loading: false,
      error: null,
      entities: [],
      total: 0,
      currentPage: 1,
      pageSize: 25,
      sortBy: null,
      sortDir: "asc",
      filters: {},
      selectedRows: [],
      columns: [],
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.pageSize);
    },
    allSelected() {
      return (
        this.entities.length > 0 &&
        this.selectedRows.length === this.entities.length
      );
    },
    fromResult() {
      return this.total === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
    },
    toResult() {
      return Math.min(this.currentPage * this.pageSize, this.total);
    },
    paginationPages() {
      const pages = [];
      const maxVisible = 5;
      const start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      const end = Math.min(this.totalPages, start + maxVisible - 1);

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < this.totalPages) {
        if (end < this.totalPages - 1) pages.push("...");
        pages.push(this.totalPages);
      }

      return pages;
    },
  },
  watch: {
    globalSearch: {
      handler() {
        this.fetchData();
      },
      immediate: false,
    },
    customTableId: {
      handler() {
        this.currentPage = 1;
        this.columns = [];
        this.selectedRows = [];
        this.fetchData();
      },
      immediate: false,
    }
  },
  async mounted() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.error = null;

      try {
        const result = await entitiesService.fetchEntities({
          page: this.currentPage,
          page_size: this.pageSize,
          sort_by: this.sortBy,
          sort_dir: this.sortDir,
          global: this.globalSearch || null,
          filters: this.filters,
          customTableId: this.customTableId
        });

        if (result.success) {
          this.entities = result.data.results || [];
          this.total = result.data.total || 0;

          // Use columns from API response if available (for custom tables)
          if (result.data.columns && result.data.columns.length > 0) {
            this.columns = result.data.columns;
          } else if (this.entities.length > 0 && this.columns.length === 0) {
            // Fallback to entity keys for original entities
            this.columns = Object.keys(this.entities[0]);
          }

          // Emit columns for parent component to use (only for original entities, not custom tables)
          if (!this.customTableId && this.columns.length > 0) {
            this.$emit('columns-loaded', this.columns);
          }
        } else {
          this.error = result.error;
          
          // Handle sorting failure - clear sort and retry
          if (this.sortBy && this.customTableId && result.error.includes('sort')) {
            console.warn('Sorting failed, retrying without sort');
            this.sortBy = null;
            this.sortDir = 'asc';
            // Retry without sort
            setTimeout(() => {
              this.fetchData();
            }, 100);
            return;
          }
        }
      } catch (err) {
        this.error = err.message;
        
        // Handle potential sorting errors in catch block too
        if (this.sortBy && this.customTableId && err.message.includes('sort')) {
          console.warn('Sorting error caught, retrying without sort');
          this.sortBy = null;
          this.sortDir = 'asc';
          setTimeout(() => {
            this.fetchData();
          }, 100);
          return;
        }
      } finally {
        this.loading = false;
      }
    },
    handleSort(column, direction) {
      this.sortBy = column;
      this.sortDir = direction;
      this.currentPage = 1;
      this.fetchData();
    },
    handleFilter() {
      clearTimeout(this.filterTimeout);
      this.filterTimeout = setTimeout(() => {
        this.currentPage = 1;
        this.fetchData();
      }, 500);
    },
    handlePageChange() {
      this.fetchData();
    },
    handlePageSizeChange() {
      this.currentPage = 1;
      this.fetchData();
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchData();
      }
    },
    toggleSelectAll() {
      if (this.allSelected) {
        this.selectedRows = [];
      } else {
        this.selectedRows = [...Array(this.entities.length).keys()];
      }
    },
    toggleRowSelect(index) {
      const selectedIndex = this.selectedRows.indexOf(index);
      if (selectedIndex > -1) {
        this.selectedRows.splice(selectedIndex, 1);
      } else {
        this.selectedRows.push(index);
      }
    },
    highlightSearchText(text, searchTerms = []) {
      if (!text || searchTerms.length === 0) {
        return text || '-';
      }
      
      const textStr = String(text);
      let highlightedText = textStr;
      
      // Create a combined regex for all search terms (case-insensitive)
      const validSearchTerms = searchTerms.filter(term => term && term.trim() !== '');
      if (validSearchTerms.length === 0) {
        return textStr;
      }
      
      // Escape special regex characters and create pattern
      const escapedTerms = validSearchTerms.map(term => 
        term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      );
      const pattern = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
      
      // Replace matches with highlighted spans
      highlightedText = textStr.replace(pattern, '<mark class="bg-yellow-200 py-0.5 rounded">$1</mark>');
      
      return highlightedText;
    },
    getSearchTermsForColumn(columnName) {
      const searchTerms = [];
      
      // Add global search term
      if (this.globalSearch && this.globalSearch.trim() !== '') {
        searchTerms.push(this.globalSearch.trim());
      }
      
      // Add column-specific filter
      if (this.filters[columnName] && this.filters[columnName].trim() !== '') {
        searchTerms.push(this.filters[columnName].trim());
      }
      
      return searchTerms;
    }
  },
};
</script>
